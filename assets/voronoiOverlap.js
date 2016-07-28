VoronoiOverlap.prototype = new google.maps.OverlayView();
function VoronoiOverlap(id, map, locations, fillColors){
	this.divID = id;
	this.map = map;
	this.siteLocations = locations;
	this.fillColors = fillColors;
	this.setMap(map);
};
VoronoiOverlap.prototype.onAdd = function() {
 	var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "SvgOverlay").attr("id", this.divID);
 	this.div = layer.node();
	var svg = layer.append("svg");
	this.svgoverlay = svg.append("g").attr("class", "voronoiLayer");
};
VoronoiOverlap.prototype.googleMapProjection = function(coordinates) {
	var overlayProjection = this.getProjection();
	var googleCoordinates = new google.maps.LatLng(coordinates[0], coordinates[1]);
	var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
	var svgHalfDimention = 4000;
	return [pixelCoordinates.x + svgHalfDimention, pixelCoordinates.y + svgHalfDimention];
};
VoronoiOverlap.prototype.draw = function() {
	var sitePositions = [];
	this.siteLocations.forEach(function(d) {		
		sitePositions.push(this.googleMapProjection(d) );
	}.bind(this));
	
	var sitePolygons = d3.geom.voronoi(sitePositions);
	var voronoiPathAttr = {
		fill: function(d, i){ return this.fillColors[i] || "none"; }.bind(this),
		d: function(d, i){ 
			//boundary.clip( d3.geom.polygon(sitePolygons[i]) );
			if( !sitePolygons[i] ){ return; }
			return "M" + sitePolygons[i].join("L") + "Z"
		},
	};

	this.svgoverlay.selectAll("path")
		.data(this.siteLocations)
		.attr(voronoiPathAttr)
		.enter()
		.append("svg:path")
		.attr("class", "cell")
		.attr(voronoiPathAttr);
};
VoronoiOverlap.prototype.onRemove = function() {
	this.div.parentNode.removeChild(this.div);
};
VoronoiOverlap.prototype.toggle = function() {
	if( !this.div ){ return false; }
	
	if(this.div.style.visibility === 'hidden') {
		this.div.style.visibility = 'visible';
	}else{
		this.div.style.visibility = 'hidden';
	}
};
VoronoiOverlap.prototype.getContainer = function() {
	return this.div;
};