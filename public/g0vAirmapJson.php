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
		// $g0vPrefix . "ProbeCube_last.json",
		// $g0vPrefix . "LASS_last.json",
		// $g0vPrefix . "Airbox_last.json",
		// $g0vPrefix . "webduino_last.json",
		"http://taqm.g0v.asper.tw/airmap.json", //epa
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-airbox.json",
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-lass.json",
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-probecube.json",
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-lass4u.json",
		"http://nrl.iis.sinica.edu.tw/LASS/last-all-webduino.json",
		$g0vPrefix . "Indie_last.json",
	];	


	$sites = [];
	foreach($sources as $source){
		$url = $source;

		$response = file_get_contents($url);
		$data = json_decode($response, true);
		
		if( !is_array($data) || !count($data) ){
			continue;
		}

		if( strpos($source, "nrl.iis.sinica.edu.tw") !== false ){
			$data = sinicaConverter($source, $data);
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

function parseGroupName($source){
	$pattern = "/LASS\/last-all-(.*?)\.json$/";
	$matches = [];
	if( preg_match($pattern, $source, $matches) != 1 ){
		return false;
	}
	return isset($matches[1]) ? strtoupper($matches[1]) : false;
}

function sinicaConverter($source, $data){
	$sinicaFieldMapping = [
		's_d0' => 'Dust2_5',
		's_d1' => 'PM10',
		's_d2' => 'PM1',
		's_h0' => 'Humidity',
		's_h2' => 'Humidity',
		's_t0' => 'Temperature',
	];

	$feeds = [];

	//parse group name
	$group = parseGroupName($source);
	if($group === false){ $group = "noGroup"; }
	if($group == "PROBECUBE"){ return sinicaProbecudeConverter($data['feeds']); }

	foreach($data['feeds'] as $feed){
		$data = ['Create_at' => $feed['timestamp']];
		foreach($feed as $field => $value){
			if( !isset($sinicaFieldMapping[$field]) ){ continue; }
			$mapping = $sinicaFieldMapping[$field];
			$data[$mapping] = $value;
		}

		$ret = [
			'SiteName' => $feed['SiteName'] ?: $feed['device_id'],
			'LatLng' => [
				'lat' => $feed['gps_lat'],
				'lng' => $feed['gps_lon'],
			],
			"SiteGroup" => $group,
			"Maker" => $group,
			"RawData" => $feed,
			"Data" => $data,
		];
		$feeds[] = $ret;
	}

	return $feeds;
}


function sinicaProbecudeConverter($data){
	$group = "PROBECUBE";
	$feeds = [];

	foreach($data as $feed){
		$ret = [
			'SiteName' => $feed['SiteName'],
			'LatLng' => [
				'lat' => $feed['gps_lat'],
				'lng' => $feed['gps_lon'],
			],
			"SiteGroup" => $group,
			"Maker" => $group,
			"RawData" => $feed,
			"Data" => [
				'Create_at' 	=> $feed['timestamp'],
				'Temperature' 	=> $feed['Temperature'],
				'Humidity' 		=> $feed['Humidity'],
				'Dust2_5' 		=> $feed['PM2_5'],
			],
		];
		$feeds[] = $ret;
	}

	return $feeds;
}