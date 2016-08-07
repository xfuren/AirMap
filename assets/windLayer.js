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
		gfsJson: "https://raw.githubusercontent.com/Aspertw/AirMap/master/static/gfs.json",
	},	
	boot: function(){
		//enable button event
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

		var map = Map.getMapInstance();
		google.maps.event.addListener(map, 'bounds_changed', function(){
			this.clear();
		}.bind(this));
		google.maps.event.addListener(map, 'zoom_changed', function(){
			var zoom = map.getZoom();
			if( zoom <= 7 ){ this.changeMoveSpeed(1); return; }
			if( zoom <= 8 ){ this.changeMoveSpeed(3); return; }
			if( zoom <= 10 ){ this.changeMoveSpeed(5); return; }
			if( zoom <= 11 ){ this.changeMoveSpeed(15); return; }
			if( zoom <= 12 ){ this.changeMoveSpeed(30); return; }
			if( zoom <= 13 ){ this.changeMoveSpeed(50); return; }
			if( zoom <= 16 ){ this.changeMoveSpeed(120); return; }
			if( zoom <= 17 ){ this.changeMoveSpeed(150); return; }
			if( zoom >= 17 ){ this.changeMoveSpeed(200); return; }
		}.bind(this));	
	},
	init: function(){
		if( this.state.isInitiated ){ return; }

		this.showMsg('Loading...');
		$.getJSON(this.property.gfsJson)
			//initial wind js
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
				this.state.isInitiated = true;	
				this.instance.context = canvasLayer.canvas.getContext('2d');
				this.instance.windy = new Windy({canvas: canvasLayer.canvas, data: result});					
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
			this.instance.windy.setFillOpacity(opacity);
		}
	},
	getMoveSpeed: function(){
		return this.property.moveSpeed;
	},
	changeMoveSpeed(speed){
		if(!speed){ return false; }

		$(this.property.ctrlContainer)
			.find("[data-type='moveSpeed']")
				.prevAll('label').find(".value").text(zoomSpeedFormat(speed)).end().end()
				.slider().slider('setValue', speed);

		this.property.moveSpeed = speed;
		if(this.state.isLayerEnable){
			this.instance.windy.setMovingSpeed(speed);
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

			this.instance.windy.setFillOpacity(this.property.fillOpacity);
			this.instance.windy.setMovingSpeed(this.property.moveSpeed);
			this.instance.windy.params.moveSpeed = this.property.moveSpeed;
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
		if( this.instance.windy ){
			this.instance.windy.stop();
			this.instance.context.clearRect(0,0,3000, 3000);
		}
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