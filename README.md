# Twitch TTS Browser Extension
Reads out twitch chat from the [popout window](https://www.twitch.tv/popout/kof_readie/chat).  
[Here](https://gist.github.com/5E7EN/1fa2fd5edd7e0ee1b5606ba6cf6c2a1c) is some stuff you can do with Brian.  
This should update automatically as the extension injects the [javascript in this github repository](https://github.com/kOFReadie/Twitch-TTS-Browser-Extension/blob/master/Extension/tts.js) to the twitch chat page.

**If you notice that the TTS isn't working then go [here](https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=Verifying%20that%20I%27m%20not%20a%20bot) and prove that you are not a robot.**

## **Installation:**
### Method 1 - CRX web extension:
This is the easiest method to use, go and download my latest [release](https://github.com/kOFReadie/Twitch-TTS-Browser-Extension/releases/) and then open it in your browser.  
If it disallows the installation then proceed to [method 2](#method-2---script-manager-extension).

### Method 2 - Script manager extension:
Go ahead and install a script manager extension of your choice e.g. [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf).  
Then create a new script and paste this code into the file (if using Tampermonkey, other extensions may differ slightly).
```js
// ==UserScript==
// @name         Twitch TTS
// @version      1.0
// @description  Reads out twitch chat from the popout window.
// @author       kOFReadie
// @match        https://*.twitch.tv/popout/*/chat
// @source       https://github.com/kOFReadie/Twitch-TTS-Browser-Extension
// ==/UserScript==

(function()
{
    //Delay helps prevent load errors
    setTimeout(function()
    {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.setAttribute("src", "https://cdn.jsdelivr.net/gh/kOFReadie/Twitch-TTS-Browser-Extension/Extension/tts.js");
        document.head.appendChild(js);
    }, 1000);
})();
```

## **Parameters**:
**These are case sensitive.**
### voice:
Allows you to change the TTS voice e.g. `?voice=Brian` (default)  
These voices run on the streamelements.com API, you can see what voices they have with [this](https://www.elunduscore.com) website.