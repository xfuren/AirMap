var Indicator = {
	typeBtnContainerID: '#indicateTypeSelector',
	levelIndicatorContainerID: '#levelIndicatorLevel',
	presentType: 'PM2.5',
	types: ['PM2.5', 'PM2.5_NASA', 'Temperature', 'Humidity'],
	units: {
		'PM2.5': 'μg/m3',
		'PM2.5_NASA': 'μg/m3',
		'Temperature': '&#8451;',
		'Humidity': '%;',
	},
	colors: {
		'PM2.5': {
			11: '#C8E6A6',
			23: '#00FF00',
			35: '#FFFF00',
			41: '#F3C647',
			47: '#F3C647',
			53: '#E46C0A',
			58: '#D5A2A0',
			64: '#FF0000',
			70: '#800000',
			71: '#7030A0',
		},
		'PM2.5_NASA': {
			0: '#0000CC',
			3: '#0133CC',
			5: '#0166FF',
			8: '#0099FF',
			10: '#32CBFE',
			13: '#65FE9A',
			15: '#99FF66',
			18: '#CCFF33',
			20: '#FFFF01',
			35: '#FF9933',
			50: '#FF3301',
			65: '#C90000',
			80: '#800000',
		},
		'Temperature': {
			0: '#225968',
			5: '#B7DEE8',
			10: '#77933C',
			15: '#D7E4BD',
			20: '#FAC090',
			25: '#E46C0A',
			30: '#FF0000',
			35: '#800000',
		},
		'Humidity': {
			20: '#FAC090',
			40: '#76B531',
			60: '#B7DEE8',
			80: '#215968',
		}
	},
	displayName: {
		'PM2.5': 'PM2.5',
		'PM2.5_NASA': 'PM2.5 NASA',
		'Temperature': '溫度',
		'Humidity': '濕度',
	},
	boot: function(){
		this.generateTypeBtn();
		this.generateLevelBar();

		$(this.typeBtnContainerID)
			.on('click', '.btn', function(e){
				var type = $(e.target).data('type');

				this.changeType(type);
				this.generateTypeBtn();
			}.bind(this));
	},
	getPresentType: function(){
		return this.presentType;
	},
	generateTypeBtn: function(){
		var html = '';
		this.types.map(function(type){
			var active = type == this.presentType ? 'btn-primary' : 'btn-default';
			
			html += $("<div/>").append(
				$('<button type="button" class="btn btn-sm"></button')
					.text(this.displayName[type])
					.addClass(active)
					.attr('data-type', type)
			).html();

		}.bind(this));
		$(this.typeBtnContainerID).html(html);
	},
	changeType: function(type){
		if( this.types.indexOf(type) > -1 ){ 			
			this.presentType = type;
			this.generateLevelBar();

			$(Map.getMapInstance()).trigger("indicatorTypeChange", [type]);
		}
	},
	getLevelColor: function(level){
		var colors = this.colors[this.presentType];
		var lastColorMaxValue = Object.keys(colors).pop();
		
		for(var maxValue in colors){
			//last one is greater
			if( maxValue == lastColorMaxValue && level > maxValue){
				return colors[maxValue];
			}

			if( level < maxValue ){
				return colors[maxValue];
			}
		}
	},
	generateLevelBar: function(){
		var type = this.presentType;
		var unit = this.units[type];

		var levels = '';
		for(var value in this.colors[type]){
			var color = this.colors[type][value];
			levels += '<div class="level" style="background-color: ' + color + ';">' + value + '</div>';
		}

		var html = [];
		html.push('<div class="type"><b>' + type + '</b></div>');
		html.push('<div class="levels">');
		html.push(levels);
		html.push('</div>');
		html.push('<div class="unit">' + unit + '</div>');
		
		$(this.levelIndicatorContainerID).html(html.join(''));
	}
}
