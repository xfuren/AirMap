function Site(data){
	if( !this.isValid(data) ){ data = {}; }

	this.setProperties(data);
	this.marker = null;
	this.features = [];

	//events
	var self = this;
	$(Map.getMapInstance()).on("indicatorTypeChange", function(e, type){
		self.updateMarkerColor();
	});
}

Site.prototype.setProperties = function(item){
	if( !item.Data || !item.Data.Create_at ){
		this.property = {};
		return;
	}

	var human = moment(item.Data.Create_at).fromNow();

	var dataTime = moment(item.Data.Create_at).format('YYYY-MM-DD HH:mm');

	item.Data.Create_at = human + ' (' + dataTime + ')';

	this.property = item;

};

Site.prototype.isValid = function(item){
	//time filter
	return moment().diff(moment(item.Data.Create_at), 'minutes') <= 60;
};

Site.prototype.getProperty = function(key){
	if( this.property[key] ){
		return this.property[key]
	}
	return null;
};

Site.prototype.getMeasure = function(measureType){
	if( measureType == 'PM2.5' ){ measureType = 'Dust2_5'; }
	if( measureType == 'PM2.5_NASA' ){ measureType = 'Dust2_5'; }

	var value = this.property['Data'][measureType]
				||  this.property['RawData'][measureType];

	return value ? parseFloat(value) : null;
};

Site.prototype.getTitle = function(){
	return '[' + this.getProperty('SiteGroup') + '] ' + this.getProperty('SiteName');
}

Site.prototype.getJsonLink = function(){
	switch( this.getProperty('SiteGroup') ){
		case 'LASS':
			return "http://nrl.iis.sinica.edu.tw/LASS/show.php?device_id=" + this.getProperty('SiteName');
			break;

		default:
			return "http://api.thingspeak.com/channels/" + this.getProperty('Channel_id');
			break;
	}
}

Site.prototype.getMeasureColor = function(){
	var measureType = Indicator.getPresentType();
	var value = this.getMeasure(measureType);
	return value ? Indicator.getLevelColor(value) : 'transparent';
}

Site.prototype.getPosition = function(){
	var LatLng = this.getProperty('LatLng');
	if( LatLng && LatLng.lat && LatLng.lng ){
		return new google.maps.LatLng(LatLng.lat, LatLng.lng);
	}
	return null;
}

Site.prototype.getIconSVG = function(){
	var $markerIcon = document.querySelector('.markerIcon');
	var iconSvg = $markerIcon.innerHTML || '';

	var color = this.getMeasureColor();
	if( !color ){ return; }

	var url = 'data:image/svg+xml;charset=utf-8,' + 
			   encodeURIComponent( iconSvg.replace('{{background}}', color) );
	return {
		anchor: new google.maps.Point(16, 16),
		url: url,
	};
}

Site.prototype.createMarker = function(options){
	if( this.marker ){
		this.removeMarker();		
	}

	options = options || {};	
	var position = this.getPosition();
	if( !position ){
		console.log("position not avaliable");
		return false;
	}

	var option = {
		'title': this.getTitle(),
		'position': position,
		'map': Map.getMapInstance(),
	};

	if( icon = this.getIconSVG() ){
		option['icon'] = icon;
	}

	this.marker = new google.maps.Marker( $.extend(option, options) );

	var self = this;
	google.maps.event.addListener(this.marker, 'click', function(){
		self.openInfoWindow();
	});
}

Site.prototype.getMarker = function(){
	return this.marker;
}

Site.prototype.removeMarker = function(){
	if( this.marker ){ this.marker.setMap(null); }
}

Site.prototype.updateMarkerColor = function(){
	// console.log('updateMarkerColor');
	var marker = this.getMarker();
	if( marker ){
		marker.setIcon(this.getIconSVG());
	}
}

Site.prototype.openInfoWindow = function(){
	InfoWindow.putOn(this);
}