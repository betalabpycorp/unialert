<?php
ini_set('session.cookie_httponly', 1);  
ini_set('session.cookie_secure', 0);   
ini_set('session.use_strict_mode', 1);   
ini_set('session.cookie_samesite', 'Strict');

session_start();

if (!isset($_SESSION['last_regen'])) {
    $_SESSION['last_regen'] = time();
} elseif (time() - $_SESSION['last_regen'] > 1800) {
    session_regenerate_id(true);
    $_SESSION['last_regen'] = time();
}