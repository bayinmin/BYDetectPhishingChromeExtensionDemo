
var GOOGLE_API_KEY = 'DUMMY';
var googleThreat = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" 
					  + GOOGLE_API_KEY;

var threatSearchURL = googleThreat;

threatEntries = []

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
	var threats = []

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

	console.log(threats)
}

$(document).ready(function () {

	// loop all a elements and extract href and innterHTML
	$("a").each(function(element) {
    	var linkObj = {
    		"href": this.href, 
    		"content": this.innerHTML
    	}
    	
    	// prepare all extracted url to be pass to phishing checker api
    	threatEntries.push({"url": linkObj.href});
    	limit = limit - 1;


	})

	var search_data =  {
    "client": {
      "clientId":      "yourcompanyname",
      "clientVersion": "1.5.2"
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
	  	processGoogleSuccessResponse(data)
	  },
	  error: function(data) {
	  	console.log(data.responseText)
	  }
	}).done(function() {

	});

	console.log("keep going")

   // chrome.extension.sendRequest(linkDic);
});
