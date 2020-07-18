function testing()
{
    
}

const urlParams = new URLSearchParams(location.search);
var messagesToRead = [];
let ttsVoice;

function initialiseScript()
{
    ttsVoice = urlParams.has("voice") ? urlParams.get("voice") : "Brian";
    
    testing();
    createTTSPlayer();
    createVolumeSlider();
    handleRequests();
}
initialiseScript();

function handleRequests()
{
    document.getElementsByClassName("chat-scrollable-area__message-container")[0].id = "chatContainer"; //Set ID on the chat container

    //Watch for added messages
    let observer = new MutationObserver((mutations) =>
    {
        let numMessages = document.querySelectorAll(".chat-line__message").length; //Index nukber of messages
        let messageContainer = document.getElementsByClassName("chat-line__message")[numMessages - 1]; //Get most recent message, GET SENDER NAME

        let message = ""; //Create message to write into

        //Loop through message divs
        for(let i = 0; i < messageContainer.getElementsByClassName("text-fragment").length; i++)
        {
            message += messageContainer.getElementsByClassName("text-fragment")[i].innerHTML; //Adds text to the message
            //ADD EMOTE READING
        }

        messagesToRead.push(message); //Add message to TTS queue

        if (messagesToRead.length <= 1) { playTTS(); } //Run TTS function if list was empty
    });
    observer.observe(chatContainer, {childList: true}); //Watch for message updates
}

//TTS
async function playTTS()
{
    //Set TTS source to most recent message, ADD USER CUSTOMISATION
    document.getElementById("source").setAttribute("src", "https://api.streamelements.com/kappa/v2/speech?voice=" + ttsVoice + "&text=" + encodeURIComponent(messagesToRead[0].trim()));
    let audio = document.getElementById("audio");
    audio.load();
    audio.play();
}

function createTTSPlayer()
{
    let mp3Player = document.createElement("audio");
    let mp3Config = document.createElement("source");
    mp3Player.style.display = "none";
    mp3Player.id = "audio";
    mp3Player.volume = 0.5;
    mp3Config.id = "source";
    mp3Player.appendChild(mp3Config);
    document.body.appendChild(mp3Player);

    //Remove previous TTS request and start next if list is not empty
    mp3Player.addEventListener("ended", () =>
    {
        messagesToRead.shift();
        if (messagesToRead.length >= 1) { playTTS(); }
    });

    //If there is a problem with the TTS, reload the page
    mp3Player.addEventListener("error", (exception) =>
    {
        console.log(exception);
        alert("You probable need to verify on the tts api that you are not a robot.");
        window.open("https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=Verifying%20that%20I%27m%20not%20a%20bot", "_blank");
        location.reload();
    });
}

function createVolumeSlider()
{
    var stylesheet = document.createElement("style");
    var css = `
    #volumeSliderContainer
    {
        width: 100px;
        position: relative;
        top: -2.5%;
    }

    #volumeSlider
    {
        position: absolute;
        -webkit-appearance: none;
        width: 100%;
        height: 2.5px;
        border-radius: 2.5px;
        background-color: transparent;
        outline: none;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    #volumeSlider:hover
    {
        cursor: pointer;
    }
    
    #volumeSlider::-webkit-slider-thumb
    {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%; 
        background: white;
        cursor: pointer;
    }

    #volumeSliderWhole
    {
        position: absolute;
        background-color: darkgray;
        height: 2.5px;
        width: 100%;
        border-radius: 25.px;
    }

    #volumeSliderLeft
    {
        position: absolute;
        background-color: white;
        height: 2.5px;
        width: 100%;
        border-radius: 2.5px;
    }
    `;
    
    stylesheet.appendChild(document.createTextNode(css));
    document.head.appendChild(stylesheet);

    var volumeSliderContainer = document.createElement("div");
    volumeSliderContainer.id = "volumeSliderContainer";

    var volumeSlider = document.createElement("input");
    volumeSlider.type = "range"
    volumeSlider.min = 0;
    volumeSlider.max = 100;
    volumeSlider.value = 50;
    volumeSlider.id = "volumeSlider";

    var volumeSliderWhole = document.createElement("div");
    volumeSliderWhole.id = "volumeSliderWhole"

    var volumeSliderLeft = document.createElement("div");
    volumeSliderLeft.id = "volumeSliderLeft"
    volumeSliderLeft.style.width = volumeSlider.value + "%";

    volumeSliderContainer.appendChild(volumeSliderWhole);
    volumeSliderContainer.appendChild(volumeSliderLeft);
    volumeSliderContainer.appendChild(volumeSlider);
    var chatButtonsContainer = document.getElementsByClassName("chat-input__buttons-container")[0];
    chatButtonsContainer.lastChild.insertBefore(volumeSliderContainer, chatButtonsContainer.lastChild.firstChild);

    volumeSlider.oninput = function()
    {
        volumeSliderLeft.style.width = volumeSlider.value + "%";
        document.getElementById("audio").volume = volumeSlider.value / 100;
    }
}