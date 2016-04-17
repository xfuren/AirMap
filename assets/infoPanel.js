var InfoPanel = {
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
		});

		$mapElement.on("infoWindowClose", function(e, site){
			self.showManual(site);
		});
	},
	showManual: function(){
		$(this.elementID)
			.find('.content').hide().end()
			.find('.manual').show().end();
	},
	showItem: function(site){
		//site header
		$(this.elementID).find(".site-header")
			.find('.siteName').text(site.getTitle()).end()
			.find('.measures')
				.find('.pm25 .value').text(site.getMeasure('PM2.5')).end()
				.find('.humidity .value').text(site.getMeasure('Humidity')).end()
				.find('.temperature .value').text(site.getMeasure('Temperature')).end();

		//source
		$(this.elementID).find(".source a").attr('href', site.getJsonLink());

		//updateTime
		$(this.elementID).find(".updateTime .time").text(site.getProperty('Data')['Create_at']);

		//Data & RawData
		this._genDataHtml('Data', site.getProperty('Data'));
		this._genDataHtml('RawData', site.getProperty('RawData'));

		$(this.elementID)
			.find('.content').show().end()
			.find('.manual').hide().end();
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