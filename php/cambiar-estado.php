<?php

require_once __DIR__.'/sesion.php';
require_once __DIR__.'/conexion.php';


header(
'Content-Type: application/json'
);



if(empty($_SESSION['logged_in'])){


echo json_encode([

"ok"=>false,

"error"=>"No autenticado"

]);

exit;

}



$data =
json_decode(
file_get_contents("php://input"),
true
);



$id_reporte =
$data['id_reporte'] ?? null;


$id_estado =
$data['id_estado'] ?? null;



if(!$id_reporte || !$id_estado){


echo json_encode([

"ok"=>false,

"error"=>"Datos incompletos"

]);

exit;

}



try{


$db =
(new Database())
->getConnection();



$stmt =
$db->prepare("

UPDATE reporte

SET id_estado = :estado

WHERE id_reporte = :reporte

");



$stmt->execute([

":estado"=>$id_estado,

":reporte"=>$id_reporte

]);



echo json_encode([

"ok"=>true

]);



}catch(Throwable $e){


echo json_encode([

"ok"=>false,

"error"=>$e->getMessage()

]);

}