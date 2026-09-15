<?php
require_once __DIR__ . '/sesion.php';
require_once __DIR__ . '/conexion.php';

class Database {

    private $host = "db.wksehwwcgxtrhofcagib.supabase.co";
    private $port = "5432";
    private $db_name = "postgres";
    private $username = "postgres";
    private $password = "unialert2026";

    public $conn;

    public function getConnection() {

        $this->conn = null;

        try {

            $this->conn = new PDO(
                "pgsql:host={$this->host};port={$this->port};dbname={$this->db_name}",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );

        } catch (PDOException $e) {

            error_log("DB Error: " . $e->getMessage());
            die(json_encode(["error" => "Error de conexión"]));

        }

        return $this->conn;
    }
}