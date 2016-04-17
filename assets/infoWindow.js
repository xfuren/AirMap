var InfoWindow = {
	elementID: '#infoWindow',
	item: null,
	instance: null,
	boot: function(){
		if( !this.instance ){
			this.instance = new google.maps.InfoWindow();
			this.bindEvent();
		}
	},
	putOn: function(Site){
		this.boot();
		this.item = Site;

		var content = this.getContent();
		this.instance.setContent(content);
		this.instance.setPosition(Site.getPosition());
		this.instance.open(Map.getMapInstance());
	},
	bindEvent: function(){
		var self = this;
		var $mapElement = $(Map.getMapElement());

		google.maps.event.addListener(this.instance, 'domready', function(){
			$mapElement.trigger('infoWindowReady', [self.item]);
		});

		google.maps.event.addListener(this.instance, 'closeclick', function(){
			$mapElement.trigger('infoWindowClose', [self.item]);
		});
	},
	_getTbody: function(values){
		if( !values ){ return '';}

		var html = '';
		for(var type in values){
			var value = values[type];

			html += [
				"<tr><td>",
				type,
				"</td><td>",
				value,
				"</td></tr>"
			].join('');
		}
		return html;
	},
	getDataTbody: function(){
		return this._getTbody(this.item.getProperty('Data'));
	},
	getRawDataTbody: function(){
		return this._getTbody(this.item.getProperty('RawData'));
	},
	getContent: function(){
		return this.item.getTitle();
	}
}