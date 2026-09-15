<?php
require_once __DIR__ . '/conexion.php';
header("Content-Type: application/json");

$db = (new Database())->getConnection();

$tipos = $db->query("SELECT id_tipo, nombre FROM tipo_problema ORDER BY id_tipo")
            ->fetchAll();

echo json_encode(["tipos" => $tipos]);