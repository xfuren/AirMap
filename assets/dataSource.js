var DataSource = {
	autoUpdate: true,
	autoUpdateTS: null,
	autoUpdateIntervalms: 5 * 60 * 1000,
	sources: [
		"/json/airmap.json",
		// "http://asper.tw/airmap/airbox.json",
		// "http://asper.tw/airmap/epa.json",
		// "http://asper.tw/airmap/lass.json",
		// "http://asper.tw/airmap/probecube.json",
		// "http://asper.tw/airmap/webduino.json",
		// "https://taqm.firebaseio.com/lastest.json?callback=?",
	],
	boot: function(){
		this.loadSources();
		this.autoUpdate(true);
	},
	loadSources: function(){
		this.sources.map(function(source){
			this.load(source);
		}.bind(this));
	},
	load: function(source){
		$.getJSON(source).done(function(data){
			$(Map.getMapElement()).trigger("dataSourceLoadCompelete", [source, data]);
		});	
	},
	update: function(source){
		this.load(source);
	},
	autoUpdate: function(flag){
		this.autoUpdate = !!flag;

		if( this.autoUpdate ){
			this.autoUpdateTS = setInterval(function(){
				this.loadSources();
			}.bind(this), this.autoUpdateIntervalms)
		}else{
			clearInterval(this.autoUpdateTS);
		}
	}

}