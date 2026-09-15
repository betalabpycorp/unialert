<?php
require_once __DIR__ . '/sesion.php';
$_SESSION = [];
if (ini_get("session.use_cookies")) {
    setcookie(session_name(), '', time() - 42000, '/');
}
session_destroy();
header("Content-Type: application/json");
echo json_encode(["mensaje" => "Sesión cerrada"]);