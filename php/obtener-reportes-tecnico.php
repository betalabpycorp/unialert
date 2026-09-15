<?php

require_once __DIR__ . '/sesion.php';
require_once __DIR__ . '/conexion.php';

header('Content-Type: application/json; charset=utf-8');



/*
=========================================
   VERIFICAR SESIÓN
=========================================
*/

if (
    empty($_SESSION['logged_in']) ||
    empty($_SESSION['user_id'])
) {

    http_response_code(401);

    echo json_encode([
        'ok' => false,
        'error' => 'No autenticado'
    ]);

    exit;
}





/*
=========================================
   VERIFICAR QUE SEA TÉCNICO
=========================================
*/

if (($_SESSION['id_rol'] ?? 0) != 1) {

    http_response_code(403);

    echo json_encode([
        'ok' => false,
        'error' => 'No tenés permisos para acceder a estos reportes'
    ]);

    exit;
}





try {


    $db = (new Database())->getConnection();



    /*
    =========================================
       RECIBIR FILTRO
    =========================================
    */


    $estado = $_GET['estado'] ?? 'todos';





    /*
    =========================================
       CONSULTA BASE
    =========================================
    */


    $sql = "

        SELECT

            r.id_reporte,

            r.aula,

            r.descripcion,

            r.imagen,

            r.fecha_reporte,

            r.fecha_final,

            e.nombre AS estado,

            tp.nombre AS tipo,

            u.nombre,

            u.apellido,

            u.correo


        FROM reporte r


        INNER JOIN estado e

            ON r.id_estado = e.id_estado


        INNER JOIN tipo_problema tp

            ON r.id_tipo = tp.id_tipo


        INNER JOIN usuario u

            ON r.id_usuario = u.id_usuario

    ";



    $parametros = [];





    /*
    =========================================
       FILTRAR POR ESTADO
    =========================================
    */


    if ($estado !== "todos") {


        if ($estado == "resuelto") {


            $sql .= "

                WHERE e.nombre = 'Resuelto'

            ";


        }


        elseif ($estado == "proceso") {


            $sql .= "

                WHERE e.nombre = 'En proceso'

            ";


        }


        elseif ($estado == "pendiente") {


            $sql .= "

                WHERE e.nombre = 'Pendiente'

            ";


        }


    }





    $sql .= "

        ORDER BY r.fecha_reporte DESC

    ";






    $stmt = $db->prepare($sql);


    $stmt->execute($parametros);



    $reportes =

        $stmt->fetchAll(PDO::FETCH_ASSOC);





    echo json_encode([

        'ok' => true,

        'reportes' => $reportes

    ]);





} catch (Throwable $e) {


    http_response_code(500);


    error_log($e->getMessage());


    echo json_encode([

        'ok' => false,

        'error' => 'Error del servidor',

        'detalle' => $e->getMessage()

    ]);


    exit;

}