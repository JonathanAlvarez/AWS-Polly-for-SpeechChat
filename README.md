# AWS Polly for SpeechChat

## Note:
**This project has been archived and will not recieve any more updates in favour of the [Stream Tools](https://github.com/kOFReadie/Stream-Tools) project.**

Reads out twitch, youtube and mixer chat from [SpeechChat](https://www.SpeechChat.com) using [AWS Polly](https://aws.amazon.com/polly/). 

**Check out what sort of stuff you can do with it in this guide [here](https://github.com/kOFReadie/Twitch-TTS-Browser-Extension/TTS_Examples/).**

This should update automatically as the extension injects the [javascript in this github repository](https://github.com/kOFReadie/Twitch-TTS-Browser-Extension/blob/master/Extension/tts.js) to the SpeechChat website.

**NOTE:** Due to initialization errors wait 5 seconds and then click on the page a few times to initalise the TTS, you should see that under the SpeechChat tab only the general and voice tabs are visible (I will work on a fix for this in the future).

# **Installation:**
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

//DOM requires user to interact with the document first befor allowing .play() to be automatically triggered, auto unmute disabled.
const urlParams = new URLSearchParams(location.search);
var messagesToRead = [];
let ttsEngine = "standard";
let ttsVoice = "Brian";
let allowScript = false;
let aws = document.createElement("script");
aws.src = "https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.1194.0/aws-sdk.min.js";
document.body.appendChild(aws);

window.addEventListener("load", () => { _init(false); });

function _init(manualFire)
{
    let timeout = manualFire ? 5000 : 500;
    setTimeout(() =>
    {
        if (urlParams.has("region") && urlParams.has("IdentityPoolId"))
        {
            allowScript = true;

            AWS.config.region = urlParams.get("region");
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: urlParams.get("IdentityPoolId")});

            let initTTS = setInterval(() =>
            {
                try
                {
                    document.body.click();
                    initialiseScript();
                    clearInterval(initTTS);
                }
                catch (error) { console.error(error); }
            }, 1000);
        }
        else { console.log("%cregion or IdentityPoolId paramaters are missing, please provide these paramaters in order to use AWS Polly. If you do not know how to get these details check the documentation here: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html", "color: red"); }
    }, timeout);
}
_init(true);

let userInteracted = false;
window.addEventListener("mousedown", () =>
{
    if (!userInteracted && allowScript)
    {
        userInteracted = true; window.removeEventListener("mousedown", this);

        let muteAttempts = 0;
        let mute = setInterval(() =>
        {
            let muteCheck = document.querySelector("#speech-checkbox");
            if (muteCheck != null)
            {
                let voiceTab = muteCheck.parentElement.parentElement;
                /*if (!muteCheck.checked) { muteCheck.click(); }
                muteCheck.parentElement.parentElement.removeChild(muteCheck.parentElement);*/ //Fix auto disable
                let pauseShortcutInput = document.querySelector("#pause_speech-hotkey-input");
                for (let i = voiceTab.childElementCount; i > 1; i--) //Set to 0 when audio disable is fixed
                { voiceTab.removeChild(voiceTab.childNodes[i]); }
                voiceTab.removeChild(voiceTab.querySelector("#username-voice-select-div"));
                pauseShortcutInput.parentElement.removeChild(pauseShortcutInput);
                let appMenuControlPanel = document.querySelector("#app-menu-controlpanel-div").firstChild;
                appMenuControlPanel.removeChild(appMenuControlPanel.childNodes[4]);
                appMenuControlPanel.removeChild(appMenuControlPanel.childNodes[3]);
                appMenuControlPanel.removeChild(appMenuControlPanel.childNodes[2]);
                clearInterval(mute);
            }
            else if (muteAttempts >= 10) { clearInterval(muteAttempts); }
            muteAttempts++;
        }, 1000);
    }
});

let initalised = false;
function initialiseScript()
{
    if (!initalised)
    {
        createTTSPlayer();
        handleRequests();
        ttsEngine = urlParams.has("Engine") ? urlParams.get("Engine") : "standard";
        ttsVoice = urlParams.has("Voice") ? urlParams.get("Voice") : "Brian";
        initalised = true;
    }
}

function handleRequests()
{
    //Watch for added messages
    let observer = new MutationObserver((mutations) =>
    {
        mutations.forEach(mutation =>
        {
            mutation.addedNodes.forEach(node =>
            {
                let messageValid = false;
                let validClasses = ["twitch-chat-li", "youtube-chat-li", "mixer-chat-li"];
                let invalidClasses = ["chat-line-system-msg", "chat-line-event-msg", "youtube-sending-message"];
                for (let i = 0; i < validClasses.length; i++) { if (node.classList.contains(validClasses[i])) { messageValid = true; }}
                if (messageValid) { for (let i = 0; i < invalidClasses.length; i++) { if (node.classList.contains(invalidClasses[i])) { messageValid = false; break; }}}

                if (messageValid)
                {
                    let message = { msg: node.querySelector(".chat-line-message"), image: 0 };
                    message.text = message.msg.innerText.split(" ");
                    message.images = message.msg.querySelectorAll("img");
                    for (let i = 0; i < message.text.length; i++) { if (message.text[i] == "") { message.text[i] = message.images[message.image++].alt; }}
                    message = message.text.join(" ");
                    let blacklistedStarts = ["!", "whisper"];
                    for (let i = 0; i < blacklistedStarts.length; i++) { if (message.startsWith(blacklistedStarts[i])) { messageValid = true; }}
                    if (messageValid)
                    {
                        messagesToRead.push(message);
                        if (messagesToRead.length <= 1) { synthesizeSpeech(); }
                    }
                }
            });
        });
    });
    observer.observe(document.querySelector("#messages-ul"), {childList: true}); //Watch for message updates
}

//TTS
let ttsMuted = false;
async function synthesizeSpeech()
{
    var speechParams =
    {
        Engine: ttsEngine,
        OutputFormat: "mp3",
        SampleRate: "22050",
        Text: messagesToRead[0],
        TextType: "text",
        VoiceId: ttsVoice
    }

    if (!ttsMuted && userInteracted)
    {
        var polly = new AWS.Polly({apiVersion: '2016-06-10'});
        var signer = new AWS.Polly.Presigner(speechParams, polly);

        signer.getSynthesizeSpeechUrl(speechParams, function(error, url)
        {
            if (error) { console.log(`%c${error}`, "color: red"); }
            else
            {
                document.querySelector("#source").src = url;
                let player = document.querySelector("#audio");
                player.load();
                player.play();
            }
        });
    }
    else { messagesToRead.shift(); }
}

let firstPlayer = true;
function createTTSPlayer()
{
    if (firstPlayer)
    {
        let pauseButton = document.querySelector("#pause-speech-button");
        pauseButton.addEventListener("click", () =>
        {
            let buttonText = window.getComputedStyle(pauseButton, ":after").getPropertyValue("content");
            if (buttonText == `" Pause speech"`) { ttsMuted = true; }
            else { ttsMuted = false; }
        });

        let mp3Player = document.createElement("audio");
        let mp3Config = document.createElement("source");
        mp3Player.style.display = "none";
        mp3Player.id = "audio";
        mp3Player.volume = 1;
        mp3Config.id = "source";
        mp3Player.appendChild(mp3Config);
        document.body.appendChild(mp3Player);

        //Remove previous TTS request and start next if list is not empty
        mp3Player.addEventListener("ended", () => { continueTTS() });

        mp3Player.addEventListener("error", (err) => { console.error(err); continueTTS(); })

        function continueTTS()
        {
            messagesToRead.shift();
            if (messagesToRead.length >= 1) { synthesizeSpeech(); }
        }

        firstPlayer = false;
    }
}
```

# **Parameters**:
## **Need help setting up AWS first?**  
Read [this tutorial](https://github.com/kOFReadie/AWS-Polly-for-SpeechChat/blob/master/AWS%20Setup.md) on how to setup AWS.

**These parameters are case sensitive.**
### **region & IdentityPoolId (required)**:
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
