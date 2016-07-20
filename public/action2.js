

const modes = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };
const count = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };

const tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
// noinspection Eslint,JSUnusedGlobalSymbols
function onYouTubeIframeAPIReady() {
    // noinspection Eslint
    const width = $('#player').width();
    const height = width * 0.5625;               // 16:9

    // noinspection JSUnresolvedVariable,JSUnresolvedFunction,Eslint
    player = new YT.Player('player', {
        width: width,
        height: height,
        videoId: 'Pf4A1Sl_OkI',
        // videoId: 'S0s2J4m5ITg',
        // videoId: 'Y9XqYAzbmTI',
        playerVars: { autoplay: 0, controls: 0, showinfo: 0, rel: 0, hl: 'en' },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

// noinspection Eslint,JSUnusedLocalSymbols
function onPlayerReady(event) {
    // noinspection Eslint
    resizeVideo();
    // noinspection Eslint
    listen_play();
}

// noinspection SpellCheckingInspection
function resizeVideo() {
    // noinspection Eslint
    const width = $('#player').width();
    const height = width * 0.5625;               // 16:9
    // noinspection Eslint
    $('#cover').css('height', height);

    // player may not be ready yet
    try {
        // noinspection JSUnresolvedFunction
        player.setSize(width, height);
    } catch (err) {
        // ignore
    }

    // noinspection Eslint
    $('#mark-button').css('width', width);
}


/* LISTEN */
// noinspection Eslint
$('#buttonListen').click(() => {
    // noinspection JSUndeclaredVariable,Eslint
    mode = modes.LISTEN;
    // noinspection Eslint
    $('#control-button').hide();
    count.LISTEN = 0;
    // noinspection JSUnresolvedFunction
    player.seekTo(0);
    // noinspection Eslint
    listen_play();
});

let listenCount = 0;
// noinspection Eslint
function listen_play() {
    // noinspection JSUndeclaredVariable,Eslint
    mode = modes.LISTEN;
    // noinspection Eslint
    $('#msg1').text('Listen');
    // noinspection Eslint
    $('#msg2').text('');
    // noinspection Eslint
    $('#cover').css('opacity', '0');
    if (!count.LISTEN) {
        count.LISTEN = 0;
    }
    if (count.LISTEN) {
        // noinspection JSUnresolvedFunction
        player.playVideo();
    }
}

function onPlayerStateChange(event) {
    //noinspection Eslint
    switch (mode) {
        case modes.LISTEN :
            // noinspection Eslint
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
        default : {
            // noinspection Eslint
            alert(`onPlayerStateChange() unhandled ${mode}`);
        }
    }
}

// noinspection Eslint
function listen_stateChange(event) {
    // noinspection JSUnresolvedVariable, Eslint
    if (event.data === YT.PlayerState.ENDED) {
        // noinspection Eslint
        $('#msg1').text('Listen');
        // noinspection SpellCheckingInspection,Eslint
        $('#msg2').text('Click to countinue');
        // noinspection JSJQueryEfficiency,Eslint
        $('#cover').css('opacity', '1');
        // noinspection JSJQueryEfficiency,Eslint
        $('#cover').click(() => {
            listen_play();
        });
        count.LISTEN++;
        listenCount++;
    }
    // noinspection Eslint
    $('#listenCounter').text(listenCount);
}


// action!
// noinspection Eslint,JSUnusedAssignment
let mode = modes.LISTEN;
// noinspection Eslint
$('#marker').hide();
// noinspection Eslint
resizeVideo();