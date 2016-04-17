<!DOCTYPE html>
<html lang="">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Taiwan Air Quality Map</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" href="assets/map.css">
		<link rel="stylesheet" href="assets/infoPanel.css">
		<link rel="stylesheet" href="assets/levelIndicatorLevel.css">
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body>
		<div id="siteLogo">
			<img src="image/g0v.png" class="img-responsive" alt="Image">
		</div>

		<div class="markerIcon" style='display: none;'>
			<svg width="30" height="30" viewBox="-40 -40 100 80" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<filter id="dropshadow" height="130%">
						<feGaussianBlur in="SourceAlpha" stdDeviation="1"/> 
						<feOffset dx="5" dy="5" result="offsetblur"/> 
						<feMerge> 
							<feMergeNode/>
							<feMergeNode in="SourceGraphic"/> 
						</feMerge>
					</filter>
				</defs>
				<circle r="32" stroke="#FFF" stroke-width="3" fill="{{background}}" filter="url(#dropshadow)"/>
			</svg>
		</div>
	
		<div class="map-container">			
			<div id="map"></div>
		</div>

		<div id="info-panel">
			<div class="manual">
				<center>點選站點取得詳細資料</center>
			</div>

			<div class="content">
				<div class="site-header">
					<div class="pull-left title">
						<div class="siteName">[ProbeCube] 臺中市野生動物保育學會</div>
					</div>
					<div class="pull-right measures">
						<div class="measure pm25">
							<div class="type">PM 2.5</div>
							<div class="value-container">
								<span class='value'>55</span>
								<span class="unit">μg/m3</span>
							</div>
						</div>
						<div class="measure humidity">
							<div class="type">濕度</div>
							<div class="value-container">
								<span class='value'>55</span>
								<span class="unit">%</span>
							</div>
						</div>
						<div class="measure temperature">
							<div class="type">溫度</div>
							<div class="value-container">
								<span class='value'>55</span>
								<span class="unit">&#8451;</span>
							</div>
						</div>
					</div>
					<div class="clearfix"></div>
				</div>

				<div class='label-section'>
					<div class="source">
						<a href='#' target='_blank'><span class="label label-info">Source</span></a>
					</div>
					<div class="updateTime">
						<span class="label label-success">更新時間</span>
						<span class="time"></span>
					</div>
				</div>

				<div class="detail-data">
					<div class="template" style="display:none;">
						<div class="measure">
							<span class="type label label-primary"></span>
							<span class="value"></span>
						</div>
					</div>

					<div class="data-container">
						<table class="table table-hover">
						<tr class="Data">
							<th class="head">觀測資料</th>
							<td></td>
						</tr>
						<tr class="RawData">
							<th class="head">原始資料</th>
							<td></td>
						</tr>
						</table>
					</div>
				</div>	
			</div>

			<div class="announcement">
				<div>
					本零時空汙觀測網僅彙整公開資料提供視覺化參考，並不對資料數據提供保證，實際測值以各資料來源為準。
				</div>
			</div>
		</div>

		<div id="levelIndicatorLevel"></div>

		<div id="indicateTypeSelector"></div>
		

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
 		<script src="http://maps.google.com/maps/api/js?key=AIzaSyBfhb3bOt_jBPFN2WDzkhX8k518Yc7CLBw"></script>
 		<script src="https://google-maps-utility-library-v3.googlecode.com/svn-history/r391/trunk/markerwithlabel/src/markerwithlabel.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/zh-tw.js"></script>
 		

 		<script src="assets/map.js"></script> 		
 		<script src="assets/indicator.js"></script>
 		<script src="assets/infoWindow.js"></script>
 		<script src="assets/infoPanel.js"></script>
 		<script src="assets/site.js"></script>
		<script src="assets/dataSource.js"></script>

 		<!-- 
 		<script src="assets/map/areaDisplay.js"></script> -->
 		
 		<script>
		var sites = [];		
		$("#map").on('mapBootCompelete', function(){
			DataSource.boot();
		});

		$("#map").on("dataSourceLoadCompelete", function(e, source, data){
			data.map(function(item){
				var site = new Site(item);
				site.createMarker();
			});
		});
			
		$(function(){	
			Map.boot();
			Indicator.boot();
			InfoPanel.boot();
			// areaDisplay.boot();
		})
		</script>
	</body>
</html>