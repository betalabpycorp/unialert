<?php

require_once __DIR__ . '/sesion.php';

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'session_id' => session_id(),
    'session' => $_SESSION
]);