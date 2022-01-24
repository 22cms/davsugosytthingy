//Translations
const translations = {
	"en" : {
		"videoScraping": "Video Scraping",
		"editPreview": "Edit video preview",
		"ytUrl": "YouTube URL or Video ID",
		"videoTitle": "Video title",
		"channelName": "Channel name",
		"totalViews": "Total views",
		"releaseDate": "Release date",
		"videoDuration": "Video duration",
		"previewTheme": "Preview theme",
		"previewZoom": "Preview zoom",
		
		"views": "views",
		"milionOf": "M",
		"ago": "ago",
		
		"dateTable": {
			"minute" : ["minute", "minutes"],
			"hour" : ["hour", "hours"],
			"day" : ["day", "days"],
			"week" : ["week", "weeks"],
			"month" : ["month", "months"],
			"year" : ["year", "years"]
		},
	},
	"it" : {
		"videoScraping": "Analizza video",
		"editPreview": "Modifica anteprima video",
		"ytUrl": "URL di YouTube o ID video",
		"videoTitle": "Titolo del video",
		"channelName": "Nome del canale",
		"totalViews": "Visualizzazioni totali",
		"releaseDate": "Data di pubblicazione",
		"videoDuration": "Durata del video",
		"previewTheme": "Tema dell'anteprima",
		"previewZoom": "Zoom anteprima",
		
		"views": "visualizzazioni",
		"milionOf": " Mln di",
		"ago": "fa",
		
		"dateTable": {
			"minute" : ["minuto", "minuti"],
			"hour" : ["ora", "ore"],
			"day" : ["giorno", "giorni"],
			"week" : ["settimana", "settimane"],
			"month" : ["mese", "mesi"],
			"year" : ["anno", "anni"]
		},
	}
}

//Applies all settings about languages
var curLang = translations["en"];
var curLangCode = "en";
var unbiasedLanguageCode = navigator.language.split("-")[0];
if (unbiasedLanguageCode in translations) {
	curLang = translations[unbiasedLanguageCode];
	curLangCode = unbiasedLanguageCode;
}

if (localStorage.getItem('curLang')) {
	curLang = translations[localStorage.getItem('curLang')];
	curLangCode = localStorage.getItem('curLang');
}

localStorage.setItem("curLang", curLangCode)

//And translates Fixed Elements

function applyFixedTranslations() {
	fixedElements = document.getElementsByClassName("translatable");
	var curLangString;
	for (var i = 0; i < fixedElements.length; i++) {
		curLangString = curLang[fixedElements[i].attributes.stringid.value];
		
		if (curLangString) fixedElements[i].innerText = curLangString;
	} 
}
applyFixedTranslations()
