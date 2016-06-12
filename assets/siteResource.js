var jqXHR = null;
function getSiteResource(site){
	if( !site ){ return null; }
	
	var ajaxRequest = function(url, param, cb){
		if(jqXHR != null){ jqXHR.abort(); }

		jqXHR = $.getJSON(url, param, function(data){
			if(cb) cb(data);
		});

		return url + '?' + $.param(param);
	}

	var lass = function(){
		var deviceID = site.getProperty('SiteName');
		
		var getLastestData = function(cb){
			var url = "http://nrl.iis.sinica.edu.tw/LASS/last.php?device_id=:id";
			url = url.replace(':id', deviceID);

			return ajaxRequest(url, {}, function(data){
				if(cb) cb(data['feeds'] || {});
			});

		};
		var getRangeData = function(range, cb){
			var url = "http://nrl.iis.sinica.edu.tw/LASS/history.php";
			var param = {
				device_id: deviceID,
				start: moment().utc().add(-1, range).format().replace('+00:00', 'Z'),
				end: moment().utc().format().replace('+00:00', 'Z'),
				results: 8000,
			}

			return ajaxRequest(url, param, function(data){
				if(cb) cb(data['feeds'] || {});
			});

			return url + '?' + $.param(param);;
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};
			var indexMapping = {
				's_d0': 'PM2.5',
				's_t0': 'Temperature',
				's_h0': 'Humidity',
			};

			feeds.map(function(feed){
				for(var index in feed){
					if( indexMapping[index] ){
						var type = indexMapping[index];
						var value = feed[index];

						if( !measures[type] ){ measures[type] = []; }
						measures[type].push(value);
					}
				}

				var label = moment(feed['timestamp']).format('MM-DD HH:mm');
				xAxis.push(label);
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		};

		return {
			jsonLink: "http://nrl.iis.sinica.edu.tw/LASS/history-hourly.php?device_id=" + deviceID,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	}

	var airbox = function(){
		var deviceID = site.getProperty('RawData')['device_id'];
		var momentFormat = 'x';
		var getLastestData = function(cb){
			var allDeviceLastMessageUrl = "http://airbox.asuscloud.com/airbox/messages/";

			return ajaxRequest(allDeviceLastMessageUrl, {}, function(data){
				if(cb) cb(data[deviceID] || {});
			});
		};
		var getRangeData = function(range, cb){
			var url = "http://airbox.asuscloud.com/airbox/device/:id/:startTimestamp/:endTimestamp";
			
			url = url.replace(':id', deviceID);
			url = url.replace(':startTimestamp', moment().add(-1, range).format(momentFormat) );
			url = url.replace(':endTimestamp', moment().format(momentFormat));

			return ajaxRequest(url, {}, function(data){
				if(cb) cb(data || {});
			});

			return url;
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};
			var indexMapping = {
				's_d0': 'PM2.5',
				's_t0': 'Temperature',
				's_h0': 'Humidity',
			};

			feeds.map(function(feed){
				for(var index in feed){
					if( indexMapping[index] ){
						var type = indexMapping[index];
						var value = feed[index];

						if( !measures[type] ){ measures[type] = []; }
						measures[type].push(value);
					}
				}

				var label = moment(feed['time']).format('MM-DD HH:mm');			
				xAxis.push(label);
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		};
		return {
			jsonLink: "http://airbox.asuscloud.com/airbox/device/" + deviceID,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	};

	var thingspeak = function(){
		var channelID = site.getProperty('Channel_id');
		var apiUrl = "https://api.thingspeak.com/channels/:id/feeds.json".replace(':id', channelID);
		var momentFormat = "YYYY-MM-DD HH:mm:SS";
		var fieldMapping = {};

		var parsefieldMapping = function(channelInfo){
			for(var index in channelInfo){
				if( index.indexOf('field') < 0 ){ continue; }

				fieldMapping[index] = channelInfo[index];
			}
		}
		var getLastestData = function(cb){
			var param = {
				results: 1,
				timezone: 'Asia/Taipei',
			}

			return ajaxRequest(apiUrl, param, function(data){
				parsefieldMapping(data.channel);
				if(cb) cb(data['feeds'] || {});
			});
		};
		var getRangeData = function(range, cb){
			var param = {
				start: moment().add(-1, range).format(momentFormat),
				end: moment().format(momentFormat),
				timezone: 'Asia/Taipei',
			}

			return ajaxRequest(apiUrl, param, function(data){
				parsefieldMapping(data.channel);
				if(cb) cb(data['feeds'] || {});
			});
		};
		var chartDataTransform = function(feeds){
			var xAxis = [];
			var measures = {};

			feeds.map(function(feed){
				for(var index in feed){
					var value = feed[index];

					if(index.indexOf('field') > -1 && value){
						var type = fieldMapping[index];
						if( !measures[type] ){ measures[type] = []; }

						measures[type].push(value);
					}
				}

				var label = moment(feed['created_at']).format('MM-DD HH:mm');
				xAxis.push(label);
			});

			return {
				xAxis: xAxis,
				measures: measures,
			}
		}		

		return {
			jsonLink: "http://api.thingspeak.com/channels/" + channelID,
			getLastestData: getLastestData,
			getRangeData: getRangeData,
			chartDataTransform: chartDataTransform,
		}
	};

	var resource;
	var siteGroup = site.getProperty('SiteGroup').toLowerCase();
	switch(siteGroup){
		case 'lass': 	resource = lass(); 		break;
		case 'airbox': 	resource = airbox(); 	break;
		
		case 'probecube':
		case 'miaoski':		
		default:
			resource = thingspeak();	break;
	}

	return {
		jsonLink: resource.jsonLink,
		getLastestData: resource.getLastestData,
		getRangeData: resource.getRangeData,
		getHourlyData: function(cb){
			return resource.getRangeData('hours', cb);
		},
		getDailyData: function(cb){
			return resource.getRangeData('days', cb);
		},
		getWeeklyData: function(cb){
			return resource.getRangeData('weeks', cb);
		},
		getMonthlyData: function(cb){
			return resource.getRangeData('months', cb);
		},
		getChartData: function(data){
			var feedsData = resource.chartDataTransform(data);
			var datasets = [];

			for(var label in feedsData.measures){
				var measure = feedsData.measures[label];
				datasets.push({
					label: label,
					data: measure,
				})
			}

			return {
				labels: feedsData.xAxis,
				datasets: datasets,
			}
		},
	}

	
}