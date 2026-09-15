<?php

require_once __DIR__ . '/sesion.php';
require_once __DIR__ . '/conexion.php';

header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        "error" => "Método no permitido"
    ]);

    exit;
}



$input = json_decode(
    file_get_contents("php://input"),
    true
);


$email = trim(
    $input['email'] ?? ''
);


$password = $input['password'] ?? '';



if (!$email || !$password) {

    http_response_code(400);

    echo json_encode([
        "error" => "Faltan credenciales"
    ]);

    exit;
}



try {


    $db = (new Database())->getConnection();



    $stmt = $db->prepare("

        SELECT

            id_usuario,
            nombre,
            apellido,
            correo,
            password,
            id_rol

        FROM usuario

        WHERE correo = :correo

        LIMIT 1

    ");



    $stmt->execute([

        ':correo' => $email

    ]);



    $user = $stmt->fetch();



    if (

        !$user ||

        !password_verify(
            $password,
            $user['password']
        )

    ) {


        http_response_code(401);


        echo json_encode([

            "error" => "Credenciales inválidas"

        ]);


        exit;

    }





    /*
    =========================================
       ACTUALIZAR HASH SI ES NECESARIO
    =========================================
    */


    if (

        password_needs_rehash(

            $user['password'],

            PASSWORD_DEFAULT

        )

    ) {


        $newHash = password_hash(

            $password,

            PASSWORD_DEFAULT

        );



        $db->prepare("

            UPDATE usuario

            SET password = :p

            WHERE id_usuario = :id

        ")->execute([

            ':p' => $newHash,

            ':id' => $user['id_usuario']

        ]);

    }







    /*
    =========================================
       CREAR SESIÓN
    =========================================
    */


    session_regenerate_id(true);



    $_SESSION['user_id'] =

        $user['id_usuario'];



    $_SESSION['nombre'] =

        $user['nombre'];



    $_SESSION['apellido'] =

        $user['apellido'];



    $_SESSION['nombre_completo'] =

        $user['nombre'] . ' ' . $user['apellido'];



    $_SESSION['correo'] =

        $user['correo'];



    $_SESSION['id_rol'] =

        $user['id_rol'];



    $_SESSION['logged_in'] = true;







    /*
    =========================================
       RESPUESTA
    =========================================
    */


    echo json_encode([


        "mensaje" => "Login exitoso",



        "usuario" => [


            "id" =>

                $user['id_usuario'],



            "nombre" =>

                $user['nombre'] . ' ' .

                $user['apellido'],



            "correo" =>

                $user['correo'],



            "id_rol" =>

                $user['id_rol']

        ]


    ]);



} catch (PDOException $e) {


    http_response_code(500);



    error_log(

        $e->getMessage()

    );



    echo json_encode([


        "error" =>

            "Error del servidor",



        "detalle" =>

            $e->getMessage()

    ]);

}