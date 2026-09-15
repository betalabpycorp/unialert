<?php
require_once __DIR__ . '/conexion.php';

$db = (new Database())->getConnection();
$stmt = $db->prepare("SELECT password FROM usuario WHERE correo = :c");
$stmt->execute([':c' => 'soporte2026']);
$hash = $stmt->fetchColumn();

if (!$hash) {
    die("❌ No se encontró el usuario con correo soporte2026");
}

echo "Hash en BD: <code>" . htmlspecialchars($hash) . "</code><br><br>";

$pruebas = ['soporte2026', 'admin1234', 'admin', '123456', 'soporte', 'gonzalo', 'Soporte2026'];

foreach ($pruebas as $p) {
    $ok = password_verify($p, $hash) ? "✅ SÍ coincide" : "❌ no";
    echo "<b>$p</b> → $ok<br>";
}