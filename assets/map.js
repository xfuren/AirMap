var Map = {
	instance: null,
	Geocoder: null,
	mapContainerID: "map",
	mapOptions: {
		streetViewControl: false,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		center: {lat: 23.839775, lng: 121.062213},
		zoom: 8
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
	boot: function(){
		this.instance = new google.maps.Map(
			document.getElementById(this.mapContainerID), 
			this.mapOptions);

		this.instance.data.setStyle(this.dataLayerDefaultStyle);

		this.addUserLocationButton(this.instance);

		$(this.getMapElement()).trigger("mapBootCompelete");
	},
	loadGeoJson: function(json){
		this.getMapInstance().data.loadGeoJson(json, null, function(features){
			$(this.getMapElement).trigger("GeoJsonLoaded", [features]);
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
	getFeatureByKeyword: function(keyword){
		var features = [];
		this.getMapInstance().data.forEach(function(feature){
			var regionName = feature.getProperty('C_Name') + feature.getProperty('T_Name');
			var re = new RegExp(keyword, 'g');

			if( regionName.match(re) !== null ){
				features.push(feature);					
			}
		});
		return features;
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
	addUserLocationButton: function(){

		var map = this.getMapInstance();
		var controlDiv = document.createElement('div');
		
		var firstChild = document.createElement('button');
		firstChild.style.backgroundColor = '#fff';
		firstChild.style.border = 'none';
		firstChild.style.outline = 'none';
		firstChild.style.width = '28px';
		firstChild.style.height = '28px';
		firstChild.style.borderRadius = '2px';
		firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
		firstChild.style.cursor = 'pointer';
		firstChild.style.marginRight = '10px';
		firstChild.style.padding = '0px';
		firstChild.title = 'Your Location';
		controlDiv.appendChild(firstChild);
		
		var secondChild = document.createElement('div');
		secondChild.style.margin = '5px';
		secondChild.style.width = '18px';
		secondChild.style.height = '18px';
		secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
		secondChild.style.backgroundSize = '180px 18px';
		secondChild.style.backgroundPosition = '0px 0px';
		secondChild.style.backgroundRepeat = 'no-repeat';
		secondChild.id = 'you_location_img';
		firstChild.appendChild(secondChild);
		
		google.maps.event.addListener(map, 'dragend', function() {
			$('#you_location_img').css('background-position', '0px 0px');
		});

		firstChild.addEventListener('click', function() {
			var imgX = '0';
			var animationInterval = setInterval(function(){
				if(imgX == '-18') imgX = '0';
				else imgX = '-18';
				$('#you_location_img').css('background-position', imgX+'px 0px');
			}, 500);
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

					new google.maps.Marker({
						'position': latlng,
						'map': map,
					});
					map.setCenter(latlng);
					map.setZoom(12);

					clearInterval(animationInterval);
					$('#you_location_img').css('background-position', '-144px 0px');
				});
			}
			else{
				clearInterval(animationInterval);
				$('#you_location_img').css('background-position', '0px 0px');
			}
		});
		
		controlDiv.index = 1;
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	}
}

// google.maps.event.addDomListener(window, 'load', function(){  });
// 
