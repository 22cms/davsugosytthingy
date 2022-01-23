//WARNING:
//It has been scientifically proven that a read of this code from anyone that knows how to code proparly
//WILL cause at least one of the following symptoms: Strokes, Seizures, eyebleeding, permanent blindness.
//It is recommended to anyone reading this message to ALT+F4 their browser IMMEDIATELY!
//Any health issue caused by ignoring the just-stated warnings is outside the responsibility of the undersigned.
//Francesco

//Declare the video preview DOMs
videoThumb = document.querySelector("#video-thumb");
videoTitle = document.querySelector("#video-title");
urlTextBox = document.querySelector("#url-textbox");
videoLength = document.querySelector("#video-length");
videoChannel = document.querySelector("#video-channel");
videoPreview = document.querySelector("#video-preview");
channelThumb = document.querySelector("#channel-thumb");

//Declare all textBoxes
titleTextBox = document.querySelector("#title-textbox");
channelTextBox = document.querySelector("#channel-textbox");
viewCountTextBox = document.querySelector("#viewcount-textbox");
dateTextBox = document.querySelector("#date-textbox");
lengthTextBox = document.querySelector("#length-textbox");
previewThemeForm = document.querySelector("#preview-theme-form");


//Function: Fetches all video's info to apply them to the Fake Preview
function getVideo() {
	if (urlTextBox.value != "") {
		input = urlTextBox.value.replace(/http(s|):\/\//g, "");
		
		if (input.includes("youtube.com")) input = input.split("/")[1].split("&")[0].replace("watch?v=", "");
		else if (input.includes("youtu.be")) input = input.split("/")[1].split("?")[0];
		else if (input.length != 11) return; 
		
		fetchVideoInfo(input);
		
		videoThumb.src = `https://i.ytimg.com/vi/${input}/mqdefault.jpg`;
	}
}

//Function: Fetches Video Info and Applies them to the DOM elements. Also starts the channel image fetching
function fetchVideoInfo(id) {
	url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics%2CcontentDetails&id=${id}&key=${atob(apiKey)}`
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			results = JSON.parse(xhr.response).items[0];
			
			fetchChannelImage(results.snippet.channelId);
			videoTitle.innerText = results.snippet.title;
			
			titleTextBox.value = results.snippet.title;
			channelTextBox.value = results.snippet.channelTitle;
			viewCountTextBox.value = results.statistics.viewCount;
			dateTextBox.value = results.snippet.publishedAt;
			lengthTextBox.value = results.contentDetails.duration;
			
			videoLength.innerText = getDuration(results.contentDetails.duration).string;
			videoChannel.innerText = formatChannelString(results.snippet.channelTitle, 
				results.statistics.viewCount, 
				results.snippet.publishedAt
			);
		}
	}
	
	xhr.send();
}

//Function: Fetches the Channel Profile picture and Applies it to the DOM element
function fetchChannelImage(channelId) {
	url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${atob(apiKey)}`
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			results = JSON.parse(xhr.response).items[0];
			
			channelThumb.src = results.snippet.thumbnails.medium.url;
		}
	}
	
	xhr.send();
}

//Function: Makes a formatted Channel String from input data
function formatChannelString(channelTitle, viewCount, publishedAt) {
	//Format the View Count
	formatter = new Intl.NumberFormat();
	var viewCountStr = viewCount.toString();
	
	if (viewCount >= 10000) {
		if (viewCount >= 1000000) viewCountStr = Math.floor(viewCount/1000000).toString() + curLang.milionOf;
		else viewCountStr = formatter.format(viewCount).toString();
	}
	//Format the Date
	dateFormatter = new Date();
	var dateAgo = "1 minute";
	
	var d1 = new Date(publishedAt), // Publication Date in ISO format
		d2 = new Date(); // Current ISO Date
	var diff = d2 - d1;
	var tempDate, agoType;
	//Eye-blinding part of the function
	if (diff > 3.154e+10) {tempDate = Math.floor(diff / 3.154e+10); agoType = "year"}
	else if (diff > 2.628e+9) {tempDate = Math.floor(diff / 2.628e+9); agoType = "month"}
	else if (diff > 1.21e+9) {tempDate = Math.floor(diff / 1.21e+9); agoType = "week"}
	else if (diff > 8.64e+7) {tempDate = Math.floor(diff / 8.64e+7); agoType = "day"}
	else if (diff > 3.6e+6) {tempDate = Math.floor(diff / 3.6e+6); agoType = "hour"}
	else if (diff > 60e3) {tempDate = Math.floor(diff / 60e3).toString(); agoType = "minute"} 

	dateAgo = `${tempDate.toString()} ${curLang.dateTable[agoType][(tempDate > 1) ? 1 : 0]}`;
	completeChannel = `${channelTitle} · ${viewCountStr} ${curLang.views} · ${dateAgo} ${curLang.ago}`
	
	return completeChannel;
}

//Function: Parses YouTube APIs' ISO 8601 PT duration string into an object, slightly modified so that the return string is in the (hh:)mm:ss format
//Source: https://cheatcode.co/tutorials/how-to-fetch-a-youtube-videos-duration-in-node-js, 
function getDuration(durationString) {
	const duration = { hours: 0, minutes: 0, seconds: 0 };
	const durationParts = durationString
		.replace("PT", "")
		.replace("H", ":")
		.replace("M", ":")
		.replace("S", "")
		.split(":");

	if (durationParts.length === 3) {
		duration["hours"] = durationParts[0];
		duration["minutes"] = durationParts[1];
		duration["seconds"] = durationParts[2];
	}

	if (durationParts.length === 2) {
		duration["minutes"] = durationParts[0];
		duration["seconds"] = durationParts[1];
	}

	if (durationParts.length === 1) {
		duration["seconds"] = durationParts[0];
	}

	return {
		...duration,
		string: `${(duration.hours) ? duration.hours + ':' : ''}${duration.minutes}:${(duration.seconds >= 10) ? "" : "0"}${duration.seconds}`,
	}
}


//Function: automatically updates the videoChannel innerText with the textBoxes' values
function updateVideoChannel() {
	videoTitle.innerText = titleTextBox.value;
	videoLength.innerText = getDuration(lengthTextBox.value).string;
	videoChannel.innerText = formatChannelString(channelTextBox.value, 
		viewCountTextBox.value, 
		dateTextBox.value
	);
}

//Function: Changes the Preview Theme
function changeTheme() {
	document.body.removeAttribute("class");
	document.body.classList.add(previewThemeForm.previewTheme.value)
}

//Function: change the Preview Zoom
function zoomPreview(elem) {
	scaleStr = (elem.value/100).toString()
	videoPreview.style.transform = `scale(${scaleStr})`
}