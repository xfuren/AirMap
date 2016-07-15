var Indicator = {
	typeBtnContainerID: '#indicateTypeSelector',
	levelIndicatorContainerID: '#levelIndicatorLevel',
	presentType: 'PM2.5',
	types: ['PM2.5', 'PM2.5_NASA', 'Temperature', 'Humidity'],
	units: {
		'PM2.5': 'μg/m3',
		'PM2.5_NASA': 'μg/m3',
		'Temperature': '&#8451;',
		'Humidity': '%',
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
		'OLD_Temperature': {
			5: '#225968',
			10: '#B7DEE8',
			15: '#77933C',
			20: '#D7E4BD',
			25: '#FAC090',
			30: '#E46C0A',
			35: '#FF0000',
			40: '#800000',
		},
		'Temperature': {
			5: '#6DB2CC',
			11: '#B9E6F6',
			15: '#4BAC66',
			21: '#A8D784',
			25: '#F0E389',
			29: '#F1B040',
			33: '#F55042',
			35: '#B6023C',
			37: '#9F66B5',
			40: '#752B8E',
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

		$("body")
			.on('click', this.typeBtnContainerID + ' .btn', function(e){
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

			$(Map.getMapElement()).trigger("indicatorTypeChange", [type]);
		}
	},
	getLevelColor: function(level){
		var colors = this.colors[this.presentType];
		var lastColorMaxValue = Object.keys(colors).pop();
		for(var maxValue in colors){
			//console.log(level, maxValue);
			if( level <= maxValue ){
				return colors[maxValue];
			}

			//level greater lastone level
			if( level >= lastColorMaxValue){
				return colors[lastColorMaxValue];
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
		
		html.push('<div class="title">');
		html.push('<div class="type">' + type + '</div>');
		html.push('<div class="unit">' + unit + '</div>');
		html.push('</div>');
		html.push('<div class="levels">');
		html.push(levels);
		html.push('</div>');
		
		$(this.levelIndicatorContainerID).html(html.join(''));
	}
}
