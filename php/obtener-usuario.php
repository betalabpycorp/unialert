<?php

require_once __DIR__ . '/sesion.php';

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
   OBTENER DATOS
========================================= */

$nombre = $_SESSION['nombre'] ?? '';
$apellido = $_SESSION['apellido'] ?? '';
$correo = $_SESSION['correo'] ?? '';
$id_rol = $_SESSION['id_rol'] ?? 0;


/* =========================================
   DETERMINAR TIPO DE USUARIO
========================================= */

if ($id_rol == 1) {

    $tipo_usuario = 'Técnico';

} elseif ($id_rol == 3) {

    $tipo_usuario = 'Profesor';

} else {

    $tipo_usuario = 'Usuario';

}


/* =========================================
   RESPUESTA
========================================= */

echo json_encode([
    'ok' => true,
    'nombre' => $tipo_usuario . ' ' . $nombre . ' ' . $apellido,
    'correo' => $correo,
    'rol' => $tipo_usuario
]);