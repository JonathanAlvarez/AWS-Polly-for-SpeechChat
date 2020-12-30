# AWS Polly for SpeechChat
Reads out twitch, youtube and mixer chat from [SpeechChat](https://www.SpeechChat.com) using [AWS Polly](https://aws.amazon.com/polly/). 

**Check out what sort of stuff you can do with it in this guide [here](https://github.com/kOFReadie/Twitch-TTS-Browser-Extension/TTS_Examples/).**

This should update automatically as the extension injects the [javascript in this github repository](https://github.com/kOFReadie/Twitch-TTS-Browser-Extension/blob/master/Extension/tts.js) to the SpeechChat website.

**NOTE:** Due to initialization errors wait 5 seconds and then click on the page a few times to initalise the TTS, you should see that under the SpeechChat tab only the general and voice tabs are visible.

## **Installation:**
### **Method 1** - CRX web extension:
This is the easiest method to use, go and download my latest [release](https://github.com/kOFReadie/Twitch-TTS-Browser-Extension/releases/latest) and then open it in your browser.  
If it disallows the installation then proceed to [method 2](#method-2---script-manager-extension).

### **Method 2** - Script manager extension:
Go ahead and install a script manager extension of your choice e.g. [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf).  
Then create a new script and paste this code into the file (if using Tampermonkey, other extensions may differ slightly).
```js
// ==UserScript==
// @name         AWS Polly for SpeechChat
// @version      1.1
// @description  Reads out twitch, youtube and mixer chat from SpeechChat using AWS Polly.
// @author       kOFReadie
// @match        https://*.SpeechChat.com/*
// @source       https://github.com/kOFReadie/AWS-Polly-for-SpeechChat
// ==/UserScript==

(function()
{
    let inject_tts = document.createElement("script");
    inject_tts.src = "https://cdn.global-gaming.co/resources/scripts/aws-polly-for-speechchat/Extension/inject.js";
    document.body.appendChild(inject_tts);
})();
```

## **Parameters**:
**These are case sensitive.**
### **region & IdentityPoolId (required)**:
In order for this to work with the AWS Polly services you must supply a region and IdentityPoolId, these can be obtained by following this [AWS guide](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html) and following steps 1 and 2.
The details you are looking for should look something like this:
```js
AWS.config.region = 'eu-west-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'eu-west-2:2a6e81f2-****-****-****-76206049a562'});
```
Take the IdentityPoolId, replace the `:` with `%3A`, and region values and place them into the url like so: `?region=eu-west-2&IdentityPoolId=eu-west-2%3A2a6e81f2-****-****-****-76206049a562`

### **Voice**:
Allows you to change the TTS voice e.g. `?Voice=Brian` (default).  
Avaliable voices to choose from:  
| Language | Name/ID | Gender | Standard Voice | Neural Voice |
| - | - | - | :-: | :-: |
| **English (British) (en-GB)** | Amy | Female | Yes | Yes |
|  | Emma | Female | Yes | Yes |
|  | Brian | Male | Yes | Yes |
| **English (US) (en-US)** | Ivy | Female (child) | Yes | Yes |
|  | Joanna** | Female | Yes | Yes |
|  | Kendra | Female | Yes | Yes |
|  | Kimberly | Female | Yes | Yes |
|  | Salli | Female | Yes | Yes |
|  | Joey | Male | Yes | Yes |
|  | Justin | Male (child) | Yes | Yes |
|  | Kevin | Male (child) | No | Yes |
|  | Matthew** | Male | Yes | Yes |
| **English (Australian) (en-AU)** | Nicole | Female | Yes | No |
|  | Russell | Male | Yes | No |
More voices can be found [here](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html)  
** These voices can be used with both the Conversational and Newscaster speaking styles when used with the Neural format. For more information, see [NTTS Speaking Styles](https://docs.aws.amazon.com/polly/latest/dg/ntts-speakingstyles.html).

### **Engine**:
Allows you to change the engine type between `neural` and `standard`, make sure if you want to use neural that the voice you are trying to use is supported `?Engine=neural` (standard is the default).

## **Why did I make this**?
Because the website TTS does not work within OBS and also AWS has many more voices, like Brian. Enjoy!