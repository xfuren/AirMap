var lang = new Lang();

Lang.prototype.attrList.pop();	//remove href

lang.dynamic('en', 'json/lang_en.json');

lang.init({
	defaultLang: 'zh-tw',
});

var langChange = function(lang){
	$("#lang").find("button").hide().not("[data-lang='" + lang + "']").show();
	moment.locale(lang);
}; 
langChange(lang.currentLang);

$(lang).on("afterUpdate", function(e, curLang, newLang){
	langChange(newLang);
});

$("#lang button").click(function(){
	window.lang.change($(this).data('lang'));
});