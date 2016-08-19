/* global $, YT */

var mode;

var modes = { LISTEN: 1, MARK: 2, STUDY: 3, MARKED: 4 };

var markMode;
var markModes = { COVER: 0, PLAY: 1, PAUSE: 2, STOP: 3 };

var markedMode;
var markedModes = { LISTEN: 0, REPEAT: 1 };

var studyMode;
var studyModes = { COVER: 0, PLAY: 1, PLAY_AUDIO: 2 };

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

// TODO https://github.com/axisj/axisj/wiki/AXISJ-JSDOC-%EC%9E%91%EC%84%B1%EB%B2%95 참고하여 jsdoc 작성

/**
 * @description 유투브 iframe 이 준비 되었을 때 호출되는 콜백 함수
 * @see https://developers.google.com/youtube/iframe_api_reference?hl=ko#Requirements
 */
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

/**
 * @descriptions 테스트
 * @param event {Object} YT.Player 개체
 */
// noinspection JSUnusedLocalSymbols
function onPlayerReady(event) {
    resizeVideo();
    listenPlay();
}


/* eslint-disable */
/**
 * @description 비디오 크기 조정하는 함수
 */
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

/* eslint-disable */
/**
 * @description 플레이어의 상태가 변했을 때 호출되는 함수
 * @param event {Object} YT.Player 개체
 */
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

/**
 * @description actionClock의 setTimeout
 */
var clock;

/* eslint-disable */
/**
 * @description actionClock의 함수들을 반복되게 해주는 함수를 시작하는 함수
 */
function clockStart() {
    clock = setTimeout(actionClock, 0);
}
/* eslint-disable */
/**
 * @description actionClock의 함수들을 반복되게 해주는 함수를 멈추는 함수
 */
function clockStop() {
    if (clock !== null) clearTimeout(clock);
    clock = null;
}

/* eslint-disable */
/**
 * @description actionClock의 함수들을 반복되게 해주는 함수를 다시 시작하는 함수
 */
function clockRestart() {
    clockStop();
    clockStart();
}

/* eslint-disable */
/**
 * @description markedNext 함수를 반복되게 해주는 함수
 */
function actionMarkedClock() {
    clockStop();
    clock = setInterval(markedNext, 1);
}

/* eslint-disable */
/**
 * actionClock의 함수들을 반복되게 해주는 함수
 */
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

/**
 * @description cover 클릭 시 실행되는 함수
 */
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
            if (!markedDown.length) {
                alert('Please press the button after mark');
                markStop();
                markStart();
            } else {
                markedStart();
            }
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

/**
 * @description 비디오를 재생한 회수를 저장하는 변수
 * @type {number}
 */
var listenCount = 0;

/**
 * @description Listen 버튼 클릭 시 호출되는 함수
 */
$('#button-listen').click(function () {
    mode = modes.LISTEN;
    resizeVideo();
    $('.control-button').css('visibility', 'hidden');
    $('.study-mode').css('visibility', 'hidden');
    $('#marker').hide();

    listenStop();
    markStop();
    markedStop();
    studyStop();
    listenPlay();
});

/* eslint-disable */
/**
 * @description Listen mode 를 시작하는 함수
 */
function listenPlay() {
    mode = modes.LISTEN;
    $('#mode-title').text('Listen');
    $('#mode-des').text('');
    $('#cover').css('opacity', '0');

    player.playVideo();
}

/* eslint-disable */
/**
 * @description Listen mode 에서 비디오의 상태가 변했을때 호출되는 함수
 * @param event {Object} YT.Player 개체
 */
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

/* eslint-disable */
/**
 * Listen mode 를 멈추는 함수
 */
function listenStop() {
    player.seekTo(0, true);
    player.pauseVideo();
}


/* MARK */

/**
 * @description mark-button 을  mousedown 했을 때의 시간을 저장하는 배열
 * @type {Array}
 */
var markedDown = [];
/**
 * @description mark-button 을 mouseup 했을 때의 시간을 저장하는 배열
 * @type {Array}
 */
var markedUp = [];

/**
 * @description mark 버튼을 클릭 시 호출되는 함수
 */
$('#button-mark').click(function () {
    listenStop();
    markStop();
    markedStop();
    studyStop();
    resizeVideo();
    markStart();
});

/**
 * @description mark mode 를 초기화 함수
 */
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

/**
 * @description mark mode 의 비디오 재생하는 함수
 */
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

/**
 * @description mark mode 를 멈추는 함수
 */
function markStop() {
    stopWatchStop();
    markPosition = 0;
    player.pauseVideo();
    $('#marker').hide();
    $('#cover').show();
}

/**
 * @description startTime: mark mode 시작 시작, playerStartTime: 플레이어 시작 시간, countDown: 플레이어가 시작 될 카운트, mouseDown: markbar mouseDown 여부
 * @type {{startTime: number, playerStartTime: number, countDown: number, mouseDown: number}}
 */
var mark = { startTime: 0, playerStartTime: 1, countDown: 2, mouseDown: 3 };
/**
 * @description mark-position 위치 저장 변수
 */
var markPosition;
/**
 * @description mark mode 가 시작되거나 mark-positon 의 위치를 조정하는 함수
 */
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

/**
 * @description mark mode 에서 플레이어의 상태가 변했을 때 호출되는 함수
 * @param event {Object} YT.Player 개체
 */
function markStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        stopWatchStop();

        $('#mode-title').text('Mark');
        $('#mode-des').text('Click to continue');
        $('#msg-study').text('');
        $('#cover').css('opacity', '1');
    }
}

/* MARKBAR */

var $markButton = $('#mark-button');
/**
 * @description mark 된 횟수
 * @type {number}
 */
var totalCount = 0;
/**
 * @description mark 했을 때의 stopwatch 시간
 * @type {Array}
 */
var markedLapTime = [];
/**
 * @description mark-button 을 mousedown 했을 때 이벤트
 */
$markButton.mousedown(function () {
    if (mode === modes.MARK) {
        var s = S;
        var ms = MS / 1000;
        markedDown[totalCount] = (s + ms) - 0.2;
        markedLapTime[totalCount] = startAt ? lapTime + x.now() - startAt : lapTime;
        mark.mouseDown = 'down';
    } else {
        markStop();
        markStart();
    }
});

/**
 * @description markbar 를 mouseup 했을 때 이벤트
 */
$markButton.mouseup(function () {
    if (mark.mouseDown === 'down') {
        var s = S;
        var ms = MS / 1000;
        markedUp[totalCount] = s + ms;
        mark.mouseDown = 'up';
        totalCount++;
    }
});

/**
 * @description clear-button 을 클릭했을 때 이벤트
 */
$('#clear-button').click(function () {
    markedClear();
    markbarInit();
    markbarDraw();
});

/**
 * @description mark 한 것들을 없애는 함수
 */
function markedClear() {
    for ( var i = 0; i < totalCount; i++) {
        markedDown.pop();
        markedUp.pop();
        section.pop();
    }
    playCount = 0;
    totalCount = 0;
}

/**
 * @description markbar 의  배열
 * @type {Array}
 */
var markbarStatus = [];
/**
 * @description markbar 를 미리 충분히 만들어 놓는  함수
 */
function markbarInit() {
    for (var i = 0; i < 2000; i++) markbarStatus[i] = 'up';
}

/**
 * @description 플레이어의 전체 재셍 시간
 */
var playerDuration;

/**
 * @description markbar 를 재생 시간에 맞게 만드는 함수
 */
function markbarDraw() {
    if (player === null) return;

    var $markbar = $('#markbar');
    var total = 0;
    if (player) {
        var duration = player.getDuration();
    }
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

/**
 * @description markbar 길이 계산 함수
 * @param i
 */
function markbarPosition(i) {
    var screenWidth = $('#player').width();
    var markbarWidth = screenWidth - (12 + 12);
    // noinspection UnnecessaryLocalVariableJS
    var ntn = i;
    return Math.round(ntn * (markbarWidth / playerDuration));
}

/* MARKED */

/**
 * @description listen-button 클릭 이벤트 (mark 한 부분 한번 재생)
 */
$('#listen-button').click(function () {
    mode = modes.MARKED;
    markedMode = markedModes.LISTEN;
    if (!markedDown.length) {
        alert('Please press the button after mark');
        markStop();
        markStart();
    } else {
        markedStart();
    }
});

/**
 * @description repeat-button 클릭 이벤트 (mark 한 부분 다섯번 재생)
 */
$('#repeat-button').click(function () {
    mode = modes.MARKED;
    markedMode = markedModes.REPEAT;
    if (!markedDown.length) {
        alert('Please press the button after mark');
        markStop();
        markStart();
    } else {
        markedStart();
    }
});

/**
 * @description marked mode 에서 플레이어의 상태가 변했을 때 호출되는 함수
 * @param event {Object} YT.Player 개체
 */
function markedStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        stopWatchStop();

        $('#mode-title').text('Marked');
        $('#mode-des').text('Click to continue');
        $('#msg-study').text('');
        $('#cover').css('opacity', '1');
    } else if (event.data === YT.PlayerState.PAUSED) {
        stopWatchStop();

        $('#mode-title').text('Marked');
        $('#mode-des').text('Click to continue');
        $('#msg-study').text('');
        $('#cover').css('opacity', '1');
    }
}

/**
 * @description 재생 회수 카운트
 * @type {number}
 */
var playCount = 0;
/**
 * @description mark 한 부분 재생 시작하는 함수
 */
function markedStart() {
    $('#mode-title').text('Mark');
    $('#mode-des').text('');
    $('#msg-study').text('');
    var markButton = $('#mark-button');
    markButton.text('continue to mark');
    markButton.attr('class', 'mark-button-continue');

    $('#cover').css('opacity', '0');

    var startPc = playCount - (totalCount * repeatCount);
    var pc = startPc > totalCount - 1 ? 0 : playCount - (totalCount * repeatCount);

    player.seekTo(markedDown[pc], true);
    stopWatchStop();
    lapTime = markedLapTime[pc];
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

/**
 * @description 재생 반복 카운트
 * @type {number}
 */
var repeatCount = 0;
/**
 * @description 재생할 구간 배열
 * @type {Array}
 */
var section = [];

/**
 * @description 처음 mark 한 부분의 재생이 끝나면 다음 부분을 재생하게 하는 함수
 */
function markedNext() {
    var currentTime = (startAt ? x.now() - startAt : 0) / 1000;
    section[playCount] = markedUp[playCount] - markedDown[playCount];
    var timeDiff = startAt - new Date();
    var playerTime = (lapTime - timeDiff) / 1000;
    var id = Math.floor(playerTime * 20);

    if (id < playerDuration) {
        var to = markbarPosition(id);
        var from = markbarPosition(id + 1);
        var pos = from + (from - to) / 2;
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
            var pc = playCount - (totalCount * repeatCount);
            if (playCount < totalCount * 5) {
                if (currentTime >= section[pc]) {
                    stopWatchStop();
                    clockStop();
                    playCount++;
                    markedStart();
                }
                if (playCount === totalCount * (repeatCount + 1)) {
                    repeatCount++;
                }
            } else if (playCount === totalCount * 5) {
                playCount = 0;
                repeatCount = 0;
                clockStop();
                stopWatchStop();
                player.pauseVideo();
            }
            break;
        default :
            break;
    }
}

/**
 * @description marked mode 를 멈추는 함수
 */
function markedStop() {
    markedClear();
    markbarInit();
    markbarDraw();
    clockStop();
    stopWatchStop();
    player.pauseVideo();
    player.seekTo(0, true);
    repeatCount = 0;
}

/* STUDY */

/**
 * @description 현재 재생되고 있는 단어의 순서
 */
var currentStep;
/**
 * @description 현재 재생되고 있는 단어의 투명도 단계
 */
var opacityStep;
/**
 * @description Study 버튼 클릭 이벤트
 */
$('#button-study').click(function () {
    listenStop();
    markStop();
    studyStop();
    studyStart();
});

/**
 * @description study mode 를 초기화하는 함수
 */
function studyStart() {
    mode = modes.STUDY;
    studyMode = studyModes.PLAY;
    resizeVideo();
    player.pauseVideo();
    player.seekTo(0, true);
    currentStep = 0;
    opacityStep = 0;

    $('#marker').hide();
    $('.study-mode').css('visibility', 'visible');
    $('#cover').css('opacity', '1');
    $('.control-button').css('visibility', 'visible');
    $('#mode-title').text('Study');
    $('#mode-des').text('');

    studyStop();
    studyStep();
}

/**
 * @description currentStep 을 초기화 해주는 함수
 */
function studyStep() {
    if (!currentStep) {
        currentStep = 0;
    } else if (currentStep === SCRIPT.length) {
        currentStep = 0;
    }

    studyPlay();
}

/**
 * @description study mode 를 시작하는 함수
 */
function studyPlay() {
    if (mode === modes.STUDY) {
        mode = modes.STUDY;
        studyMode = studyModes.PLAY_AUDIO;
        $('#mode-title').text('');
        var $audio = $('#audio');
        console.log('currentStep2 : ' + currentStep);
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
            if (markedStudy === 'off') {
                currentStep++;
            } else {
                markedStudyPlay();
            }
        }
    }
}

/**
 * @description 단어의 투명도를 설정해주는 함수
 */
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

/**
 *  @description study mode 의 setTimeout
 */
var studyClock;
function timeCount() {
    if (studyMode === studyModes.PLAY_AUDIO) {
        studyClock = setTimeout(audioOnEnded, 1200);
    }
}

/**
 * @description timeCount 가 실행이 되면 호출되는 함수 (오디오가 멈추는 조건)
 */
function audioOnEnded() {
    if (currentStep < SCRIPT.length) {
        if (markedStudy === 'on') {
            if (opacityStep > 5) {
                studyStop();
            }
        }
        studyPlay();
    } else {
        $('#mode-title').text('Study');
        $('#mode-des').text('Click to continue');
        $('#msg-study').text('');
        studyMode = studyModes.COVER;
    }
}

/**
 * @description prev-button 클릭 이벤트 (전 단계의 단어로 이동)
 */
$('#prev-button').click(function () {
    $('#mode-des').text('');
    if (currentStep > 0) {
        currentStep--;
    } else if (currentStep === 0) {
        currentStep = SCRIPT.length - 1;
    }
    opacityStep = 0;
    clearTimeout(studyClock);
    studyStep();
});

/**
 * @description skip-button 클릭 이벤트 (다음 단계의 단어로 이동)
 */
$('#skip-button').click(function () {
    $('#mode-des').text('');
    if (currentStep < SCRIPT.length) {
        currentStep++;
    } else if (currentStep === SCRIPT.length) {
        currentStep = 0;
    }
    opacityStep = 0;
    clearTimeout(studyClock);
    studyStep();
});

/**
 * @description level-order 클릭 이벤트 (SCRIPT 의 단어들을 level 순으로 재정렬)
 */
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

/**
 * @description time-order 클릭 이벤트 (SCRIPT 의 단어들을 재생순으로 재정렬)
 */
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

/**
 * @description markedStudy mode 의 on, off 여부
 */
var markedStudy = 'off';
/**
 * @description SCRIPT 의 순서를 저장
 * @type {number}
 */
var scriptStep = 0;

/**
 * @description marked-study 클릭 이벤트 (markedStudy 초기화)
 */
$('#marked-study').click(function () {
    markedStudy = 'off';
    $('#mode-title').text('');
    $('#audio').empty();
    clearTimeout(studyClock);
    opacityStep = 0;
    markedStudyPlay();
});

/**
 * @description marked study 시작하는 함수
 */
function markedStudyPlay() {
    if (markedDown.length) {
        for (scriptStep; scriptStep < SCRIPT.length; scriptStep++) {
            for (var ps = 0; ps < totalCount; ps++) {
                if (SCRIPT[scriptStep].from - 0.3 < markedDown[ps] && SCRIPT[scriptStep].to + 0.3 > markedDown[ps]) {
                    markedStudy = 'on';
                    currentStep = scriptStep;
                    console.log('currentStep1 : ' + currentStep);
                    break;
                }
            }
            if (markedStudy === 'on') {
                break;
            }
        }
        studyPlay();
    } else {
        alert('Please press the button after mark');
    }
}

/**
 * @description study mode 를 멈추는 함수
 */
function studyStop() {
    $('#mode-title').text('');
    clearTimeout(studyClock);
    currentStep = 0;
    opacityStep = 0;
    scriptStep = 0;
    markedStudy = 'off';
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
