<?php

require_once __DIR__ . '/sesion.php';
require_once __DIR__ . '/conexion.php';

header("Content-Type: application/json");

// Verificar sesión
if (empty($_SESSION['logged_in'])) {

    http_response_code(401);

    echo json_encode([
        "error" => "No autenticado"
    ]);

    exit;
}

// Verificar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        "error" => "Método no permitido"
    ]);

    exit;
}

// Obtener datos
$aula = trim($_POST['aula'] ?? '');
$id_tipo = intval($_POST['id_tipo'] ?? 0);
$descripcion = trim($_POST['descripcion'] ?? '');

$id_usuario = $_SESSION['user_id'];

// Validar campos
if (!$aula || !$id_tipo || !$descripcion) {

    http_response_code(400);

    echo json_encode([
        "error" => "Faltan campos obligatorios"
    ]);

    exit;
}

// ==========================================
// PROCESAR IMAGEN OPCIONAL
// ==========================================

$rutaImagen = null;

if (
    isset($_FILES['imagen']) &&
    $_FILES['imagen']['error'] === UPLOAD_ERR_OK
) {

    $permitidos = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp'
    ];

    $tipoImagen = mime_content_type(
        $_FILES['imagen']['tmp_name']
    );

    if (!in_array($tipoImagen, $permitidos)) {

        http_response_code(400);

        echo json_encode([
            "error" => "Solo se permiten imágenes JPG, PNG o WEBP"
        ]);

        exit;
    }

    if ($_FILES['imagen']['size'] > 5 * 1024 * 1024) {

        http_response_code(400);

        echo json_encode([
            "error" => "La imagen no puede superar 5 MB"
        ]);

        exit;
    }

    $extension = pathinfo(
        $_FILES['imagen']['name'],
        PATHINFO_EXTENSION
    );

    $nombreArchivo =
        'reporte_' .
        time() .
        '_' .
        bin2hex(random_bytes(4)) .
        '.' .
        $extension;

    $carpetaDestino = __DIR__ . '/../uploads/';

    if (!is_dir($carpetaDestino)) {

        mkdir(
            $carpetaDestino,
            0777,
            true
        );
    }

    if (
        move_uploaded_file(
            $_FILES['imagen']['tmp_name'],
            $carpetaDestino . $nombreArchivo
        )
    ) {

        $rutaImagen = 'uploads/' . $nombreArchivo;
    }
}

// ==========================================
// GUARDAR REPORTE
// ==========================================

try {

    $db = (new Database())->getConnection();

    $stmt = $db->prepare("
        INSERT INTO reporte
        (
            id_usuario,
            id_tipo,
            aula,
            descripcion,
            imagen,
            fecha_reporte,
            id_estado
        )
        VALUES
        (
            :id_usuario,
            :id_tipo,
            :aula,
            :descripcion,
            :imagen,
            NOW(),
            1
        )
        RETURNING id_reporte
    ");

    $stmt->execute([
        ':id_usuario' => $id_usuario,
        ':id_tipo' => $id_tipo,
        ':aula' => $aula,
        ':descripcion' => $descripcion,
        ':imagen' => $rutaImagen
    ]);

    $row = $stmt->fetch();

    echo json_encode([
        "mensaje" => "Reporte enviado correctamente",
        "id_reporte" => $row['id_reporte']
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "error" => "Error del servidor",
        "detalle" => $e->getMessage()
    ]);

    exit;
}