/* global $, YT */

var mode;

var modes = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };

var states;

var study = { COVER: 1, PLAY: 2, PLAY_AUDIO: 3 };

var SCRIPT = [
    { from: 1.9, to: 2.3, words: 'chick', audio: 'chick.ogg', level: 1.0 },
    { from: 5.5, to: 5.8, words: 'gay', audio: 'gay.ogg', level: 1.1 },
    { from: 8.0, to: 8.7, words: 'short man', audio: 'short_man.ogg', level: 1.5 },
    { from: 10.4, to: 11.1, words: 'cute car', audio: 'cute_car.ogg', level: 1.5 },
    { from: 11.9, to: 12.7, words: 'slow car', audio: 'slow_car.ogg', level: 1.5 },
    { from: 13.0, to: 15.1, words: 'single young professional', audio: 'single_young_professional.ogg', level: 1.7 },
    { from: 16.5, to: 17.4, words: 'street cred', audio: 'street_cred.ogg', level: 3.0 },
    { from: 17.7, to: 18.9, words: "ain't", audio: 'aint.ogg', level: 3.0 },
    { from: 17.7, to: 18.9, words: 'hip hop', audio: 'hip_hop.ogg', level: 1.0 },
    { from: 19.1, to: 19.6, words: 'kidless', audio: 'kidless.ogg', level: 1.4 },
    { from: 19.9, to: 20.3, words: 'cute', audio: 'cute.ogg', level: 1.0 },
    { from: 20.5, to: 21.2, words: 'small', audio: 'small.ogg', level: 1.0 },
    { from: 22.4, to: 23.1, words: "doesn't care", audio: 'doesnt_care.ogg', level: 1.5 },
    { from: 23.2, to: 24.4, words: 'what you call it', audio: 'what_you_call_it.ogg', level: 2.0 }
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
        // videoId: 'Pf4A1Sl_OkI',
        // videoId: 'S0s2J4m5ITg',
        videoId: 'D5UToOanKPQ',
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

$('#cover').click(function () {
    var $audioNow = $('#audio-now');
    var $audio = $('#audio');
    if (mode === modes.LISTEN) {
        studyStop($audioNow);
        listenPlay();
    } else if (mode === modes.STUDY && states === study.COVER) {
        if (!$audio.children().length > 0) {
            studyStop($audioNow);
        }
        $('#mode-des').text('');
        studyStep();
    }
});

/* LISTEN */

$('#button-listen').click(function () {
    mode = modes.LISTEN;
    resizeVideo();
    $('.control-button').css('visibility', 'hidden');
    $('.study-mode').css('visibility', 'hidden');

    listenStop();
    listenPlay();
    var audioNow = $('#audio-now');
    studyStop(audioNow);
});


function listenPlay() {
    mode = modes.LISTEN;
    $('#mode-title').text('Listen');
    $('#mode-des').text('');
    $('#cover').css('opacity', '0');

    player.playVideo();
}

var listenCount = 0;

function listenStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        var $cover = $('#cover');

        $('#mode-title').text('Listen');
        $('#mode-des').text('Click to continue');
        $('#msg-study').text('');
        $cover.css('opacity', '1');

        listenCount++;
    }
    $('#listen-counter').text(listenCount);
}

function listenStop() {
    player.seekTo(0, true);
    player.pauseVideo();
}

/* STUDY */

var currentStep;
var opacityStep;

$('#button-study').click(function () {
    $('#time-order').css('visibility', 'visible');
    $('#level-order').css('visibility', 'visible');
    studyClick();
});

function studyClick() {
    mode = modes.STUDY;
    states = study.PLAY;
    resizeVideo();
    player.pauseVideo();
    player.seekTo(0, true);
    currentStep = 0;
    opacityStep = 0;

    $('#cover').css('opacity', '1');
    $('#prev-button').css('margin-top', '349px');
    $('.control-button').css('visibility', 'visible');
    $('#mode-title').text('Study');
    $('#mode-des').text('');

    if ($('#audio').children().length) {
        var audioNow = $('#audio-now');
        studyStop(audioNow);
    }

    studyStep();
}

function studyStep() {
    if (!currentStep) {
        currentStep = 0;
    } else if (currentStep === SCRIPT.length) {
        currentStep = 0;
    }

    studyPlay();
}

function studyPlay() {
    if (mode === modes.STUDY) {
        mode = modes.STUDY;
        states = study.PLAY_AUDIO;
        $('#mode-title').text('');
        var $audio = $('#audio');
        var $msgStudy = $('#msg-study');
        if (opacityStep < 7 || !opacityStep) {
            $audio.empty();
            $audio.append(
                '<audio id="audio-now" onended="timedCount()">' +
                '<source src="audio/' + SCRIPT[currentStep].audio + '" type="audio/ogg">' +
                '</audio>');
            var audioNow = document.getElementById('audio-now');
            $msgStudy.text(SCRIPT[currentStep].words);
        }

        if (!opacityStep) {
            opacityStep = 0;
        }

        if (opacityStep < 6) {
            if (opacityStep < 2) {
                $msgStudy.css('opacity', 0);
                audioNow.play();
            } else {
                var o = (1 / (8 - (opacityStep * 1.5))) + opacityStep * 0.1;
                $msgStudy.css('opacity', o);
                audioNow.play();
            }
            opacityStep++;
            if (opacityStep > 5) {
                opacityStep = 0;
                currentStep++;
            }
        }
    }
}

function timedCount() {
    if (states === study.PLAY_AUDIO) {
        setTimeout(function () {
            audioOnEnded();
        }, 1000);
    }
}
function audioOnEnded() {
    if (currentStep < SCRIPT.length) {
        studyPlay();
    } else {
        $('#mode-title').text('Study');
        $('#mode-des').text('Click to continue');
        $('#msg-study').text('');
        states = study.COVER;
    }
}

$('#prev-button').click(function () {
    if (currentStep > 0) {
        currentStep--;
    } else if (currentStep === 0) {
        currentStep = SCRIPT.length - 1;
    }
    opacityStep = 0;
    studyStep();
});

$('#skip-button').click(function () {
    if (currentStep < SCRIPT.length) {
        currentStep++;
    } else if (currentStep === SCRIPT.length) {
        currentStep = 0;
    }
    opacityStep = 0;
    studyStep();
});

$('#level-order').click(function () {
    SCRIPT.sort(function (a, b) {
        if (a.level < b.level) {
            return -1;
        } else if (a.level > b.level) {
            return 1;
        }
        return -1;
    });

    for (var i = 0; i < SCRIPT.length; i++) {
        console.log(SCRIPT[i].words + ' ' + SCRIPT[i].level );
    }
    console.log('\n');

    var audioNow = $('#audio-now');
    studyStop(audioNow);
    studyClick();
});

$('#time-order').click(function () {
    SCRIPT.sort(function (a, b) {
        if (a.from < b.from) {
            return -1;
        } else if (a.from > b.from) {
            return 1;
        }
        return 0;
    });

    for (var i = 0; i < SCRIPT.length; i++) {
        console.log(SCRIPT[i].words + ' ' + SCRIPT[i].level );
    }

    console.log('\n');
    var audioNow = $('#audio-now');
    studyStop(audioNow);
    studyClick();
});

function studyStop(audioNow) {
    $('#mode-title').text('');
    currentStep = 0;
    opacityStep = 0;
    if (!audioNow) {
        audioNow.pause();
    }
}


$('#marker').hide();
resizeVideo();
