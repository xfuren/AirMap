var sites = [];

var sitesTools = {
	add: function(site){
		sites.push(site);
	},
	removeAll: function(){
		for(var i in sites){
			var site = sites[i];
			site.removeMarker();
		}
		sites = [];
	},
	activeSiteGroup: undefined,
	generateSiteGroupSelector: function(){		
		var siteGroups = {};
		for(var i in sites){
			var site = sites[i];

			var siteGroup = site.getProperty('SiteGroup');
			if( siteGroup.length ){
				if(!siteGroups[siteGroup]){
					siteGroups[siteGroup] = 0;
				}
				siteGroups[siteGroup]++;
			}
		}

		var $container = $("#siteGroupSelector");

		//initial
		if( this.activeSiteGroup == undefined ){
			this.activeSiteGroup = 'all'

			$("body").on('click', '#siteGroupSelector .btn', function(e){
				var group = $(e.target).data('group');

				$("#siteGroupSelector .btn").removeClass('btn-success').addClass('btn-default')
					.filter("[data-group='" + group + "']").addClass('btn-success');	

				this.changeSiteGroup(group);
			}.bind(this));
		}
		var html = '';
		var totalCount = 0;
		for(var name in siteGroups){
			var count = siteGroups[name];
			totalCount += count;
			html += $("<div/>").append(
				$('<button type="button" class="btn btn-sm btn-default"></button')
					.html(name + ' <code>' + count + '</code>')
					.attr('data-group', name)
			).html();
		}
		html = '<button type="button" class="btn btn-sm btn-success" data-group="all">ALL <code>' + totalCount + '</code></button>' + html;

		$container.html(html);
	},
	changeSiteGroup: function(siteGroup){
		for(var i in sites){
			var site = sites[i];
			
			if( siteGroup == 'all' || site.getProperty('SiteGroup') == siteGroup){
				site.addMarker();
			}else{
				site.removeMarker();
			}			
		}
	},
	generateVoronoiLocationsAndColors: function(){
		var locations = [];
		var colors = [];
		for(var i in sites){
			var site = sites[i];

			var LatLng = site.getPosition();
			locations[i] = [LatLng.lat(), LatLng.lng()];
			colors[i] = site.getMeasureColor();
		}
		return {
			locations: locations,
			colors: colors,
		}		
	}
}

function Site(data){
	this.property = {};
	this.marker = null;
	this.features = [];	

	this.setProperties(data);
	this.resource = getSiteResource(this);

	//events
	var self = this;
	$(Map.getMapElement()).on("indicatorTypeChange", function(e, type){
		self.updateMarkerColor();
	});
}

Site.prototype.setProperties = function(item){
	if( !item || !item.Data || !item.Data.Create_at ){
		return false;
	}

	this.property = item;
};

Site.prototype.isValid = function(){
	var item = this.property;

	//time filter
	if( moment().diff(moment(item.Data.Create_at), 'minutes') > 60 ){
		return false;
	}

	//location filter
	if( !item.LatLng || !item.LatLng.lng || !item.LatLng.lat ){
		return false;
	}

	return true;
};

Site.prototype.getProperty = function(key){
	if( this.property[key] ){
		return this.property[key]
	}
	return null;
};

Site.prototype.getResource = function(){
	return this.resource;
}

Site.prototype.getMeasure = function(measureType){
	if( measureType == 'PM2.5' ){ measureType = 'Dust2_5'; }
	if( measureType == 'PM2.5_NASA' ){ measureType = 'Dust2_5'; }

	if( this.property['Data'][measureType] != undefined ){
		return parseFloat(this.property['Data'][measureType]);
	}

	if( this.property['RawData'][measureType] != undefined ){
		return parseFloat(this.property['RawData'][measureType]);
	}

	return null;
};

Site.prototype.getIdentity = function(){
	var identify = this.getProperty('SiteGroup') + '-' + this.getResource().getIdentity();
	return identify.replace(/[_\.]/, '-');
}

Site.prototype.getTitle = function(){
	return '[' + this.getProperty('SiteGroup') + '] ' + this.getProperty('SiteName');
}

Site.prototype.getJsonLink = function(){
	return this.resource.jsonLink;
}

Site.prototype.getMeasureColor = function(){
	var measureType = Indicator.getPresentType();
	var value = this.getMeasure(measureType);
	return value != null ? Indicator.getLevelColor(value) : 'transparent';
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


	var measureType = Indicator.getPresentType();
	var text = this.getMeasure(measureType) ? Math.round(this.getMeasure(measureType)) : '';
	var color = this.getMeasureColor();

	if( !color ){ return; }

	var url = 'data:image/svg+xml;charset=utf-8,' + 
			   encodeURIComponent( 
			     iconSvg.replace('{{background}}', color).replace('{{text}}', text)
			   );
	return {
		anchor: new google.maps.Point(16, 16),
		url: url,
	};
}

Site.prototype.createMarker = function(options){
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
		// animation: google.maps.Animation.DROP,
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

Site.prototype.addMarker = function(){
	if( this.marker ){ this.marker.setMap(Map.getMapInstance()); }
}

Site.prototype.updateMarkerColor = function(){
	var marker = this.getMarker();
	if( marker ){
		marker.setIcon(this.getIconSVG());
	}
}

Site.prototype.openInfoWindow = function(){
	InfoWindow.putOn(this);
}