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
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/7.1.0/css/bootstrap-slider.min.css">
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
					<filter id="dropshadow" height="150%">
						<feGaussianBlur in="SourceAlpha" stdDeviation="1"/> 
						<feOffset dx="3" dy="3" result="offsetblur"/> 
						<feMerge> 
							<feMergeNode/>
							<feMergeNode in="SourceGraphic"/> 
						</feMerge>
					</filter>
				</defs>
				<circle r="30" stroke="#FFFFFF" stroke-width="1" fill="{{background}}" filter="url(#dropshadow)"/>
				<text x="0" y="13" fill="#232F3A" text-anchor="middle" style="font-size:30px; font-weight: bolder;">{{text}}</text>
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

		<div id="siteGroupSelector" class="typeSelector" style="display:none;"></div>

		<div id="levelIndicatorLevel"></div>

		<div id="indicateTypeSelector" class="typeSelector" style="display:none;"></div>

		<div id="windLayerCtrl" style="display:none;">
			<div class="msg"></div>
			<p></p>
			<div class="switch">
				<button type="button" class="btn btn-block btn-warning btn-on">開啟</button>
				<button type="button" class="btn btn-block btn-default btn-off" style="display: none;">關閉</button>
			</div>
			<p></p>
				<div class="slider-container">
					<label>線條亮度 <code class="value"></code></label>
					<input type="text" class="form-control" data-type="fillOpacity" data-slider-min="1" data-slider-max="9" data-slider-step="1" title="線條亮度">
				</div>
				<div class="slider-container">
					<label>移動速度 <code class="value"></code></label>
					<input type="text" class="form-control" data-type="moveSpeed" data-slider-min="1" data-slider-max="40" data-slider-step="1" data-slider-reversed=true title="移動速度">
				</div>
			<p></p>
			<div class="help-block">
				<div><span class="glyphicon glyphicon-info-sign"></span> 地圖縮放等級<=4時，風力線因繪製異常會自動隱藏。</div>
				<div><span class="glyphicon glyphicon-alert"></span> 風力線十分消耗資源，容易造成瀏覽器當機，請斟酌使用。</div>
				<div id="refTime" style="display:none">
					<span class="glyphicon glyphicon-time"></span>
					資料時間: <span class="localTime"></span> UTC+8 
					(5, 11, 17, 23半整點更新資料)
				</div>
			</div>
		</div>
		
		<div id="navigator">
			<button type="button" class="btn btn-default" title="測站篩選" data-content-container='#siteGroupSelector'>
				<span class="short">站</span>
				<span class="long">測站篩選</span>
			</button>
			<button type="button" class="btn btn-default" title="量測類別" data-content-container='#indicateTypeSelector'>
				<span class="short">量</span>
				<span class="long">量測類別</span>
			</button>
			<button type="button" class="btn btn-default" title="風力線" data-content-container='#windLayerCtrl'>
				<span class="short">風</span>
				<span class="long">風力線</span>
			</button>
			<button type="button" class="voronoi btn btn-default" title="勢力地圖 Voronoi Diagram">
				<span class="short">勢</span>
				<span class="long">勢力地圖</span>
			</button>
			<a class="btn btn-default" title="測站列表" href='/site'>
				<span class="short">表</span>
				<span class="long">測站列表</span>
			</a>
			<button type="button" class="comment btn btn-default" title="Leave a Comment">
				<span class="glyphicon glyphicon-comment"></span>
				<span class="long">Comment</span>
			</button>
			<a class="btn btn-default" target="_blank" title="About" href='/about'>
				<span class="glyphicon glyphicon-info-sign"></span>
				<span class="long">About</span>
			</a>	
		</div>

		<div id="disqus_panel">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<div class="title"></div>
			<div id="disqus_thread"></div>
		</div>

		<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/7.1.0/bootstrap-slider.min.js"></script>		
		<script src="//maps.google.com/maps/api/js?key=AIzaSyBfhb3bOt_jBPFN2WDzkhX8k518Yc7CLBw"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/zh-tw.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.0.1/Chart.bundle.js"></script>
		<script src="//d3js.org/d3.v3.min.js"></script>
		<script src="//airmap.disqus.com/count.js" id="dsq-count-scr" async></script>
		<script src="assets/windy.js"></script>
		<script src="assets/CanvasLayer.js"></script>

		<script src="assets/map.js"></script> 
		<script src="assets/indicator.js"></script>
		<script src="assets/infoWindow.js"></script>
		<script src="assets/infoPanel.js"></script>
		<script src="assets/chart.js"></script>
		<script src="assets/siteResource.js"></script>
		<script src="assets/site.js"></script>
		<!-- <script src="assets/areaSite.js"></script> -->
		<script src="assets/dataSource.js"></script>
		<script src="assets/windLayer.js"></script>
		<script src="assets/voronoiOverlap.js"></script>
		<script src="assets/map-main.js"></script>
	</body>
</html>