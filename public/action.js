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
        videoId: 'Pf4A1Sl_OkI',
        // videoId: 'S0s2J4m5ITg',
        // videoId: 'D5UToOanKPQ',
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
            studyStateChange(event);
            break;
        case modes.MARKED :
            // marked_stateChange(event);
            break;
        default : {
            alert('onPlayerStateChange() unhandled ' + mode);
        }
    }
}

/* CLOCK */

var clock;

function clockStart() {
    clock = setTimeout(actionClock, 50);
}

function clockStop() {
    if (clock !== null) clearTimeout(clock);
    clock = null;
}

function clockRestart() {
    clockStop();
    clockStart();
}

function actionClock() {
    clock = setTimeout(actionClock, 50);

    switch (mode) {
        case modes.LISTEN :
            // listen_clock();
            break;
        case modes.MARK :
            markClock();
            break;
        case modes.STUDY :
            // study_clock();
            break;
        case modes.MARKED :
            // marked_clock();
            break;
        default :
            alert('actionClock() unhandled ' + mode);
            break;
    }
}

$('#cover').click(function () {
    var $audio = $('#audio');
    switch (mode) {
        case modes.LISTEN :
            studyStop();
            listenPlay();
            break;
        case modes.MARK :
            break;
        case modes.MARKED :
            break;
        case modes.STUDY :
            if (states === study.COVER) {
                if (!$audio.children().length > 0) {
                    studyStop();
                }
                $('#mode-des').text('');
                studyStep();
            }
            break;
        default :
            alert('COVER CLICK ERROR!');
            break;
    }
});

/* LISTEN */

var listenCount = 0;

$('#button-listen').click(function () {
    mode = modes.LISTEN;
    resizeVideo();
    $('.control-button').css('visibility', 'hidden');
    $('.study-mode').css('visibility', 'hidden');
    $('#marker').hide();

    markStop();
    studyStop();
    listenStop();
    listenPlay();
});


function listenPlay() {
    mode = modes.LISTEN;
    $('#mode-title').text('Listen');
    $('#mode-des').text('');
    $('#cover').css('opacity', '0');

    player.playVideo();
}

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


/* MARK */

var markmode;
var markmodes = { COVER: 0, PLAY: 1, PAUSE: 2, STOP: 3 };

$('#button-mark').click(function () {
    markStop();
    listenStop();
    studyStop();
    resizeVideo();
    markStart();
});

function markStart() {
    mode = modes.MARK;
    markmode = markmodes.COVER;
    mark.countdown = 10;
    $('#mode-title').text('Mark');
    $('#mode-des').text('');
    $('#msg-study').text('');

    $('#cover').css('opacity', '1');
    var $markButton = $('#mark-button');
    $markButton.text('press to mark');
    $markButton.attr('class', 'mark-button-normal');
    $('.control-button').css('visibility', 'hidden');
    $('.study-mode').css('visibility', 'hidden');

    markbarDraw();
    $('#marker').show();
    clockRestart();
}

function markPlay() {
    $('#cover').hide();
    mark.startTime = new Date();
    mark.playerStartTime = 0;

    player.seekTo(0, true);
    player.playVideo();
}


var mark = { startTime: 0, playerStartTime: 1, countdown: 2, mousedown: 3 };

function markClock() {
    switch (markmode) {
        case markmodes.COVER :
            mark.countdown--;
            if (mark.countdown <= 0) markPlay();
            break;
        case markmodes.PLAY :
            var timeDiff = new Date() - mark.startTime;
            var playerTime = mark.playerStartTime + (timeDiff / 1000);
            var id = Math.floor(playerTime * 10);

            if (mark.mousedown === 1) {
                markbarStatus[id] = 1;
                var key = '#mark' + (id + 1);
                $(key).attr('class', 'mark_down');
            }

            if (id < playerDuration) {
                var from = markbarPosition(id);
                var to = markbarPosition(id + 1);
                var pos = from + (to - from) / 2;
                $('#mark-position').css('margin-left', pos + 7 + 'px');
            } else {
                console.log('invalid id ' + id);
            }
            break;
        default :
            alert('mark_clock() unhandled state ');
            break;
    }
}

/* MARKBAR */

var markbarStatus = [];
function markbarInit() {
    for (var i = 0; i < 1000; i++) markbarStatus[i] = 0;
}

var playerDuration;

function markbarDraw() {
    if (player === null) return;


    var $markbar = $('#markbar');
    var total = 0;
    var duration = player.getDuration();
    playerDuration = Math.ceil(duration * 100);

    $markbar.empty();
    for (var i = 0; i < playerDuration; i++) {
        var from = markbarPosition(i);
        var to = markbarPosition(i + 1);
        var eachWidth = to - from;
        total += eachWidth;
        $markbar.append('<div id="mark' + (i + 1) + '" class="mark-' + markbarStatus[i] + '" style="width: ' + eachWidth + 'px;"></div>');
    }
}

function markbarPosition(i) {
    var screenWidth = $('#player').width();
    var markbarWidth = screenWidth - (12 + 12);
    // noinspection UnnecessaryLocalVariableJS
    var ntn = i;
    return Math.round(ntn * (markbarWidth / playerDuration));
}

function markStop() {
    player.pauseVideo();
    $('#marker').hide();
    $('#cover').show();
}
/*
/!* STOPWATCH *!/

var h1 = document.getElementsByTagName('h1')[0];
var start = document.getElementById('start');
var stop = document.getElementById('stop');
var clear = document.getElementById('clear');
var milliseconds = 0;
var seconds = 0;
var minutes = 0;
var t;
var timerRunning = false;

function add() {
    timerRunning = true;
    milliseconds++;
    if (milliseconds >= 600) {
        milliseconds = 0;
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
    }


    h1.textContent = minutes  + ':' + seconds + ':' + milliseconds;

    timer();
}

function timer() {
    t = setTimeout(add, 0);
}

/!* Start button *!/
$('#start').click(function () {
    if (timerRunning) {
        clearTimeout(t);
    }
    timer();
});

/!* Stop button *!/
$('#stop').click(function () {
    clearTimeout(t);
});

/!* Clear button *!/
$('#clear').click(function () {
    h1.textContent = '0:0:0';
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
});
*/


/* STUDY */

var currentStep;
var opacityStep;
$('#button-study').click(function () {
    studyStop();
    listenStop();
    markStop();
    studyStateChange();
});

function studyStateChange() {
    mode = modes.STUDY;
    states = study.PLAY;
    resizeVideo();
    player.pauseVideo();
    player.seekTo(0, true);
    currentStep = 0;
    opacityStep = 0;

    $('#marker').hide();
    $('#time-order').css('visibility', 'visible');
    $('#level-order').css('visibility', 'visible');
    $('#cover').css('opacity', '1');
    $('#prev-button').css('margin-top', '349px');
    $('.control-button').css('visibility', 'visible');
    $('#mode-title').text('Study');
    $('#mode-des').text('');

    studyStop();
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
                '<audio id="audio-now" onended="timeCount()">' +
                '<source src="audio/' + SCRIPT[currentStep].audio + '" type="audio/ogg">' +
                '</audio>');
            var audioNow = document.getElementById('audio-now');
            $msgStudy.text(SCRIPT[currentStep].words);
        }

        opacitySet();

        audioNow.play();

        opacityStep++;

        if (opacityStep > 5) {
            opacityStep = 0;
            currentStep++;
        }
    }
}

function opacitySet() {
    var $msgStudy = $('#msg-study');

    if (!opacityStep) {
        opacityStep = 0;
    }
    if (opacityStep < 6) {
        if (opacityStep < 2) {
            $msgStudy.css('opacity', 0);
        } else {
            var o = (1 / (8 - (opacityStep * 1.5))) + opacityStep * 0.1;
            $msgStudy.css('opacity', o);
        }
    }
}

function timeCount() {
    if (states === study.PLAY_AUDIO) {
        setTimeout(function () {
            audioOnEnded();
        }, 1500);
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
    $('#mode-des').text('');
    if (currentStep > 0) {
        currentStep--;
    } else if (currentStep === 0) {
        currentStep = SCRIPT.length - 1;
    }
    opacityStep = 0;
    studyStep();
});

$('#skip-button').click(function () {
    $('#mode-des').text('');
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

    studyStop();
    studyStateChange();
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

    studyStop();
    studyStateChange();
});

function studyStop() {
    $('#mode-title').text('');
    currentStep = 0;
    opacityStep = 0;
    $('#audio').empty();
}


$('#marker').hide();
markbarInit();
resizeVideo();
