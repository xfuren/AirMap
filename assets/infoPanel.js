var InfoPanel = {
	site: null,
	elementID: '#info-panel',
	boot: function(){
		this.bindEvent();
		this.showManual();
	},
	bindEvent: function(){
		var self = this;
		var $mapElement = $(Map.getMapElement());

		$mapElement.on("infoWindowReady", function(e, site){
			self.showItem(site);
			$("#chart-control .btn[data-range]").removeClass('active');
		});

		$mapElement.on("infoWindowClose", function(e, site){
			self.showManual(site);
		});

		$("#chart-control .btn[data-range]").click(function(){
			$(this).siblings().removeClass('active').end()
				   .addClass('active');
			

			$("#info-panel .chart-section").show();
			$("#info-panel .loading").show();

			var range = $(this).data('range');			
			var resource = self.site.getResource();
			var method = 'get' + range + 'Data';
			if( resource &&  resource[method] ){
				var resourceUrl = resource[method](function(data){
					var chartData = resource.getChartData(data);
					LineChart.start(chartData);

					$("#info-panel .loading").hide();
				});

				$(".chart-datasource").attr('href', resourceUrl);
			}
		});
	},
	showManual: function(){
		$(this.elementID)
			.find('.content').hide().end()
			.find('.manual').show().end();		
	},
	showItem: function(site, cb){
		this.site = site;

		$el = $(this.elementID);

		//site header
		var pm25 = Math.round(site.getMeasure('PM2.5') * 10)/10; 
		var humidity = Math.round(site.getMeasure('Humidity') * 10)/10; 
		var temperature = Math.round(site.getMeasure('Temperature') * 10)/10; 
		$el.find(".site-header")
			.find('.siteGroup').text(site.getProperty('SiteGroup')).end()
			.find('.siteName').text(site.getProperty('SiteName')).end()
			.find('.measures')
				.find('.pm25 .value').text(pm25).attr('title', pm25).end()
				.find('.humidity .value').text(humidity).attr('title', humidity).end()
				.find('.temperature .value').text(temperature).attr('title', temperature).end();

		//detail
		$el.find(".detail a").attr('href', '/site#' + site.getProperty('SiteName'));

		//source
		$el.find(".source a").attr('href', site.getJsonLink());

		//updateTime
		var Moment = moment(site.getProperty('Data')['Create_at']);
		var updateTime = Moment.fromNow() + ' (' + Moment.format('YYYY-MM-DD HH:mm') + ')';
		$el.find(".updateTime").attr('title', updateTime)
		   .find(".time").text(updateTime);

		//Data & RawData
		this._genDataHtml('Data', site.getProperty('Data'));
		this._genDataHtml('RawData', site.getProperty('RawData'));

		$el
			.find('.content').show().end()
			.find('.manual').hide().end();

		//load chart	
		$("#info-panel .chart-section").hide();

		if(cb) cb();
	},
	_genDataHtml: function(container, data){
		var $measure = $(this.elementID).find(".detail-data .template").clone();

		var html = '';
		for(var type in data){
			var value = data[type];

			html += $measure.find('.type').text(type).end()
							.find('.value').text(value).end()
							.html();
		}
		$(this.elementID).find(".detail-data .data-container ." + container + " td").html(html);
	}
}