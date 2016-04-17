<?php
date_default_timezone_set('Asia/Taipei');

$prefix = "http://g0vairmap.3203.info/Data/";

$sources = [
	"ProbeCube_last.json",
	"EPA_last.json",
	"LASS_last.json",
	"Indie_last.json",
	"Airbox_last.json",
	"webduino_last.json",
];	


$sites = [];
foreach($sources as $source){
	$url = $prefix . $source;

	$response = file_get_contents($url);
	$data = json_decode($response, true);

	if( !is_array($data) || !count($data) ){
		continue;
	}

	foreach($data as $item){
		if( filterCreateAt($item['Data']['Create_at']) ){
			$sites[] = $item;
		}
	}
}

setExpire();
jsonResponse($sites);

function filterCreateAt($timeStr){
	if( !strlen($timeStr) ){ return false; }

	$time = strtotime($timeStr);
	$gap = 60 * 60; //60mins

	return (bool)( (time() - $time) <= $gap );
}

function setExpire($secs = 1800){		
	header("Cache-Control: max-age={$secs}, must-revalidate"); 		
	header("Expires: " . gmdate("D, d M Y H:i:s", time() + $secs) . " GMT");
}

function jsonResponse($response){		
	if( is_array($response) ){
		$response = json_encode($response);
	}

	header('Content-Type: application/json');
	echo $response;
	exit;
}