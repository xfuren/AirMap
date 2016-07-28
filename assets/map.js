var Map = {
	instance: null,
	Geocoder: null,
	mapContainerID: "map",
	mapOptions: {
		streetViewControl: false,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT,
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN]
		},
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
		scaleControl: true,
		center: {lat: 23.839775, lng: 121.062213},
		zoom: 7,
		// https://snazzymaps.com/style/12999/%C4%B0nturlam-style
		styles: [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":20},{"lightness":50},{"gamma":0.4},{"hue":"#00ffee"}]},{"featureType":"all","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"simplified"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.stroke","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#405769"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#232f3a"}]}],		
	},
	dataLayerDefaultStyle: {
		strokeWeight: 1,
		strokeColor: 'blue',
		strokeOpacity: .1,
		fillOpacity: 0
	},
	getMapElement: function(){
		return '#' + this.mapContainerID;
	},
	getMapInstance: function(){
		return this.instance;
	},
	getGeocoderInstance: function(){
		if( !this.Geocoder ){
			this.Geocoder = new google.maps.Geocoder();
		}

		return this.Geocoder;
	},
	boot: function(overwrite){
		var options = this.mapOptions;
		if(overwrite){ $.extend(options, overwrite); }
		
		this.instance = new google.maps.Map(
			document.getElementById(this.mapContainerID), 
			options
		);

		this.instance.data.setStyle(this.dataLayerDefaultStyle);

		this.addUserLocationButton(this.instance);

		$(this.getMapElement()).trigger("mapBootCompelete");
	},
	loadGeoJson: function(json){
		var self = this;
		this.getMapInstance().data.loadGeoJson(json, null, function(features){
			$(self.getMapElement()).trigger("GeoJsonLoaded", [features]);
		});
		return this;
	},
	geocode: function(address, cb){
		if(!address.length){ return ; }

		this.Geocoder.geocode(
			{'address': address}, 
			function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					// map.setCenter(results[0].geometry.location);
					// var marker = new google.maps.Marker({
					// 	map: map,
					// 	position: results[0].geometry.location
					// });
					if(cb){
						cb(results[0].geometry.location);
					}
				} else {
					console.log("Geocode was not successful for the following reason: " + status);
				}
			}
		);
	},
	getFeatures: function(keyword){
		return this.getMapInstance().data;
	},
	setFeatureStyle: function(features, styles){
		var self = this;
		if( !features ){ return; }

		if(! features instanceof Array){
			features = [features];
		}
		
		features.forEach(function(feature){
			self.getMapInstance().data.overrideStyle(feature, styles);
		});
		return this;
	},
	clearFeatureStyle: function(feature){
		this.getMapInstance().data.revertStyle();
		return this;
	},
	addUserLocationButton: function(map){				
		var findZoomLevelByAccuracy = function(accuracy){
			if( parseFloat(accuracy) <= 0 ){ return 12; }
			//591657550.500000 / 2^(level-1)
			var level = ( Math.log(591657550.500000/accuracy) / Math.log(2) ) + 1;
			return Math.floor(level);
		};

		var $element = $([
			"<div id='geoLocate'>",
			"<button>", 
			"<div class='icon-gps'></div>",
			"</button>",
			"</div>"
		].join(''));
		var $icon = $element.find(".icon-gps");
		
		google.maps.event.addListener(map, 'dragend', function() {
			$icon.removeClass('gps-located gps-unlocate');
		});

		var animateInterval;
		$element.find("button").click(function(){
			if(animateInterval){				
				$icon.removeClass('gps-located gps-unlocate');
				clearInterval(animateInterval);
				animateInterval = null;
				return;
			}

			animateInterval = setInterval(function(){
				if( $icon.hasClass('gps-unlocate') ){
					$icon.removeClass('gps-unlocate');
				}else{
					$icon.addClass('gps-unlocate');
				}
			}, 500);

			var latlng = $icon.data('latlng');
			var zoom = $icon.data('zoom');
			if(latlng){
				map.setCenter(latlng);
				map.setZoom(zoom || 12);

				$icon.removeClass('gps-unlocate').addClass('gps-located');
				clearInterval(animateInterval);
				animateInterval = null;
				return; 
			}

			// var url = "http://ip-api.com/json";
			var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCDRRT8it4AZpwbORhHeqoi2qrWDmQqD48";
			$.ajax({
				dataType: 'json',
				method: 'POST',
				url: url
			}).success(function(data){
				$icon.removeClass('gps-located gps-unlocate');
				
				if( data.location.lat && data.location.lng ){
					latlng = new google.maps.LatLng(data.location.lat, data.location.lng);
					zoom = findZoomLevelByAccuracy(data.accuracy);
					
					map.setCenter(latlng);
					map.setZoom(zoom);

					$icon.data('latlng', latlng).data('zoom', zoom).addClass('gps-located');
				}
			}).complete(function(){
				clearInterval(animateInterval);
				animateInterval = null;
			});	
		});
		
		var controlDiv = $element[0];
		controlDiv.index = 1;
		map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controlDiv);
	}
}