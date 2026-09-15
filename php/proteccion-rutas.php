<?php
require_once __DIR__ . '/sesion.php';

function requireLogin() {
    if (empty($_SESSION['logged_in'])) {
        http_response_code(401);
        header("Content-Type: application/json");
        echo json_encode(["error" => "No autenticado"]);
        exit;
    }
}

function requireRole($roles) {
    requireLogin();
    if (!in_array($_SESSION['id_rol'], (array)$roles)) {
        http_response_code(403);
        header("Content-Type: application/json");
        echo json_encode(["error" => "Acceso denegado"]);
        exit;
    }
}