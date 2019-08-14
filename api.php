<?php 

$url = 'https://seguimientoenvio.correos.cl/Home/data';

$data = array("id" => $_GET['code']);

$data_string = json_encode($data);   
$ch = curl_init($url);                                                                      
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string))                                                                       
);                                                                                                                   
                                                                                                                     
$result = curl_exec($ch);

$rest_data = json_decode($result)->rest;
$rest_data = json_decode($rest_data);
header('Content-Type: application/json');
echo json_encode($rest_data);

?>