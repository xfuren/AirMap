var DataSource = {
	autoUpdate: true,
	autoUpdateTS: null,
	autoUpdateIntervalms: 5 * 60 * 1000,
	sources: [
		// 'Data/EPA_last.json',
		// 'Data/Indie_last.json',
		// 'Data/LASS_last.json',
		// 'Data/ProbeCube_last.json',
		"/json/airmap.json",
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
			//siteMarker.addToMapManager(data);

			// data.map(function(item){
			// 	 siteMarker.add(item);
			// 	// areaDisplay.add(item);
			// });

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