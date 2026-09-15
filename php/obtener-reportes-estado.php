<?php

require_once __DIR__ . '/sesion.php';
require_once __DIR__ . '/conexion.php';

header('Content-Type: application/json; charset=utf-8');


/* =========================================
   VERIFICAR SESIÓN
========================================= */

if (
    empty($_SESSION['logged_in']) ||
    empty($_SESSION['user_id'])
) {

    http_response_code(401);

    echo json_encode([
        'ok' => false,
        'error' => 'No hay una sesión activa'
    ]);

    exit;
}


/* =========================================
   OBTENER ESTADO
========================================= */

$id_estado = isset($_GET['estado'])
    ? intval($_GET['estado'])
    : 0;


if ($id_estado <= 0) {

    http_response_code(400);

    echo json_encode([
        'ok' => false,
        'error' => 'Estado no válido'
    ]);

    exit;
}


try {

    $db = (new Database())->getConnection();


    /* =========================================
       CONSULTAR REPORTES
    ========================================= */

    $sql = "
        SELECT
            r.id_reporte,
            r.aula,
            r.descripcion,
            r.imagen,
            r.fecha_reporte,
            e.nombre AS estado,
            tp.nombre AS tipo

        FROM reporte r

        LEFT JOIN estado e
            ON r.id_estado = e.id_estado

        LEFT JOIN tipo_problema tp
            ON r.id_tipo = tp.id_tipo

        WHERE
            r.id_usuario = :id_usuario
            AND r.id_estado = :id_estado

        ORDER BY r.fecha_reporte DESC
    ";


    $stmt = $db->prepare($sql);


    $stmt->execute([
        ':id_usuario' => $_SESSION['user_id'],
        ':id_estado' => $id_estado
    ]);


    $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode([
        'ok' => true,
        'reportes' => $reportes
    ]);


} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'error' => 'Error al obtener los reportes',
        'detalle' => $e->getMessage()
    ]);

    exit;
}