window.addEventListener("load", () =>
{
    setTimeout(() => {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.setAttribute("src", "https://raw.githubusercontent.com/kOFReadie/Twitch-TTS-Browser-Extention/master/Extention/tts.js");
        document.head.appendChild(js);
    }, 1000);
});