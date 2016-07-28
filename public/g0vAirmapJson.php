<?php
date_default_timezone_set('Asia/Taipei');

$memcache = new Memcached;
$memcacheKeyPrefix = 'nGVA2HhYph5i1b8Byx8642Gw4s3ug1li';
$memcacheExpireSecs = 5 * 60; //5 mins

$jsonType = call_user_func(function(){
	$matches = [];
	preg_match("/\/([a-zA-Z]+).json/", $_SERVER['REQUEST_URI'], $matches);
	return isset($matches[1]) ? $matches[1] : null;
});

$sites = $memcache->get($memcacheKeyPrefix . $jsonType);
if( $sites === false ){
	$sites = fetchRemote($jsonType);
	$memcache->set($memcacheKeyPrefix . $jsonType, json_encode($sites), $memcacheExpireSecs);
}

setExpire();
jsonResponse($sites);


function fetchRemote($jsonType){
	$g0vPrefix = "http://g0vairmap.3203.info/Data/";

	$sources = [
		// $g0vPrefix . "EPA_last.json",
		$g0vPrefix . "ProbeCube_last.json",
		$g0vPrefix . "LASS_last.json",
		$g0vPrefix . "Indie_last.json",
		$g0vPrefix . "Airbox_last.json",
		$g0vPrefix . "webduino_last.json",
		"http://taqm.g0v.asper.tw/airmap.json",
	];	


	$sites = [];
	foreach($sources as $source){
		$url = $source;

		$response = file_get_contents($url);
		$data = json_decode($response, true);
		
		if( !is_array($data) || !count($data) ){
			continue;
		}

		foreach($data as $item){
			if( !isset($item['Data']['Create_at']) ){ continue; }

			$valid = filterCreateAt($item['Data']['Create_at']);

			if( $jsonType == 'airmap' && $valid ){
				$sites[] = $item;
			}

			if( $jsonType == 'deactivesite' && !$valid ){
				$sites[] = $item;
			}
		}
	}

	return $sites;
}


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