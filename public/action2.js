var modes = { LISTEN:1, MARK:2, STUDY:3, MARKED:4 };
var count = { LISTEN:1, MARK:2, STUDY:3, MARKED:4 };

var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
//noinspection JSUnusedGlobalSymbols
function onYouTubeIframeAPIReady() {
    //noinspection JSUndeclaredVariable
    width = $('#player').width();
    //noinspection JSUndeclaredVariable
    height = width * 0.5625;               // 16:9

    //noinspection JSUnresolvedVariable,SpellCheckingInspection,JSUnresolvedFunction
    player = new YT.Player('player', {
        width: width,
        height: height,
        videoId: 'Pf4A1Sl_OkI',
        // videoId: 'S0s2J4m5ITg',
        // videoId: 'Y9XqYAzbmTI',
        playerVars: { 'autoplay': 0, 'controls': 0, 'showinfo': 0, 'rel': 0, 'hl':'en' },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

//noinspection JSUnusedLocalSymbols
function onPlayerReady(event) {
    resizeVideo();
    listen_play();
}

function resizeVideo() {
    //noinspection JSUndeclaredVariable
    width = $("#player").width();
    //noinspection JSUndeclaredVariable
    height = width * 0.5625;               // 16:9
    $("#cover").css('height', height);

    // player may not be ready yet
    try {
        //noinspection JSUnresolvedFunction
        player.setSize(width, height);
    }
    catch(err) {
        // ignore
    }

    $("#mark-button").css('width', width);
}


/* LISTEN */
$('#buttonListen').click(function () {
    //noinspection JSUndeclaredVariable
    mode = modes.LISTEN;
    $('#control-button').hide();
    count.LISTEN = 0;
    //noinspection JSUnresolvedFunction
    player.seekTo(0);
    listen_play();
});

var listenCount = 0;
function listen_play() {
    //noinspection JSUndeclaredVariable
    mode = modes.LISTEN;
    $('#msg1').text('Listen');
    $('#msg2').text('');
    $('#cover').css('opacity', '0');
    if (!count.LISTEN) {
        count.LISTEN = 0;
    }
    if (count.LISTEN) {
        //noinspection JSUnresolvedFunction
        player.playVideo();
    }
}

function onPlayerStateChange(event) {
    switch (mode) {
        case modes.LISTEN :
            listen_stateChange(event);
            break;
        case modes.MARK :
            // mark_stateChange(event);
            break;
        case modes.STUDY :
            // study_stateChange(event);
            break;
        case modes.MARKED :
            // marked_stateChange(event);
            break;
        default :
            alert("onPlayerStateChange() unhandled " + mode);
            break;
    }
}

function listen_stateChange(event) {
    //noinspection JSUnresolvedVariable
    if (event.data == YT.PlayerState.ENDED){
        $('#msg1').text('Listen');
        //noinspection SpellCheckingInspection
        $('#msg2').text('Click to countinue');
        //noinspection JSJQueryEfficiency
        $('#cover').css('opacity', '1');
        //noinspection JSJQueryEfficiency
        $('#cover').click(function () {
            listen_play();
        });
        count.LISTEN++;
        listenCount++;
    }
    $('#listenCounter').text(listenCount);
}


/* STUDY */


// action!
mode = modes.LISTEN;
$("#marker").hide();
resizeVideo();