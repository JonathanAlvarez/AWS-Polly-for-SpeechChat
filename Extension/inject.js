function inject()
{
    let aws = document.createElement("script");
    aws.src = "https://dedi-readie.global-gaming.co/cdn/scripts/aws-sdk-2.783.0.min.js";
    document.body.appendChild(aws);
    setTimeout(() => //Wait for AWS script to have initalised
    {
        let tts = document.createElement("script");
        tts.src = "https://dedi-readie.global-gaming.co/cdn/scripts/aws-polly-for-speechchat/Extension/tts.js";
        document.body.appendChild(tts);
    }, 5000);
}
inject();

//#region Manual injection
//https://cdn.jsdelivr.net/gh/kOFReadie/AWS-Polly-for-SpeechChat/Extension/tts.js
/*
    let inject_tts = document.createElement("script");
    inject_tts.src = "https://dedi-readie.global-gaming.co/cdn/scripts/aws-polly-for-speechchat/Extension/inject.js";
    document.body.appendChild(inject_tts);
*/
//#endregion