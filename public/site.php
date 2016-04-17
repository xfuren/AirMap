<!DOCTYPE html>
<html lang="">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title></title>

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
		<div class="container">
			<h1>AirMap Site List</h1>
			<div class="row">
				<div id="toolbar" class="">
					<div class="form-inline" role="form">
						<div class="form-group">
							<span>Site Group</span>
							<select name="siteGroup" class="form-control"></select>
						</div>
					</div>
				</div>

				<table id="table" class="table table-striped" 
					   data-toolbar="#toolbar"
					   data-search="true" 
					   data-toggle="table" data-detail-view="true" 
					   data-detail-formatter="bsTable.formatter.detail" 
					   data-url="json/airmap.json">
					<thead>
						<tr>
							<th data-field="SiteGroup" data-sortable="true">Site Group</th>
							<th data-field="SiteName" data-sortable="true" data-searchable="true">Site Name</th>
							<th data-field="Maker" data-sortable="true" data-searchable="true">Maker</th>
							<th data-field="LatLng" data-sortable="true" data-formatter="bsTable.formatter.location">Location</th>
							<th data-field="Data.Create_at" data-sortable="true" data-formatter="bsTable.formatter.updateTime">Update Time</th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
		

		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.1/bootstrap-table.min.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script>
 		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/zh-tw.js"></script>
		<script>
		$('#table').on('load-success.bs.table', function(e, data){
			bsTable.event.loadSiteGroup(data);
			bsTable.event.search();
		});

		var bsTable = {
			formatter: {
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
				loadSiteGroup: function(data){
					var $select = $("select[name=siteGroup");
					$select.html(bsTable.generate.siteOptions(data));
					$select.change(function(){
						var group = $(this).val();

						var filterValue = null;
						if( group != 'all' ){
							filterValue = group;
						}

						bsTable.event.filter('SiteGroup', filterValue);
					});
				},
				search: function(){
					$("input[name=search]").keyup(function(){
						var text = $(this).val();
						
						var filterValue = null;
						if( text.length ){
							filterValue = text;
						}

						bsTable.event.filter('SiteGroup', filterValue);
					});
				},
				filter: function(key, value){
					var filter = $("#table").data('filter') || {};

					if( value == null && filter[key] ){
						delete filter[key];
					}else{
						filter[key] = value;
					}					

					$("#table").data('filter', filter)
							   .bootstrapTable('filterBy', filter);
				},
			}
		}
		</script>
	</body>
</html>
	