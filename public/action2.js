const modes = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };
const count = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };

const SCRIPT = [
    { from: 1.9, to: 2.3, words: 'chick', audio: 'chick.ogg', level: 1 },
    { from: 5.5, to: 5.8, words: 'gay', audio: 'gay.ogg', level: 1.1 },
    { from: 8.0, to: 8.7, words: 'short man', audio: 'short_man.ogg', level: 1.5 },
    { from: 10.4, to: 11.1, words: 'cute car', audio: 'cute_car.ogg', level: 1.5 },
    { from: 11.9, to: 12.7, words: 'slow car', audio: 'slow_car.ogg', level: 1.5 },
    { from: 13.0, to: 15.1, words: 'single young professional', audio: 'single_young_professional.ogg', level: 1.7 },
    { from: 16.5, to: 17.4, words: 'street cred', audio: 'street_cred.ogg', level: 3 },
    { from: 17.7, to: 18.9, words: "ain't", audio: 'aint.ogg', level: 3 },
    { from: 17.7, to: 18.9, words: 'hip hop', audio: 'hip_hop.ogg', level: 1 },
    { from: 19.1, to: 19.6, words: 'kidless', audio: 'kidless.ogg', level: 1.4 },
    { from: 19.9, to: 20.3, words: 'cute', audio: 'cute.ogg', level: 1 },
    { from: 20.5, to: 21.2, words: 'small', audio: 'small.ogg', level: 1 },
    { from: 22.4, to: 23.1, words: "doesn't care", audio: 'doesnt_care.ogg', level: 1.5 },
    { from: 23.2, to: 24.4, words: 'what you call it', audio: 'what_you_call_it.ogg', level: 2 },
];

const tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
/* eslint-disable */
// noinspection JSUnusedGlobalSymbols
function onYouTubeIframeAPIReady() {
    const width = $('#player').width();
    const height = width * 0.5625;               // 16:9

    // noinspection JSUnresolvedVariable,JSUnresolvedFunction
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
/* eslint-enable */

/* eslint-disable */
// noinspection JSUnusedLocalSymbols
function onPlayerReady(event) {
    resizeVideo();
    listen_play();
}
/* eslint-enable */

/* eslint-disable */
function resizeVideo() {
    const width = $('#player').width();
    const height = width * 0.5625;               // 16:9
    $('#cover').css('height', height);

    // player may not be ready yet
    try {
        // noinspection JSUnresolvedFunction
        player.setSize(width, height);
    } catch (err) {
        // ignore
    }

    $('#mark-button').css('width', width);
}
/* eslint-enable */

/* LISTEN */
/* eslint-disable */
$('#buttonListen').click(() => {
    mode = modes.LISTEN;
    $('.control-button').hide();
    count.LISTEN = 0;
    // noinspection JSUnresolvedFunction
    player.seekTo(0);
    listen_play();
});
/* eslint-enable */

let listenCount = 0;
/* eslint-disable */
function listen_play() {
    mode = modes.LISTEN;
    $('#msg1').text('Listen');
    $('#msg2').text('');
    $('#cover').css('opacity', '0');
    if (!count.LISTEN) {
        count.LISTEN = 0;
    }
    // noinspection JSUnresolvedFunction
    player.playVideo();
}
/* eslint-enable */

function onPlayerStateChange(event) {
    // noinspection Eslint
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

/* eslint-disable */
function listen_stateChange(event) {
    // noinspection JSUnresolvedVariable
    if (event.data === YT.PlayerState.ENDED) {
        $('#msg1').text('Listen');
        $('#msg2').text('Click to countinue');
        $('#cover').css('opacity', '1');
        $('#cover').click(() => {
            listen_play();
        });
        count.LISTEN++;
        listenCount++;
    }
    $('#listenCounter').text(listenCount);
}
/* eslint-enable */

/* STUDY */
/* eslint-disable */
$('#buttonStudy').click(() => {
    resizeVideo();
    // noinspection JSUnresolvedFunction
    player.pauseVideo();
    mode = modes.STUDY;
    $('#cover').css('opacity', '1');
    $('#prev-button').css('visibility', 'visible');
    $('#prev-button').css('margin-top', '349px');
    $('#skip-button').css('visibility', 'visible');
    $('#msg1').text('Study');
    $('#msg2').text('');
    study_start();
});
/* eslint-enable */

function study_start() {
    // noinspection Eslint
    if (mode === modes.STUDY) {
        // noinspection Eslint
        const step = study_step();
        // noinspection Eslint
        study_opac(step);
        // noinspection Eslint
        study_play(step);
        // noinspection Eslint
        console.log(step);
    }
}

let studyStep;
function study_step() {
    if (!studyStep) {
        studyStep = 0;
    } else {
        if (studyStep > SCRIPT.length) {
            studyStep = 0;
        }
    }
    return studyStep;
}

// noinspection Eslint
function study_opac(step) {
    let opac = 0;
    // noinspection Eslint
    $('#msg1').css('opacity', opac);
    opac += 0.2;
}

function study_play(step) {
    // noinspection Eslint
    $('#audio').empty();
    // noinspection Eslint
    $('#audio').append(`<audio id='audio-now'><source src='audio/${SCRIPT[step].audio}' type='audio/ogg'></audio>`);
    // noinspection Eslint
    $('#msg1').text(SCRIPT[step].words);
    const audio_now = document.getElementById('audio-now');
    audio_now.play();
    studyStep++;
    study_step(step);
}


// action!
/* eslint-disable */
let mode = modes.LISTEN;
$('#marker').hide();
resizeVideo();
/* eslint-enable */
