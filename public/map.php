<!DOCTYPE html>
<html lang="">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<meta property="og:title" content="Taiwan Air Quality Map">
		<meta property="og:description" content="台灣空汙觀測地圖">
		<meta property="og:type" content="website">
		<meta property="og:url" content="http://airmap.g0v.asper.tw/">
		<meta property="og:image" content="http://airmap.g0v.asper.tw/image/screenshot.png">

		<title>Taiwan Air Quality Map</title>
		<link rel='shortcut icon' type='image/x-icon' href='image/favicon.png' />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css">
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
			<a href="http://beta.hackfoldr.org/g0vairmap/g0v--riRTvbB0E5x">
				<img src="image/g0v.png" class="img-responsive" alt="Image">
			</a>
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
					<div class="title">
						<div class="siteGroup">LASS</div>
						<div class="siteName">FT1_015</div>
					</div>
					<div class="measures">
						<div class="measure pm25">
							<div class="header">
								<div class="type">PM 2.5</div>
							</div>							
							<div class='value'>55</div>
						</div>
						<div class="measure humidity">
							<div class="header">
								<div class="type">濕度</div>
								<div class="unit">%</div>
							</div>
							<div class='value'>55.55</div>
						</div>
						<div class="measure temperature">
							<div class="header">
								<div class="type">溫度</div>
								<div class="unit">&#8451;</div>
							</div>
							<div class='value'>55.44</div>
						</div>
					</div>
				</div>

				<div class="chart-section">
					<canvas id="chart" width="800" height="300"></canvas>
	
					<div class="loading">						
						<div class="spinner">
							<div class="rect1"></div>
							<div class="rect2"></div>
							<div class="rect3"></div>
							<div class="rect4"></div>
							<div class="rect5"></div>
						</div>
					</div>
				</div>

				<div class='label-section clearfix'>
					<div class="col-xs-6">
						<a class="chart-datasource" target="_blank">
							<span class="btn btn-darker btn-xs" title="Chart Datasource">
								<span class="glyphicon glyphicon-hdd"></span>
								<span class="visible-md-inline visible-lg-inline">Chart Json</span>
							</span>
						</a>
						<div id="chart-control">
							<span class="btn btn-darker btn-xs" data-range="Hourly" title="過去一小時歷史數值">
								<span class="visible-xs-inline visible-sm-inline">H</span>
								<span class="visible-md-inline visible-lg-inline">Hourly</span>
							</span>

							<span class="btn btn-darker btn-xs" data-range="Daily" title="過去一天歷史數值">
								<span class="visible-xs-inline visible-sm-inline">D</span>
								<span class="visible-md-inline visible-lg-inline">Daily</span>
							</span>

							<span class="btn btn-darker btn-xs" data-range="Weekly" title="過去一週歷史數值">
								<span class="visible-xs-inline visible-sm-inline">W</span>
								<span class="visible-md-inline visible-lg-inline">Weekly</span>
							</span>

							<span class="btn btn-darker btn-xs" data-range="Monthly" title="過去一個月歷史數值">
								<span class="visible-xs-inline visible-sm-inline">M</span>
								<span class="visible-md-inline visible-lg-inline">Monthly</span>
							</span>
						</div>
					</div>

					<div class="col-xs-6 resource-label">
						<div class="detail">
							<a href='#' target='_blank' class="btn btn-darker btn-xs" title="站點詳細資訊">
								<span class="glyphicon glyphicon-list-alt"></span>
								<span class="visible-md-inline visible-lg-inline">Site Detail</span>
							</a>
						</div>
						<div class="source">
							<a href='#' target='_blank' class="btn btn-darker btn-xs" title="Site Json">
								<span class="glyphicon glyphicon-hdd"></span>
								<span class="visible-md-inline visible-lg-inline">Site Json</span>
							</a>
						</div>
						<div class="updateTime">
							<a href='#' target='_blank' class="btn btn-darker btn-xs">
								<span class="glyphicon glyphicon-time"></span>
								<span class="visible-md-inline visible-lg-inline">更新時間</span>
								<span class="time visible-md-inline visible-lg-inline"></span>
							</a>
						</div>
					</div>					
				</div>				
			</div>

			<div class="announcement">
				<div>
					本零時空汙觀測網僅彙整公開資料提供視覺化參考，並不對資料數據提供保證，實際測值以各資料來源為準。
				</div>
			</div>
		</div>

		<div id="siteGroupSelector" class="typeSelector"></div>

		<div id="levelIndicatorLevel"></div>

		<div id="indicateTypeSelector" class="typeSelector"></div>
		

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
 		<script src="http://maps.google.com/maps/api/js?key=AIzaSyBfhb3bOt_jBPFN2WDzkhX8k518Yc7CLBw"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/zh-tw.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.0.1/Chart.bundle.js"></script>
 		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-55384149-4', 'auto');
		  ga('send', 'pageview');

		</script>

 		<script src="assets/map.js"></script> 
 		<script src="assets/indicator.js"></script>
 		<script src="assets/infoWindow.js"></script>
 		<script src="assets/infoPanel.js"></script>
 		<script src="assets/chart.js"></script>
 		<script src="assets/siteResource.js"></script>
 		<script src="assets/site.js"></script>
 		<script src="assets/areaSite.js"></script>
		<script src="assets/dataSource.js"></script>
 		
 		<script>	
		$("#map").on('mapBootCompelete', function(){
			DataSource.boot();
		});

		$("#map").on("dataSourceLoadCompelete", function(e, source, data){
			sitesTools.removeAll();
			var i = 0;
			var siteGroups = [];
			data.map(function(item){
				var site = new Site(item);
				if( site.isValid() ){ 
					setTimeout(function(){
						site.createMarker(); 
					}, i * 30);
					i++;

					//collect SiteGroup
					var SiteGroup = site.getProperty('SiteGroup');
					if( SiteGroup.length && siteGroups.indexOf(SiteGroup) == -1 ){
						siteGroups.push(SiteGroup);
					}					
				}

				//var areaSite = new AreaSite(item);
				// if( areaSite.isValid() ){ 
				// 	areaSite.createMarker(); 
				// }
			});

			sitesTools.generateSiteGroupSelector(siteGroups);
		});
			
		$(function(){
			var optionsLatLng = getUrlLatLng();
			var options = optionsLatLng ? {center: optionsLatLng, zoom:18} : {};
			Map.boot(options);
			Indicator.boot();
			InfoPanel.boot();
			// GeoJson.boot();
		})

		function getUrlLatLng(){
			var param = location.href.replace(location.protocol + '//' + location.host + '/', '');

			if(param.indexOf('@') > -1){
				var latLng = param.replace('@', '').split(',', 2);
				return {
					lat: parseFloat(latLng.shift()),
					lng: parseFloat(latLng.shift()),
				}
			}

			return null;
		}
		</script>
	</body>
</html>