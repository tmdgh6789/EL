/* STOPWATCH */

var timerRunning = false;
var clockTimer;
var $time;
var S;
var MS;

var	ClsStopwatch = function() {
    var startAt = 0;
    var lapTime = 0;

    var now = function () {
        return (new Date()).getTime();
    };

    this.start = function() {
        timerRunning = true;
        startAt	= startAt ? startAt : now();
    };

    this.stop = function() {
        lapTime	= startAt ? lapTime + now() - startAt : lapTime;
        startAt	= 0;
    };

    this.reset = function() {
        lapTime = startAt = 0;
    };

    this.time = function() {
        return lapTime + (startAt ? now() - startAt : 0);
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
