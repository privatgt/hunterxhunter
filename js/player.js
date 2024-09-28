let playlist;
function play(list){
    // Load the YouTube IFrame API
    playlist=list;
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
let currentVideoIndex = 0;
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: playlist[0].videoId,
        playerVars: {
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            cc_lang_pref:"en"
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const videoIds = playlist.map(item => item.videoId);
    player.loadPlaylist(videoIds, 0, playlist[0].start);
    player.playVideo();
    if (playlist[currentVideoIndex].caption === 1) {
                    player.loadModule("captions");
                    player.setOption("captions", "track", {"languageCode": "en"});
                } else {
                    player.unloadModule("captions");
                }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        startTimeCheck();
        handleVideoChange();
    } else if (event.data === YT.PlayerState.ENDED) {
        handleNextVideo();
    } else {
        stopTimeCheck();
    }
}

function handleVideoChange() {
    const currentVideoId = player.getVideoData().video_id;
    let playindex=player.getPlaylistIndex()
    if (playindex!=currentVideoIndex){
    currentVideoIndex = playindex;
    if (currentVideoIndex !== -1) {
        const currentVideo = playlist[currentVideoIndex];
        player.seekTo(currentVideo.start);
        if (playlist[currentVideoIndex].caption === 1) {
                    player.loadModule("captions");
                    player.setOption("captions", "track", {"languageCode": "en"});
                } else {
                    player.unloadModule("captions");
                }
    }
}
}

function handleNextVideo() {
    currentVideoIndex++;
    if (currentVideoIndex < playlist.length) {
        player.playVideoAt(currentVideoIndex);
        player.seekTo(playlist[currentVideoIndex].start)
        if (playlist[currentVideoIndex].caption === 1) {
                    player.loadModule("captions");
                    player.setOption("captions", "track", {"languageCode": "en"});
                } else {
                    player.unloadModule("captions");
                }
    } else {
        stopTimeCheck();
        player.stopVideo();
    }
}

let timeCheckInterval;
function startTimeCheck() {
    stopTimeCheck();
    timeCheckInterval = setInterval(checkTime, 100);
}

function stopTimeCheck() {
    if (timeCheckInterval) {
        clearInterval(timeCheckInterval);
    }
}

function checkTime() {
    const currentTime = player.getCurrentTime();
    const currentVideo = playlist[currentVideoIndex];

    if (currentTime >= currentVideo.end && currentVideo.end!=-1) {
        handleNextVideo();
    } else if (currentTime < currentVideo.start) {
        player.seekTo(currentVideo.start);
    }
}


