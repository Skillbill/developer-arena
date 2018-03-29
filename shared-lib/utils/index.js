const youtubeRegExpr = /^https:\/\/(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch\?v=)(\w*)/;

const getYoutubeVideoKey = (url) => {
	let videoKey = null;
	if(url) {
		let match = url.match(youtubeRegExpr);
		if(match && match.length === 2) {
			videoKey = match[1];
		}
	}
	return videoKey;
};

module.exports.getYoutubeVideoKey = getYoutubeVideoKey;
