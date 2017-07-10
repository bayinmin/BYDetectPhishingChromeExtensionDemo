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

// call back from process_links.js after processing done
chrome.extension.onRequest.addListener(function(links) {
   for(var i in links) {
      var linkObj = links[i];
      var para = document.createElement("p");
      var node = document.createTextNode(linkObj.href);
      para.appendChild(node);
      var element = document.getElementById("div1");
      element.appendChild(para);
   }
});