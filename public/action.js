/* global $, YT */

var modes = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };

var SCRIPT = [
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
    { from: 23.2, to: 24.4, words: 'what you call it', audio: 'what_you_call_it.ogg', level: 2 }
];


var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

/* eslint-disable no-unused-vars */
// noinspection JSUnusedGlobalSymbols
function onYouTubeIframeAPIReady() {
    var width = $('#player').width();
    var height = width * 0.5625;               // 16:9

    player = new YT.Player('player', {
        width: width,
        height: height,
        videoId: 'Pf4A1Sl_OkI',
        // videoId: 'S0s2J4m5ITg',
        // videoId: 'Y9XqYAzbmTI',
        playerVars: {
            autoplay: 0,
            controls: 0,
            showinfo: 0,
            rel: 0,
            hl: 'en'
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

// noinspection JSUnusedLocalSymbols
function onPlayerReady(event) {
    resizeVideo();
    listenPlay();
}

function resizeVideo() {
    var width = $('#player').width();
    var height = width * 0.5625;               // 16:9
    $('#cover').css('height', height);

    // player may not be ready yet
    try {
        player.setSize(width, height);
    } catch (err) {
        // ignore
    }

    $('#mark-button').css('width', width);
}

function onPlayerStateChange(event) {
    switch (mode) {
        case modes.LISTEN :
            listenStateChange(event);
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
            alert('onPlayerStateChange() unhandled ' + mode);
        }
    }
}

var mode = modes.LISTEN;


/* LISTEN */

$('#button-listen').click(function () {
    mode = modes.LISTEN;
    $('.control-button').hide();

    player.seekTo(0, true);
    listenPlay();
    var audioNow = document.getElementById('audio-now');
    studyStop(audioNow);
});


function listenPlay() {
    mode = modes.LISTEN;
    $('#msg1').text('Listen');
    $('#msg2').text('');
    $('#cover').css('opacity', '0');

    player.playVideo();
}

var listenCount = 0;

function listenStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        var $cover = $('#cover');

        $('#msg1').text('Listen');
        $('#msg2').text('Click to countinue');
        $cover.css('opacity', '1');
        if (mode === modes.LISTEN) {
            $cover.click(function () {
                listenPlay();
            });
        } else {
            player.pauseVideo();
        }
        listenCount++;
    }
    $('#listen-counter').text(listenCount);
}


/* STUDY */

$('#button-study').click(function () {
    var $prevButton = $('#prev-button');

    mode = modes.STUDY;
    resizeVideo();
    player.pauseVideo();
    player.seekTo(0, true);

    $('#cover').css('opacity', '1');
    $prevButton.css('visibility', 'visible');
    $prevButton.css('margin-top', '349px');
    $('#skip-button').css('visibility', 'visible');
    $('#msg1').text('Study');
    $('#msg2').text('');

    studyStart();
});


function studyStart() {
    if (mode === modes.STUDY) {
        studyStep();
        // study_opac(step);
    }
}

var currentStep;

function studyStep(step) {
    console.log('studystep : ' + currentStep);
    currentStep = step;
    if (!currentStep) {
        currentStep = 0;
    } else if (currentStep === SCRIPT.length) {
        currentStep = 0;
    }

    studyInit(currentStep);
}

/* function studyOpacity(step) {
    stepLevel = step - step + 1;
} */

function studyInit(step) {
    mode = modes.STUDY;
    var $audio = $('#audio');
    var $msg1 = $('#msg1');
    if ($audio.children().length > 0) {
        $audio.empty();
    }
    $audio.append(
        '<audio id="audio-now">' +
            '<source src="audio/' + SCRIPT[step].audio + '" type="audio/ogg">' +
        '</audio>');

    var audioNow = document.getElementById('audio-now');
    $msg1.text(SCRIPT[step].words);

    if (!opaStep) { opaStep = 2; }
    studyPlay(audioNow, opaStep, step);
}
var opaStep;
function studyPlay(audioNow, opaS, step) {
    opaStep = opaS;
    if (opaStep < 8) {
        audioNow.play();
        opaStep++;
    } else if (opaStep >= 8) {
        opaStep = 1;
        console.log('studyplay : ' + step);
        nextStep(step);
    }
}

function nextStep(step) {
    currentStep = step;
    currentStep++;
    studyStep(currentStep);
}
function studyStop(audioNow) {
    $('#msg1').text('');
    audioNow.pause();
}


$('#marker').hide();
resizeVideo();
