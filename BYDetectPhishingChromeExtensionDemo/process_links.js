
var GOOGLE_API_KEY = 'DUMMY';
var googleThreat = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" 
					  + GOOGLE_API_KEY;

var threatSearchURL = googleThreat;

var threatEntries = []
var threats = []
var encounteredError = 0

var phishing_stats = {
	"totalLinks": 0,
	"totalFullLinks": 0,
	"totalMaliciousLinks": 0,
}

// Phishing stats updates
function updateStatsForTotalLinks(count) {
	phishing_stats.totalLinks = count
}

// Phishing stats updates
function updateStatsForTotalMaliciousLinks(count) {
	phishing_stats.totalMaliciousLinks = count
}

function processGoogleSuccessResponse(data) {

// Response reference
// {
//   "matches": [
//     {
//       "threatType": "MALWARE",
//       "platformType": "WINDOWS",
//       "threat": {
//         "url": "http://goooogleadsence.biz/"
//       },
//       "cacheDuration": "300s",
//       "threatEntryType": "URL"
//     },
//     {
//       "threatType": "MALWARE",
//       "platformType": "WINDOWS",
//       "threat": {
//         "url": "http://activefile.ucoz.com/"
//       },
//       "cacheDuration": "300s",
//       "threatEntryType": "URL"
//     }
//   ]
// }

	var kMatches = "matches";

	if (Object.keys(data).length <= 0) {
		console.log("no threat")
	}else {
		var matches = data[kMatches]
		// parsing google json response to custom threat objects
		for(var i in matches) {
			var threatObj = {
				"threatType": matches[i].threatType,
		      	"platformType": matches[i].platformType,
		      	"threat": matches[i].threat["url"]
			}
			threats.push(threatObj)
		}		
	}

	// update stats
	updateStatsForTotalMaliciousLinks(threats.length)
	console.log(threats)
	console.log(phishing_stats)
}

function extractAHrefLinksFromBody() {
	// loop all a elements and extract href and innterHTML
	$("a").each(function(element) {
    	var linkObj = {
    		"href": this.href, 
    		"content": this.innerHTML
    	}
    	
    	// prepare all extracted url to be pass to phishing checker api
    	threatEntries.push({"url": linkObj.href});
	})

	// Remove duplicates and invalid URLs.
	var kBadPrefix = 'javascript';
	for (var i = 0; i < threatEntries.length;) {
	  if (((i > 0) && (threatEntries[i].url == threatEntries[i - 1].url)) ||
	      (threatEntries[i].url == '') ||
	      (kBadPrefix == threatEntries[i].url.toLowerCase().substr(0, kBadPrefix.length))) {
	    threatEntries.splice(i, 1);
	  } else {
	    ++i;
	  }
	}

	// update stats
	updateStatsForTotalLinks(threatEntries.length)
}

function checkLinksWithGoogleSafeBrowsingAPI() {

	var search_data =  {
    "client": {
      "clientId":      "chrome extension test",
      "clientVersion": "1"
    },
    "threatInfo": {
      "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING", "POTENTIALLY_HARMFUL_APPLICATION"],
      "platformTypes":    ["WINDOWS"],
      "threatEntryTypes": ["URL"],
      "threatEntries": threatEntries
    }
  };

  	// invoke ajax call to phishing checker site
	var xhr = $.ajax({
	  url: threatSearchURL,
	  context: document.body,
	  contentType: 'application/json',
	  type: 'POST',
	  dataType: 'json',
	  data: JSON.stringify(search_data),
	  success: function(data) {
	  	// successfully executed the phishing check call. now pass to handle the check result
	  	processGoogleSuccessResponse(data);
	  	printDetectionResultToWebpage();
	  	
	  },
	  error: function(data) {
	  	console.log(data);
	  	encounteredError = 1
	  	printDetectionResultToWebpage();
	  }
	}).done(function() {

	});
	console.log("processing done")
}

function printDetectionResultToWebpage() {
	chrome.extension.sendRequest({"threats": threats, 
								  "phishing_stats": phishing_stats,
								  "encounteredError": encounteredError
								});
}

$(document).ready(function () {
	extractAHrefLinksFromBody();
	checkLinksWithGoogleSafeBrowsingAPI();
});
