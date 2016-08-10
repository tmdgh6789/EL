/* global $, YT */

var mode;

var modes = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };

var markMode;
var markModes = { COVER: 0, PLAY: 1, PAUSE: 2, STOP: 3 };

var markedMode;
var markedModes = { LISTEN: 0, REPEAT: 1 };

var studyMode;
var studyModes = { COVER: 1, PLAY: 2, PLAY_AUDIO: 3 };

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
    markbarDraw();
    $('#mark-button').css('width', width);
}

function onPlayerStateChange(event) {
    switch (mode) {
        case modes.LISTEN :
            listenStateChange(event);
            break;
        case modes.MARK :
            markStateChange(event);
            break;
        case modes.STUDY :
            studyStart(event);
            break;
        case modes.MARKED :
            markedStateChange(event);
            break;
        default : {
            alert('onPlayerStateChange() unhandled ' + mode);
        }
    }
}

/* CLOCK */

var clock;

function clockStart() {
    clock = setTimeout(actionClock, 0);
}

function clockStop() {
    if (clock !== null) clearTimeout(clock);
    clock = null;
}

function clockRestart() {
    clockStop();
    clockStart();
}

function actionMarkedClock() {
    clockStop();
    clock = setInterval(markedNext, 1);
}

function actionClock() {
    clock = setTimeout(actionClock, 0);

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
            // markedNext();
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
            markStart();
            break;
        case modes.MARKED :
            break;
        case modes.STUDY :
            if (studyMode === studyModes.COVER) {
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

var markedDown = [];
var markedUp = [];

$('#button-mark').click(function () {
    markStop();
    listenStop();
    studyStop();
    resizeVideo();
    markStart();
});


function markStart() {
    mode = modes.MARK;
    markMode = markModes.COVER;
    mark.countDown = 10;
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
    $('#cover').css('opacity', '0');
    mark.startTime = new Date();
    mark.playerStartTime = 0;

    if (timerRunning) {
        stopWatchReset();
    }
    stopWatchShow();
    stopWatchStart();

    player.seekTo(0, true);
    player.playVideo();
    markMode = markModes.PLAY;
}

function markStop() {
    markPosition = 0;
    player.pauseVideo();
    $('#marker').hide();
    $('#cover').show();
}

var mark = { startTime: 0, playerStartTime: 1, countDown: 2, mouseDown: 3 };
var markPosition;
function markClock() {
    switch (markMode) {
        case markModes.COVER :
            mark.countDown--;
            if (mark.countDown <= 0) markPlay();
            break;
        case markModes.PLAY :
            var timeDiff = new Date() - mark.startTime;
            var playerTime = mark.playerStartTime + (timeDiff / 1000);
            var id = Math.floor(playerTime * 20);

            if (mark.mouseDown === 'down') {
                markbarStatus[id] = 'down';
                var key = '#mark-' + (id + 1);
                $(key).attr('class', 'mark-down');
            }

            if (id < playerDuration) {
                var from = markbarPosition(id);
                var to = markbarPosition(id + 1);
                var pos = from + (to - from) / 2;
                $('#mark-position').css('margin-left', pos + 7 + 'px');
            } else if (id >= playerDuration) {
                clockStop();
                console.log('invalid id ' + id);
            }
            break;
        default :
            alert('mark_clock() unhandled state ');
            break;
    }
}

function markStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        // stopWatchStop();

        var $cover = $('#cover');

        $('#mode-title').text('Mark');
        $('#mode-des').text('Click to continue');
        $('#msg-study').text('');
        $cover.css('opacity', '1');
    }
    $('#listen-counter').text(listenCount);
}

/* MARKBAR */

var $markButton = $('#mark-button');

var totalCount = 0;
var markedLapTime = [];
$markButton.mousedown(function () {
    var s = S;
    var ms = MS / 1000;
    markedDown[totalCount] = (s + ms) - 0.2;
    markedLapTime[totalCount] = startAt ? lapTime + x.now() - startAt : lapTime;
    mark.mouseDown = 'down';
});

$markButton.mouseup(function () {
    var s = S;
    var ms = MS / 1000;
    markedUp[totalCount] = s + ms;
    mark.mouseDown = 'up';
    totalCount++;
});

$('#clear-button').click(function () {
    markedClear();
    markbarInit();
    markbarDraw();
});

function markedClear() {
    for ( var i = 0; i < totalCount; i++) {
        markedDown.pop();
        markedUp.pop();
        section.pop();
    }
    playCount = 0;
    totalCount = 0;
}

var markbarStatus = [];
function markbarInit() {
    for (var i = 0; i < 2000; i++) markbarStatus[i] = 'up';
}

var playerDuration;

function markbarDraw() {
    if (player === null) return;

    var $markbar = $('#markbar');
    var total = 0;
    var duration = player.getDuration();
    playerDuration = Math.ceil(duration * 20);

    $markbar.empty();
    for (var i = 0; i < playerDuration; i++) {
        var from = markbarPosition(i);
        var to = markbarPosition(i + 1);
        var eachWidth = to - from;
        total += eachWidth;
        $markbar.append('<div id="mark-' + (i + 1) + '" class="mark-' + markbarStatus[i] + '" style="width: ' + eachWidth + 'px;"></div>');
    }
}

function markbarPosition(i) {
    var screenWidth = $('#player').width();
    var markbarWidth = screenWidth - (12 + 12);
    // noinspection UnnecessaryLocalVariableJS
    var ntn = i;
    return Math.round(ntn * (markbarWidth / playerDuration));
}

/* MARKED */

$('#listen-button').click(function () {
    mode = modes.MARKED;
    markedMode = markedModes.LISTEN;
    markedStart();
});

$('#repeat-button').click(function () {
    mode = modes.MARKED;
    markedMode = markedModes.REPEAT;
    markedStart();
});

function markedStateChange(event) {
    if (event.data === YT.PlayerState. ENDED) {
        stopWatchStop();
    }
}

var playCount = 0;
function markedStart() {
    $('#mode-title').text('Mark');
    $('#mode-des').text('');
    $('#msg-study').text('');

    $('#cover').css('opacity', '0');

    player.seekTo(markedDown[playCount], true);
    stopWatchStop();
    lapTime = markedLapTime[playCount];
    $time = document.getElementById('time');
    $time.innerHTML = formatTime(lapTime);
    stopWatchStart();
    player.playVideo();

    switch (markedMode) {
        case markedModes.LISTEN :
            actionMarkedClock();
            break;
        case markedModes.REPEAT :
            actionMarkedClock();
            break;
        default :
            break;
    }
}

var section = [];
function markedNext() {
    var currentTime = (x.now() - startAt) / 1000;
    section[playCount] = markedUp[playCount] - markedDown[playCount];
    var i = 0;

    var timeDiff = new Date() - startAt;
    var playerTime = timeDiff / 1000;
    var id = Math.floor(playerTime * 20);

    if (id < playerDuration) {
        var from = markbarPosition(id);
        var to = markbarPosition(id + 1);
        var pos = from + (to - from) / 2;
        $('#mark-position').css('margin-left', pos + 7 + 'px');
    } else if (id >= playerDuration) {
        clockStop();
        console.log('invalid id ' + id);
    }

    switch (markedMode) {
        case markedModes.LISTEN :
            if (playCount < totalCount) {
                if (currentTime >= section[playCount]) {
                    stopWatchStop();
                    clockStop();
                    playCount++;
                    markedStart();
                }
            } else if (playCount === totalCount) {
                playCount = 0;
                clockStop();
                stopWatchStop();
                player.pauseVideo();
            }
            break;
        case markedModes.REPEAT :
            var pc = playCount - (totalCount * i);
            if (playCount < totalCount * 5) {
                if (pc < 0 ) {
                    pc = 0;
                }
                if (currentTime >= section[pc]) {
                    console.log(section[pc]);
                    console.log(playCount);
                    stopWatchStop();
                    clockStop();
                    playCount++;
                    markedStart();
                }
                if (playCount === totalCount * i) {
                    i++;
                }
            } else if (playCount === totalCount * 5) {
                playCount = 0;
                clockStop();
                stopWatchStop();
                player.pauseVideo();
            }
            break;
        default :
            break;
    }
}

/* STUDY */

var currentStep;
var opacityStep;
$('#button-study').click(function () {
    studyStop();
    listenStop();
    markStop();
    studyStart();
});

function studyStart() {
    mode = modes.STUDY;
    studyMode = studyModes.PLAY;
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
        studyMode = studyModes.PLAY_AUDIO;
        $('#mode-title').text('');
        var $audio = $('#audio');
        if (opacityStep < 7 || !opacityStep) {
            $audio.empty();
            $audio.append(
                '<audio id="audio-now" onended="timeCount()">' +
                '<source src="audio/' + SCRIPT[currentStep].audio + '" type="audio/ogg">' +
                '</audio>');
            var audioNow = document.getElementById('audio-now');
            $('#msg-study').text(SCRIPT[currentStep].words);
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
    if (studyMode === studyModes.PLAY_AUDIO) {
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
        studyMode = studyModes.COVER;
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
    studyStart();
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
    studyStart();
});

function studyStop() {
    $('#mode-title').text('');
    currentStep = 0;
    opacityStep = 0;
    $('#audio').empty();
}


/* STOPWATCH */

var timerRunning = false;
var clockTimer;
var $time;
var S;
var MS;
var startAt = 0;
var lapTime = 0;

var	ClsStopwatch = function() {
    this.now = function () {
        return (new Date()).getTime();
    };

    this.start = function() {
        timerRunning = true;
        startAt	= startAt ? startAt : x.now();
    };

    this.stop = function() {
        lapTime	= startAt ? lapTime + x.now() - startAt : lapTime;
        startAt	= 0;
    };

    this.reset = function() {
        lapTime = startAt = 0;
    };

    this.time = function() {
        return lapTime + (startAt ? x.now() - startAt : 0);
    };
};
var x = new ClsStopwatch();

function pad(num, size) {
    var s = '0000' + num;
    return s.substr(s.length - size);
}

function formatTime(time) {
    var tt = time;


    S = Math.floor( tt / 1000 );
    MS = tt % 1000;

    return pad(S, 4) + ':' + pad(MS, 3);
}

function stopWatchShow() {
    $time = document.getElementById('time');
    stopWatchUpdate();
}

function stopWatchUpdate() {
    $time.innerHTML = formatTime(x.time());
}

function stopWatchStart() {
    clockTimer = setInterval(stopWatchUpdate, 1);
    x.start();
}

function stopWatchStop() {
    x.stop();
    clearInterval(clockTimer);
}

function stopWatchReset() {
    stopWatchStop();
    x.reset();
}


$('#marker').hide();
markbarInit();
resizeVideo();
