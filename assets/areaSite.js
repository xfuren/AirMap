var GeoJson = {
	json: 'json/Town_MOI_1041215.json',
	init: false,
	jsonLoaded: false,
	listeners: [],
	boot: function(){
		if( this.init ){ return; }

		var self = this;
		$(Map.getMapElement()).on("GeoJsonLoaded", function(e, features){
			self.trigger();
			self.jsonLoaded = true;
		});

		Map.loadGeoJson(this.json);
		this.init = true;
	},
	addListener: function(cb){
		if( this.jsonLoaded ){
			cb();
			return;
		}

		if(cb){
			this.listeners.push(cb);
		}
	},
	trigger: function(){
		this.listeners.map(function(cb){
			cb();
		});
	}
}

function AreaSite(data){
	this.setProperties(data);
	this.features = [];

	if( !this.isValid() ){ return false; }	
	
	var self = this;
	GeoJson.addListener(function(){
		self.drawFeatures();
	});

	$(Map.getMapElement()).on("indicatorTypeChange", function(e, type){
		self.updateFeatureStyle();
	});

	Map.getMapInstance().data.addListener('click', function(event) {
		//var item = event.feature.getProperty('item');
		var position = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
		InfoWindow.putOn(self, position);

		// var position = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
		// if( item ){
		// 	InfoWindow.putOn(item, position);
		// }
	});
}

AreaSite.prototype.isValid = function(){
	var item = this.property;

	if( !item.SiteName ){ return false; }

	if( item.LatLng && item.LatLng.lat && item.LatLng.lng){ return false; }

	return true;
};

AreaSite.prototype.setProperties = function(item){
	if( !item.Data || !item.Data.Create_at ){
		return;
	}	

	this.property = item;
};

AreaSite.prototype.getProperty = function(key){
	if( this.property[key] ){
		return this.property[key]
	}
	return null;
};

AreaSite.prototype.getTitle = function(key){
	return '[' + this.getProperty('SiteGroup') + '] ' + this.getProperty('SiteName');
};

AreaSite.prototype.getJsonLink = function(){
	return "https://taqm.firebaseio.com/lastest.json";
}

AreaSite.prototype.getMeasure = function(measureType){
	if( measureType == 'PM2.5' ){ measureType = 'Dust2_5'; }
	if( measureType == 'PM2.5_NASA' ){ measureType = 'Dust2_5'; }

	var value = this.property['Data'][measureType]
				||  this.property['RawData'][measureType];

	return value ? parseFloat(value) : null;
};

AreaSite.prototype.getMeasureColor = function(){
	var measureType = Indicator.getPresentType();
	var value = this.getMeasure(measureType);
	return value ? Indicator.getLevelColor(value) : 'transparent';
}

AreaSite.prototype.drawFeatures = function(){	
	var self = this;
	var keyword = this.getProperty('SiteName');
	var re = new RegExp(keyword, 'g');

	Map.getFeatures().forEach(function(feature){
		var regionName = feature.getProperty('C_Name') + feature.getProperty('T_Name');
		if( regionName.match(re) !== null ){
			self.features.push(feature);
		}
	});

	Map.setFeatureStyle(self.features, {
		fillColor: self.getMeasureColor(), 
		fillOpacity: .2
	});
};

AreaSite.prototype.updateFeatureStyle = function(){
	Map.setFeatureStyle(this.features, {
		fillColor: this.getMeasureColor(), 
		fillOpacity: .2
	});
};

