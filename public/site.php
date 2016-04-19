<!DOCTYPE html>
<html lang="">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>AirMap Site List</title>
		<link rel='shortcut icon' type='image/x-icon' href='favicon.png' />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.1/bootstrap-table.min.css">
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->
		<style>
		html, body{ padding: 0 20px; }
		</style>
	</head>
	<body>
		<nav class="navbar navbar-default" role="navigation">
			<div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a href="http://beta.hackfoldr.org/g0vairmap/g0v--riRTvbB0E5x" class=""><img src="image/g0v.png" class="img-responsive" alt="Image" style="max-height:40px; margin:5px 0;"></a>
				</div>
		
				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse navbar-ex1-collapse">
					<ul class="nav navbar-nav" role="tablist">
						<li role="presentation" class="active">
							<a href="#active" aria-controls="home" role="tab" data-toggle="tab" title="最後更新時間在一小時內">
								<span class="glyphicon glyphicon-ok-sign"></span>
								有效站點
							</a>
						</li>
						<li role="presentation">
							<a href="#deactive" aria-controls="tab" role="tab" data-toggle="tab" title="最後更新時間超過一小時">
								<span class="glyphicon glyphicon-question-sign"></span>
								過期站點
							</a>
						</li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<a href='/' class="btn btn-success navbar-btn">Map</a>
						<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">DataSource <span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li><a href="http://g0vairmap.3203.info/Data/ProbeCube_last.json">ProbeCube</a></li>
								<li><a href="http://g0vairmap.3203.info/Data/EPA_last.json">EPA</a></li>
								<li><a href="http://g0vairmap.3203.info/Data/LASS_last.json">LASS</a></li>
								<li><a href="http://g0vairmap.3203.info/Data/Indie_last.json">Indie</a></li>
								<li><a href="http://g0vairmap.3203.info/Data/Airbox_last.json">Airbox</a></li>
								<li><a href="http://g0vairmap.3203.info/Data/webduino_last.json">Webduino</a></li>
							</ul>
						</li>
					</ul>
				</div><!-- /.navbar-collapse -->
			</div>
		</nav>

		<div class="container">

			<div class="toolbar site-active">
				<div class="form-inline" role="form">
					<div class="form-group">
						<label>Site Group</label>
						<select name="siteGroup" class="form-control"></select>
					</div>
				</div>
			</div>

			<div class="toolbar site-deactive">
				<div class="form-inline" role="form">
					<div class="form-group">
						<label>Site Group</label>
						<select name="siteGroup" class="form-control"></select>
					</div>
				</div>
			</div>

			<div role="tabpanel">
				<div class="tab-content">
					<div role="tabpanel" class="tab-pane active" id="active">
						<table id="table-active" class="bsTable table table-striped" 
							   data-url="json/airmap.json"
							   data-toolbar=".toolbar.site-active"
							   data-search="true" 
							   data-toggle="table" data-detail-view="true" 
							   data-detail-formatter="bsTable.formatter.detail" 
							   >
							<thead>
								<tr>
									<th data-formatter="bsTable.formatter.sn">#</th>
									<th data-field="SiteGroup" data-sortable="true">Site Group</th>
									<th data-field="SiteName" data-sortable="true" data-searchable="true" data-formatter="bsTable.formatter.siteName">Site Name</th>
									<th data-field="Maker" data-sortable="true" data-searchable="true">Maker</th>
									<th data-field="LatLng" data-sortable="true" data-formatter="bsTable.formatter.location">Location</th>
									<th data-field="Data.Create_at" data-sortable="true" data-formatter="bsTable.formatter.updateTime">Update Time</th>
								</tr>
							</thead>
						</table>
					</div>
					<div role="tabpanel" class="tab-pane" id="deactive">
						<table id="table-deactive" class="bsTable table table-striped" 
							   data-url="json/deactivesite.json"
							   data-toolbar=".toolbar.site-deactive"
							   data-search="true" 
							   data-toggle="table" data-detail-view="true" 
							   data-detail-formatter="bsTable.formatter.detail" 
							   >
							<thead>
								<tr>
									<th data-formatter="bsTable.formatter.sn">#</th>
									<th data-field="SiteGroup" data-sortable="true">Site Group</th>
									<th data-field="SiteName" data-sortable="true" data-searchable="true" data-formatter="bsTable.formatter.siteName">Site Name</th>
									<th data-field="Maker" data-sortable="true" data-searchable="true">Maker</th>
									<th data-field="LatLng" data-sortable="true" data-formatter="bsTable.formatter.location">Location</th>
									<th data-field="Data.Create_at" data-sortable="true" data-formatter="bsTable.formatter.updateTime">Update Time</th>
								</tr>
							</thead>
						</table>
					</div>
				</div>
			</div>

			<hr>

			<div id="footer" class="well well-sm" style="text-align: center;">
				Asper &copy; 2016 <a href='https://github.com/Aspertw/AirMap'>GitHub</a>
			</div>
		</div>
		

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.1/bootstrap-table.min.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/zh-tw.js"></script>
		<script>
		moment.updateLocale('zh-tw', {
			relativeTime: {
				m : '1分鐘',
				h : '1小時',
				d : '1天',
				M : '1個月',
				y : '1年',
			}
		});

		$(function(){
			// siteName hashtag
			var siteName = window.location.hash.substr(1);
			if(siteName){
				siteName = decodeURIComponent(siteName);
				bsTable.event.filter('SiteName', siteName);
			}
			
			$(".bsTable").on('load-success.bs.table', function(e, data){
				bsTable.event.loadSiteGroup($(this), data);
			});

		});

		var bsTable = {
			formatter: {
				sn: function(value, row, index){
					return 1+index;
				},
				location: function(value, row, index){
					var url = "https://www.google.com.tw/maps/place/" + value.lat + ',' + value.lng;
					var text = [value.lat, value.lng].join(', ');
					return "<a href='" + url + "' target='_blank'>" + text + "</a>";
				},
				detail: function(index, row, element){
					return [
						"<div class='col-sm-6'>",
						bsTable.generate.table("<h4>Data</h4>", ['Type', 'Value'], row.Data),
						"</div>",
						"<div class='col-sm-6'>",
						bsTable.generate.table("<h4>RawData</h4>", ['Type', 'Value'], row.RawData),
						"</div>",
					].join('');
				},
				updateTime: function(time){
					var human = moment(time).fromNow();
					var dataTime = moment(time).format('YYYY-MM-DD HH:mm');
					return human + ' (' + dataTime + ')';
				},
				siteName: function(name){
					return name;

					// TODO: site hash filter

					var url = window.location.hash + "#" + name;
					return "<a href='" + url + "' target='_blank'>" + name + "</a>";
				}
			},
			generate: {
				siteOptions: function(data){
					var siteGroups = [];
					data.map(function(site){
						if( siteGroups.indexOf(site.SiteGroup) < 0){
							siteGroups.push(site.SiteGroup);
						}
					});

					var options = "<option value='all'>All</option>";
					siteGroups.map(function(name){
						options += "<option value='" + name + "'>" + name + "</option>";
					});

					return options;
				},
				table: function(title, head, body){
					var headHtml = '<tr><th>' + head.join('</th><th>') + '</th></tr>';

					var bodyHtml = '';
					for(index in body){
						var value = body[index];
						bodyHtml += [
							'<tr><td>',
							index,
							"</td><td>",
							value,
							"</td></tr>"
						].join('');
					}

					return [
						title,
						"<table class='table table-striped'>",
						"<thead>",
						headHtml,
						"</thead>",
						"<tbody>",
						bodyHtml,
						"</tbody>",
						"</table>",
					].join('');
				}
			},
			event: {
				loadSiteGroup: function($table, data){
					var $select = $( $table.data('toolbar') ).find('select[name=siteGroup]');
					$select.html(bsTable.generate.siteOptions(data));
					
					$select.change(function(){
						var group = $(this).val();

						var filterValue = null;
						if( group != 'all' ){
							filterValue = group;
						}

						bsTable.event.filter($table, 'SiteGroup', filterValue);
					});
				},
				filter: function($table, key, value){
					var filter = $table.data('filter') || {};

					if( value == null && filter[key] ){
						delete filter[key];
					}else{
						filter[key] = value;
					}					

					$table.data('filter', filter)
						  .bootstrapTable('filterBy', filter);
				},
			}
		}
		</script>
	</body>
</html>
	