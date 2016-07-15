//map.zoom at 3 will become striped
var WindLayer = {
	state: {
		isInitiated: false,
		isLayerEnable: false,
		isUserEnable: false,
		timer: null,
	},
	instance: {
		windy: null,
		context: null,
	},
	property: {
		ctrlContainer: "#windLayerCtrl",
		fillOpacity: 0.6,
		moveSpeed: 1,
		windyData: {},
		gfsJson: "https://asper.tw/airmap/gfs.json",
	},	
	boot: function(){
		var $switchContainer = $(this.property.ctrlContainer).find(".switch");
		if( $switchContainer.size() ){ 
			$switchContainer.find(".btn").click(function(){
				var isUserEnable = this.state.isUserEnable = !this.state.isUserEnable;

				$switchContainer.find(".btn").show();				
				if(isUserEnable){
					$switchContainer.find(".btn-on").hide();
					this.start();
				}else{
					$switchContainer.find(".btn-off").hide();
					this.stop();
				}
			}.bind(this));
		}		
	},
	init: function(){
		if( this.state.isInitiated ){ return; }
		var map = Map.getMapInstance();

		this.showMsg('Loading...');
		$.getJSON(this.property.gfsJson)
			.success(function(result){
				var canvasLayerOptions = {
					map: Map.getMapInstance(),
					animate: false,
					updateHandler: function(){
						this.redraw();
					}.bind(this)
				};
				var canvasLayer = new CanvasLayer(canvasLayerOptions);
				
				this.property.windyData = result;
				this.state.isLayerEnable = true;
				this.instance.context = canvasLayer.canvas.getContext('2d');
				this.instance.windy = new Windy({canvas: canvasLayer.canvas, data: result});					
			}.bind(this))
			.success(function(){
				google.maps.event.addListener(map, 'bounds_changed', function(){
					this.clear();
				}.bind(this));

				this.changeFillOpacity(0.4);
				this.state.isInitiated = true;				
			}.bind(this))
			.success(function(result){
				var dateTime = moment(result[0]['header']['refTime']).format("YYYY-MM-DD HH:mm");
				$("#refTime").find(".localTime").text(dateTime).end().show();
			});

	},
	showMsg: function(msg){
		var $msgContainer = $(this.property.ctrlContainer).find(".msg");
		if( $msgContainer.size() ){
			if(msg && msg.length){
				$msgContainer.text(msg).show();
			}else{
				$msgContainer.text('').hide();
			}
		}
	},
	getFillOpacity: function(){
		return this.property.fillOpacity;
	},
	changeFillOpacity: function(opacity){
		if(!opacity){ return false; }
		this.property.fillOpacity = opacity;
		
		if(this.state.isLayerEnable){
			this.instance.windy.params.canvas.getContext('2d').fillStyle = "rgba(0, 0, 0, " + opacity + ")";
		}
	},
	getMoveSpeed: function(){
		return this.property.moveSpeed;
	},
	changeMoveSpeed(speed){
		if(!speed){ return false; }

		this.property.moveSpeed = speed;
		if(this.state.isLayerEnable){
			this.instance.windy.params.moveSpeed = parseInt(speed, 10) || 1;
		}
	},
	redraw: function(overlay, params) {
		if(!this.state.isLayerEnable || !this.state.isUserEnable ){ return; }

		if( this.state.timer ){ clearTimeout(this.state.timer); }
		
		var $map = $(Map.getMapElement());
		this.state.timer = setTimeout(function() {
			var bounds = Map.getMapInstance().getBounds();
			var map_size_x = $map.width();
			var map_size_y = $map.height();

			this.instance.windy.params.fillOpacity = this.property.fillOpacity;
			this.instance.windy.start(
				[
					[0,0], 
					[map_size_x, map_size_y]
				], 
				map_size_x, map_size_y, 
				[
					[bounds.getSouthWest().lng(), bounds.getSouthWest().lat() ],
					[bounds.getNorthEast().lng(), bounds.getNorthEast().lat() ]
				]
			);
			this.showMsg();				
		}.bind(this), 700)
	},
	start: function(){
		if( Map.getMapInstance().getZoom() <= 4 ){ return; }

		this.showMsg('Loading...');
		this.state.isLayerEnable = true;
		if(this.state.isInitiated){
			this.redraw();
		}else{
			this.init();
		}
	},
	stop: function(){
		this.state.isLayerEnable = false;
		this.clear();
	},
	clear: function(){
		this.instance.windy.stop();
		this.instance.context.clearRect(0,0,3000, 3000);
	},
};

var zoomSpeedFormat = function(value){
	if(value==1){ return '1x'; }
	return '1/' + value + 'x';
}

//slider init and event
$("#windLayerCtrl").find(".slider-container input").each(function(){
	var type = $(this).data("type");
	var text = value = 'null';
	var slider = $(this).slider();

	if(type == 'fillOpacity'){
		text = value = WindLayer.getFillOpacity()*10;
	}
	if(type == 'moveSpeed'){
		value = WindLayer.getMoveSpeed();
		text = zoomSpeedFormat(value);
		slider.slider('setAttribute', 'formatter', function(value){
			return zoomSpeedFormat(value);
		});
	}

	slider.slider('setValue', value);
	$(this).prevAll('label').find(".value").text(text);
});
$("body").on("slideStop", ".slider-container input", function(e){
	var type = $(e.target).data("type");
	var text = value = e.value;

	switch(type){
		case 'fillOpacity': WindLayer.changeFillOpacity(value/10); break;
		case 'moveSpeed': 
			WindLayer.changeMoveSpeed(value); 
			text = zoomSpeedFormat(value);
		break;
	}

	$(this).prevAll('label').find(".value").text(text);
});