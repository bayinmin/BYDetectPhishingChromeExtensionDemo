// run after window already loaded
window.onload = function() {
  chrome.windows.getCurrent(function (currentWindow) {
	  
    // get active tab
      chrome.tabs.query({active: true, windowId: currentWindow.id},
                        function(activeTabs) {
        // import jquery library first
        chrome.tabs.executeScript(null, {file:'third-party/jquery-3.2.1.min.js'}, function(result){
          // run link processing script
          chrome.tabs.executeScript(activeTabs[0].id, {file: 'process_links.js', allFrames: true});
        });
     });
  });
};

function updateStatsUI(stats) {
  $('#stats-details').empty();
  $('<p><b> Total Links Found: </b>' + stats.totalLinks + '</p>').appendTo('#stats-details');
  $('<p><b> Total Links Malicious: </b>' + stats.totalMaliciousLinks + '</p>').appendTo('#stats-details');
}

function updateResultUI(threats,stats) {
  if(threats.length > 0) {
    $('#result-details').empty();
    $('<p><b><font color=\'red\'>Phishing attempt detected!</p></font></b>').appendTo('#result');

    for(var i in threats) {
      var t = threats[i].threat
      var tt = threats[i].threatType.toLowerCase()
      var p = threats[i].platformType.toLowerCase()
      $('<hr style=\"height:1px;border:none;color:#333;background-color:#333;\"/>').appendTo('#result');
      $('<p> <b><font size=\'2\'>URL Identified</font></b> : <font color=\'red\' size=\'2\'>'+ t +'</font></p>').appendTo('#result');
      $('<p> <b><font size=\'2\'>Nature of threat:</font></b> <font size=\'2\'>'+ tt +'</p>').appendTo('#result');
      $('<p> <b><font size=\'2\'>Platform affected:</font></b> <font size=\'2\'>'+ p +'</p>').appendTo('#result');
      console.log(threats[i])
    }

    updateStatsUI(stats);
  }else {
    $('#result-details').empty();
    $('<p><b><font color=\'green\'>The page might be safe!</p></font></b>').appendTo('#result');
    updateStatsUI(stats);
  }
}

function updateProcessingErrorUI() {
  $('#result-details').empty();
  $('#stats-details').empty();
  $('<p><b><font color=\'blue\'> Error: Unable to complete detection. </p></font></b>').appendTo('#result');
  $('<p><b><font color=\'blue\'> Error: Unable to complete detection. </p></font></b>').appendTo('#stats-details');
}

// call back from process_links.js after processing done
chrome.extension.onRequest.addListener(function(data) {

  threats = data.threats;
  stats = data.phishing_stats;
  isError = data.encounteredError;

  if(isError) {
    updateProcessingErrorUI();
  }else {
    updateResultUI(threats,stats);
  }

});