<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$code = $_GET['code'];

$url = 'https://www.correos.cl/web/guest/seguimiento-en-linea?p_p_id=cl_cch_seguimiento_portlet_seguimientoenlineaportlet_INSTANCE_rsbcMueFRL4k&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=cl_cch_seguimiento_portlet_seguimientoresurcecommand&p_p_cacheability=cacheLevelPage&_cl_cch_seguimiento_portlet_seguimientoenlineaportlet_INSTANCE_rsbcMueFRL4k_cmd=cmd_resource_get_seguimientos&_cl_cch_seguimiento_portlet_seguimientoenlineaportlet_INSTANCE_rsbcMueFRL4k_param_nro_seguimiento='.$code;

$ch = curl_init();

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);             
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_REFERER, 'https://www.correos.cl/web/guest/seguimiento-en-linea?codigos='.$code);

$result = curl_exec($ch);

$result = str_replace("\"{","{",$result);
$result = str_replace("}\"","}",$result);
$result = str_replace("\\\"","\"",$result);

// var_dump($result);

header('Content-Type: application/json');
$data = json_decode($result, true);
$data["queriedNumber"] = $code;
echo json_encode($data);
?>