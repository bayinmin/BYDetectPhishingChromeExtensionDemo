# BYDetectPhishingChromeExtensionDemo Developer Guide

This is Chrome Google Extension that detects potentially malicious link within the web and reports confirmed malicious link information by utilizing Google Safe Browsing API v4. This application is for demo only and not suitable for any kind of production use.

# Framework & Dependencies

Google Chrome Extension framework

Google Safe Browsing API v4

jquery-3.2.1.min.js

# Chrome Extension Installation

1. Download BYDetectPhishingChromeExtensionDemo from github. Do note that the *test_resources* folder contain static HTML page pointing to known malicious site. The developer/users are suggested to use with care and not to click those dangerous links. For safety, the *test_resources* folder should be deleted off if no test needs to be performed.

2. Locate *process_links.js* and change *GOOGLE_API_KEY* value with valid Google Safe Browsing API key

![](https://github.com/bayinmin/BYResources/blob/master/BYDetectPhishingChromeExtensionDemo/pic_phishing_install0.png)

3. Open Google Chrome browser and go to manage extension page by inputing *chrome://extensions* in the URL

![](https://github.com/bayinmin/BYResources/blob/master/BYDetectPhishingChromeExtensionDemo/pic_phishing_install1.png)

4. Click *Load Unpacked Extension* to locate the BYDetectPhishingChromeExtensionDemo folder containing manifest file

![](https://github.com/bayinmin/BYResources/blob/master/BYDetectPhishingChromeExtensionDemo/pic_phishing_install1.1.png)

![](https://github.com/bayinmin/BYResources/blob/master/BYDetectPhishingChromeExtensionDemo/pic_phishing_install2.png)

5. Verify the extension is loaded successfully(an icon will appear beside the browser url bar). If you counter unable to load error, make sure you choose the BYDetectPhishingChromeExtensionDemo with manifest file as root when loading. 

![](https://github.com/bayinmin/BYResources/blob/master/BYDetectPhishingChromeExtensionDemo/pic_phishing_install3.png)

# Further improvement points

1. More comprehensive error handling

2. Not hardcoding the key inside the JS file.

3. Function to check whether the current page URL itself is malicious
