var areaDisplay = {
	countryGeoJSONFile: 'json/Town_MOI_1041215.json',
	init: false,
	areas: [],
	boot: function(){
		this.loadGeoJSON();
		this.bindEvent();
	},
	bindEvent: function(){
		var self = this; 
		$("#map").on("indicatorTypeChange", function(e, item){
			self.updateAreaColor();
		});


		map.Map.data.addListener('click', function(event) {
			var item = event.feature.getProperty('item');

			var position = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
			if( item ){
				InfoWindow.putOn(item, position);
			}
		});
	},
	loadGeoJSON: function(){
		if( this.init ){ return false; }

		var itemLoaded = $.Deferred(function(dfd){
			$("#map").on("sourceLoadCompelete", function(e, source){
				dfd.resolve();
			});
		});
		
		var self = this;
		var loadJson = $.Deferred(function(dfd){
			map.loadGeoJson(self.countryGeoJSONFile, function(features){
				self.init = true;
				dfd.resolve();
			});	//for area fill
		});

		$.when(itemLoaded, loadJson).then(function(){
			self.findMatchFeatures();
		});

	},
	isValid: function(item){
		if( !item.SiteName ){ return false; }

		if( item.LatLng && item.LatLng.lat && item.LatLng.lng){ return false; }

		return true;
	},
	add: function(item){
		if( !this.isValid(item) ){ return; }

		this.areas.push(item);

		this.updateAreaColor();
	},
	findMatchFeatures: function(){
		for(var i in this.areas){
			var item = this.areas[i];

			var features = this.search(item.SiteName);

			features.map(function(feature){
				feature.setProperty('item', item);
			});
			

			this.areas[i].features = features;
			this.updateAreaColor();
		}
	},
	search: function(keyword){
		return map.getFeatureByString(keyword);
	},	
	setStyle: function(features, fillColor){
		map.setFeatureStyle(features,{
				fillColor: fillColor, 
				fillOpacity: .8
			});
	},
	updateAreaColor: function(){
		this.areas.map(function(item){
			var value = siteMarker.getValue(item, Indicator.presentType);
			var color = Indicator.getColorByLevel(value);
			if( !color ){ color = 'transparent'; }

			this.setStyle(item.features, color);
		}.bind(this));
	},
}