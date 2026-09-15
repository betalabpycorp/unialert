<?php

require_once __DIR__ . '/sesion.php';
require_once __DIR__ . '/conexion.php';

header('Content-Type: application/json');

// Verificar sesión
if (empty($_SESSION['logged_in'])) {

    http_response_code(401);

    echo json_encode([
        'error' => 'No autenticado'
    ]);

    exit;
}

try {

    $db = (new Database())->getConnection();

    $id_usuario = $_SESSION['user_id'];

    $stmt = $db->prepare("
        SELECT
            r.id_reporte,
            r.aula,
            r.descripcion,
            r.imagen,
            r.fecha_reporte,
            r.fecha_final,
            e.nombre AS estado,
            tp.nombre AS tipo
        FROM reporte r

        INNER JOIN estado e
            ON r.id_estado = e.id_estado

        INNER JOIN tipo_problema tp
            ON r.id_tipo = tp.id_tipo

        WHERE r.id_usuario = :id_usuario

        ORDER BY r.fecha_reporte DESC

        LIMIT 5
    ");

    $stmt->execute([
        ':id_usuario' => $id_usuario
    ]);

    $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'reportes' => $reportes
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    error_log($e->getMessage());

    echo json_encode([
        'error' => 'Error del servidor',
        'detalle' => $e->getMessage()
    ]);

    exit;
}