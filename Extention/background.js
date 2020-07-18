chrome.browserAction.onClicked.addListener(function()
{
	chrome.tabs.query(
	{
		currentWindow: true,
		active: true
	}, function(tab)
	{
		chrome.tabs.create(
		{
			"url": "https://github.com/kOFReadie/Twitch-TTS-Browser-Extention"
		});
	});
});