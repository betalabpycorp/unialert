<?php
require_once __DIR__ . '/sesion.php';
header("Content-Type: application/json");
echo json_encode([
    "logged_in" => !empty($_SESSION['logged_in']),
    "nombre"    => $_SESSION['nombre'] ?? null,
    "id_rol"    => $_SESSION['id_rol'] ?? null
]);