(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-55384149-4', 'auto');
ga('send', 'pageview');

(function() {
	var d = document, s = d.createElement('script');
	s.src = '//airmap.disqus.com/embed.js';
	s.setAttribute('data-timestamp', +new Date());
	(d.head || d.body).appendChild(s);
})();

var VoronoiLayer;

//navigator button show content
$("#navigator")
	.find(">.btn[data-content-container]").click(function(){
		var container = $(this).data("content-container");
		if(!container){ return false; }
		
		var contentID = container + '-content';
		//exist, toogle show/hide
		if( $(contentID).size() ){ 
			$(".navigator").not(contentID).hide();
			$(contentID).toggle();
			return;
		}
		
		//fine content, 
		if( !$(container).size() ){ return false; }
		$(".navigator").hide();
		var $content = $(container).detach().css('display', 'block');
		if($content.has('typeSelector')){
			$content.css({
				position: 'static',
				opacity: 1,
			});
		}

		//put to body
		var position = $(this).offset();
		var contentStyles = {				
			top: position.top,
			left: position.left + 45,
		};
		var html = [
			"<div class='navigator'>",
				"<span class='glyphicon glyphicon-triangle-left'></span>",
				"<div class='header'>" + $(this).attr("title") + "</div>",
			"</div>",
		].join('');
		$(html)
			.attr('id', contentID.replace('#',''))
			.css(contentStyles)
			.append($content)
			.appendTo("body");
	}).end()
	.find(".comment").click(function(){
		var identifier = 'airmap-main';
		var title = 'Airmap'
		var url = "http://airmap.g0v.asper.tw/#!comment-airmap";
		loadSiteDisqus(identifier, title, url);
	}).end()
	.find(".voronoi").click(function(){
		if( !VoronoiLayer){
			var voronoi = sitesTools.generateVoronoiLocationsAndColors();
			VoronoiLayer = new VoronoiOverlap('siteVoronoi', Map.getMapInstance(), voronoi['locations'], voronoi['colors']);

			setTimeout(function(){
				$("#siteVoronoi").fadeToggle('fast');
			}, 500);
		}else{
			$("#siteVoronoi").fadeToggle('fast');
		}
	}).end()

$("#map")
	.on('mapBootCompelete', function(){
		DataSource.boot();
	})
	.on("dataSourceLoadCompelete", function(e, source, data){
		sitesTools.removeAll();

		var delayms = 30;
		for(var i in data){
			var site = new Site(data[i]);
			if( !site.isValid() ){ continue; }

			(function(x, Site){
				setTimeout(function(){ Site.createMarker(); }, x * delayms);
			})(i, site);

			sitesTools.add(site);
		}

		setTimeout(function(){
			$("#map").trigger("makerLoadCompelete");
		},  data.length * delayms);

		sitesTools.generateSiteGroupSelector();			
	})
	.on("click", function(e){
		$(".navigator:visible").hide();
	});

//Disqus event
$("#disqus_panel .close").click(function(){
	$("#disqus_panel").hide();
});
$("#map").on("click", ".disqus-comment-section", function(){
	var Site = InfoWindow.item;
	var title = Site.getTitle();
	var identifier =  Site.getIdentity(); 
	var url = 'http://airmap.g0v.asper.tw/#!comment-' + identifier;
	loadSiteDisqus(identifier, title, url);
}).on("infoWindowReady infoWindowClose", function(e, Site){
	$("#disqus_panel").hide();
	DISQUSWIDGETS.getCount({reset: true});
});
	
$(function(){
	var optionsLatLng = getUrlLatLng();
	var options = optionsLatLng ? {center: optionsLatLng, zoom:18} : {};
	Map.boot(options);
	Indicator.boot();
	InfoPanel.boot();
	WindLayer.boot();
})

function getUrlLatLng(){
	var param = location.href.replace(location.protocol + '//' + location.host + '/', '');

	if(param.indexOf('@') > -1){
		var latLng = param.replace('@', '').split(',', 2);
		return {
			lat: parseFloat(latLng.shift()),
			lng: parseFloat(latLng.shift()),
		}
	}

	return null;
}

function loadSiteDisqus(identifier, title, url, lang){
	if( !DISQUS ){ return false; }
	lang = lang || 'tw';

	//chanege title
	$("#disqus_panel").find(".title").text(title).end().show();

	DISQUS.reset({
		reload: true,
		config: function () {
			this.page.identifier = identifier;
			this.page.url = url;
			this.page.title = title;
			this.language = lang;
		}
	});
}