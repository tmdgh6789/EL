
SLICE_IN_SEC = 10                               // granuality of mark
TIMEOUT = 1000 / SLICE_IN_SEC / 2

SCRIPT = [
    { from: 1.9, to: 2.3, words: "chick", audio: "chick.ogg", level:1 },
    { from: 5.5, to: 5.8, words: "gay", audio: "gay.ogg", level:1.1 },
    { from: 8.0, to: 8.7, words: "short man", audio: "short_man.ogg", level:1.5 },
    { from: 10.4, to: 11.1, words: "cute car", audio: "cute_car.ogg", level:1.5 },
    { from: 11.9, to: 12.7, words: "slow car", audio: "slow_car.ogg", level:1.5 },
    { from: 13.0, to: 15.1, words: "single young professional", audio: "single_young_professional.ogg", level:1.7 },
    { from: 16.5, to: 17.4, words: "street cred", audio: "street_cred.ogg", level:3 },
    { from: 17.7, to: 18.9, words: "ain't", audio: "aint.ogg", level:3 },
    { from: 17.7, to: 18.9, words: "hip hop", audio: "hip_hop.ogg", level:1 },
    { from: 19.1, to: 19.6, words: "kidless", audio: "kidless.ogg", level:1.4 },
    { from: 19.9, to: 20.3, words: "cute", audio: "cute.ogg", level:1 },
    { from: 20.5, to: 21.2, words: "small", audio: "small.ogg", level:1 },
    { from: 22.4, to: 23.1, words: "doesn't care", audio: "doesnt_care.ogg", level:1.5 },
    { from: 23.2, to: 24.4, words: "what you call it", audio: "what_you_call_it.ogg", level:2 },
];

STUDY_STEPS = 7;
STUDY_STEP_SHOW_START = 4;

modes = { LISTEN:1, MARK:2, STUDY:3, MARKED:4 };

listen = {}
listen.states = { COVER:1, PLAY:2 };
listen.played = 0;

mark = {}
mark.states = { COVER:1, PLAY:2, PAUSE:3 };
mark.mousedown = 0;

marked = {}
marked.states = { PLAY:1, ENDED:2 };
marked.to_play = 0;

study = {}
study.states = { COVER:1, PLAY:2, PLAY_AUDIO:3 };


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    width = $("#player").width();
    height = width * 0.5625;               // 16:9

    player = new YT.Player('player', {
        width: width,
        height: height,
        videoId: 'Pf4A1Sl_OkI',
        //videoId: 'S0s2J4m5ITg',
        // videoId: 'Y9XqYAzbmTI',
        playerVars: { 'autoplay': 0, 'controls': 1, 'showinfo': 0, 'rel': 0, 'hl':'en' },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function resizeVideo() {
    width = $("#player").width();
    height = width * 0.5625;               // 16:9
    $("#cover").css("height", height);

    // player may not be ready yet
    try {
        player.setSize(width, height);
    }
    catch(err) {
        // ignore
    }

    markbar_draw();
    $("#mark-button").css("width", width);
}

function onPlayerReady(event) {
    //event.target.seekTo(13, false);
    event.target.pauseVideo();
    resizeVideo();
    clock_start();
    listen_start(true);
}

$(window).resize(function() {
    resizeVideo();
});



/* clock */

var clock;

function clock_start() {
    clock = setTimeout(actionClock, TIMEOUT);
}

function clock_stop() {
    if (clock != null) clearTimeout(clock);
    clock = null;
}

function clock_restart() {
    clock_stop();
    clock_start();
}

// this is called every 1 second
function actionClock() {
    clock = setTimeout(actionClock, TIMEOUT);

    switch (mode) {
        case modes.LISTEN :
            listen_clock();
            break;
        case modes.MARK :
            mark_clock();
            break;
        case modes.STUDY :
            study_clock();
            break;
        case modes.MARKED :
            marked_clock();
            break;
        default :
            alert("actionClock() unhandled " + mode);
            break;
    }
}

function onPlayerStateChange(event) {
    switch (mode) {
        case modes.LISTEN :
            listen_stateChange(event);
            break;
        case modes.MARK :
            mark_stateChange(event);
            break;
        case modes.STUDY :
            study_stateChange(event);
            break;
        case modes.MARKED :
            marked_stateChange(event);
            break;
        default :
            alert("onPlayerStateChange() unhandled " + mode);
            break;
    }
}

function mode_stop() {
    switch (mode) {
        case modes.LISTEN :
            listen_stop();
            break;
        case modes.MARK :
            mark_stop();
            break;
        case modes.STUDY :
            study_stop();
            break;
        case modes.MARKED :
            marked_stop();
            break;
        default :
            alert("stop() unhandled " + mode);
            break;
    }
}

/* CLICK */

$("#cover").click(function() {
    switch (mode) {
        case modes.LISTEN :
            listen_cover_click();
            break;
        case modes.MARK :
            break;
        case modes.STUDY :
            break;
        default :
            alert("cover clock() unhandled " + mode);
            break;
    }
});

$("#buttonListen").click(function() {
    mode_stop();
    player.seekTo(0);
    player.playVideo();
    listen_start(true);
});

$("#buttonMark").click(function() {
    mode_stop();
    mark_start();
});

$("#buttonStudy").click(function() {
    mode_stop();
    study_start();
});

$("#control-button").click(function() {
    switch (mode) {
        case modes.LISTEN :
            break;
        case modes.MARK :
            break;
        case modes.STUDY :
            study_control_click();
            break;
        case modes.MARKED :
            break;
        default :
            alert("control_button click() unhandled " + mode);
            break;
    }
});


/* LISTEN */

// initial boolean
function listen_start(initial=false) {
    mode = modes.LISTEN;
    listen.state = listen.states.COVER;
    listen.countdown = 1 * SLICE_IN_SEC;
    $("#msg1").text("Listen");
    $("#msg2").text("");
    $("#cover").css("opacity", "1");
    $("#listenCounter").text(listen.played);
    $("#control-button").css("visibility", 'hidden');

    if (!initial) {
        if (listen.played > 0) {
            listen.countdown = 10000 * SLICE_IN_SEC;
            $("#msg2").text("Click to continue");
            $("#cover").css("opacity", "0.98");
        }
    }

    clock_restart();
}

function listen_stop() {
    player.pauseVideo();
}

function listen_clock() {
    switch (listen.state) {
        case listen.states.COVER :
            listen.countdown--;
            if (listen.countdown <= 0) listen_play();
            break;
        case listen.states.PLAY :
            break;
        default :
            alert("listen_clock() unhandled state " + listen.state);
            break;
    }
}

function listen_stateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        switch (listen.state) {
            case listen.states.COVER :
                break;
            case listen.states.PLAY :
                listen.played++;
                listen_start();
                break;
            default :
                alert("listen_stateChange() unhandled state " + listen.state);
                break;
        }
    }
}

function listen_cover_click() {
    listen_play();
}

function listen_play() {
    $("#cover").css("opacity", "0");
    player.playVideo();
    listen.state = listen.states.PLAY;
}

/* MARK */

function mark_start() {
    mode = modes.MARK;
    mark.state = mark.states.COVER;
    mark.countdown = 1 * SLICE_IN_SEC;
    $("#msg1").text("Mark");
    $("#msg2").text("");
    $("#cover").css("opacity", "1");
    $("#mark-button").text("press to mark");
    $("#mark-button").attr("class", "mark-button-normal");
    $("#control-button").css("visibility", 'hidden');


    markbar_draw();
    $("#marker").show();
    clock_restart();
}

function mark_stop() {
    player.pauseVideo();
    $("#marker").hide();
    $("#cover").show();
}

function mark_pause() {
    if (event.data == YT.PlayerState.PAUSED) {
        marked.state = marked.states.ENDED;
    }
}

function mark_clock() {
    switch (mark.state) {
        case mark.states.COVER :
            mark.countdown--;
            if (mark.countdown <= 0) mark_play();
            break;
        case mark.states.PLAY :
            time_diff = new Date() - mark.start_time;
            player_time = mark.player_start_time + (time_diff / 1000);
            id = Math.floor(player_time * SLICE_IN_SEC);

            if (mark.mousedown == 1) {
                markbar_status[id] = 1;
                key = "#mark" + (id + 1);
                $(key).attr("class", "mark-1");
            }

            if (id < player._duration) {
                var from = markbar_position(id);
                var to = markbar_position(id + 1);
                var pos = from + (to - from) / 2;
                $("#mark-position").css("margin-left", pos+7 + "px");
            }
            else console.log("invalid id " + id);
            break;
        // case mark.states.PAUSE :
        //     var from = markbar_position(id);
        //     var to = markbar_position(id + 1);
        //     var pos = from + (to - from) / 2;
        //     $("#mark-position").css("margin-left", pos+7 + "px");
        //     break;
        default :
            alert("mark_clock() unhandled state " + listen.state);
            break;
    }
}

function mark_stateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        switch (mark.state) {
            case mark.states.COVER :
                break;
            case mark.states.PLAY :
                mark.played++;
                mark_start();
                mousedown = 0;
                break;
            case mark.states.PAUSE :
                mark_pause();
                break;
            default :
                alert("mark_stateChange() unhandled state " + mark.state);
                break;
        }
    }
}

function mark_play() {
    $("#cover").hide();
    mark.start_time = new Date();
    mark.player_start_time = 0;

    player.seekTo(0);
    player.playVideo();
    mark.state = mark.states.PLAY;
}



/* markbar */

var markbar_status = [];

function markbar_init() {
    for (i = 0; i < 1000; i++) markbar_status[i] = 0;
}

function markbar_draw() {
    // player not ready yet
    if (player == null) return;

    var duration = player.getDuration();
    player._duration = Math.ceil(duration * SLICE_IN_SEC);

    var total = 0;

    $("#markbar").empty();
    for (var i = 0; i < player._duration; i++) {
        var from = markbar_position(i);
        var to = markbar_position(i+1);
        var each_width = to - from;
        total += each_width;
        $("#markbar").append("<div id='mark" + (i + 1) + "' class='mark-" + markbar_status[i]
            + "' style='width:" + each_width + "px;'></div>");
    }
}

// nth : 0..n
// return x position within div
function markbar_position(nth) {
    var screen_width = $("#player").width();
    var markbar_width = screen_width - (12 + 12);

    return Math.round(nth * (markbar_width / player._duration));
}

// pos : relative pos within div "marker"
// return : id = 0..player._duration -1, -1 = out of scope
function markbar_position_to_id(pos) {
    var screen_width = $("#player").width();
    var markbar_width = screen_width - (12 + 12);

    if ((pos < 12) || (pos > (markbar_width + 12))) return -1;

    id = Math.floor((pos - 12) / (markbar_width / player._duration));
    return id;
}


function markbar_sections() {
    var count = 0;
    var marked = false;

    for (i = 0; i < 1000; i++) {
        if (!marked) {
            if (markbar_status[i] == 1) {
                marked = true;
            }
        }
        else {
            if (markbar_status[i] == 0) {
                marked = false;
                count++;
            }
        }
    }

    return(count);
}

// section = 0..n-1
function markbar_get_from(section) {
    return markbar_get_general(section, true);
}

function markbar_get_to(section) {
    return markbar_get_general(section, false);
}


// begin = true | false
function markbar_get_general(section, begin) {
    var count = 0;
    var marked = false;

    for (i = 0; i < 1000; i++) {
        if (!marked) {
            if (markbar_status[i] == 1) {
                if (begin && (count == section)) return(i);
                marked = true;
            }
        }
        else {
            if (markbar_status[i] == 0) {
                if (!begin && (count == section)) return(i);
                marked = false;
                count++;
            }
        }
    }

    // not found
    return(-1);
}


$("#markbar").click(function(e) {
    var offset = $(this).offset();
    var relativeX = e.pageX - offset.left;
    var relativeY = e.pageY - offset.top;

    var id = markbar_position_to_id(relativeX);
    if (id == -1) return;

    if (markbar_status[id] == 0) {
        key = "#mark" + (id + 1);
        $(key).attr("class", "mark-1");
        markbar_status[id] = 1;
    }
    else {
        key = "#mark" + (id + 1);
        $(key).attr("class", "mark-0");
        markbar_status[id] = 0;
    }
});



/* mark_button */

$("#mark-button").mousedown(function() {
    if (mode == modes.MARK) {
        mark.mousedown = 1;
        mark.mousedown_time = new Date();
        mark.mousedown_player_time = player.getCurrentTime();
    }
    else {
        mode_stop();
        mark_start();
    }
});

$("#mark-button").mouseup(function() {
    if (mode == modes.MARK) {
        mark.mousedown = 0;
    }
});

$("#clear-button").click(function() {
    if (mode == modes.MARKED){
        $("#mark-button").text("press to mark");
        $("#mark-button").attr("class", "mark-button-normal");
        markbar_init();
        mode = modes.MARK;
        mark.state = mark.states.COVER;
        markbar_draw();
        clock_restart();
    }
    markbar_init();
    markbar_draw();

});

$("#listen-button").click(function() {
    if (markbar_sections() == 0) return;             // anything marked ?
    marked_start(1);
});

$("#repeat-button").click(function() {
    if (markbar_sections() == 0) return;             // anything marked ?
    marked_start(5);
});


/* MARKED */


// repeat boolean : true = repeat
function marked_start(to_play=-1) {
    mode = modes.MARKED;
    marked.state = marked.states.PLAY;
    if (to_play > 0) marked.to_play = to_play;
    marked.sections = markbar_sections();
    marked.section_now = -1;
    marked_play_next_section();
    $("#mark-button").text("continue to mark");
    $("#mark-button").attr("class", "mark-button-continue");
}

function marked_stop() {
    player.pauseVideo();
    $("#marker").hide();
    $("#cover").show();
};

function marked_clock() {
    switch (marked.state) {
        case marked.states.PLAY :
            time_diff = new Date() - marked.from_time;       // in millseconds 1 sec = 1000
            time_diff_in_sec = time_diff / 1000;             // now in sec

            if (time_diff_in_sec > marked.player_duration) {
                if (!marked_play_next_section()) {
                    marked_section_end_reached();
                    return;
                }
            }

            player_time = marked.player_start_time + (time_diff / 1000);
            id = Math.floor(player_time * SLICE_IN_SEC);

            if (id < player._duration) {
                var from = markbar_position(id);
                var to = markbar_position(id + 1);
                var pos = from + (to - from) / 2;
                $("#mark-position").css("margin-left", pos+7 + "px");
            }
            else console.log("invalid #2 id " + id + " player._duration " + player._duration);
            break;

        case marked.states.ENDED :
            marked_section_end_reached();
            break;

        default :
            alert("marked_clock() unhandled state " + listen.state);
            break;
    }
}

// return : false = video stopped
function marked_section_end_reached() {
    marked.to_play--;
    if (marked.to_play <= 0) {
        player.pauseVideo();
        marked.stats = marked.states.ENDED;
        return false;
    }
}


function marked_stateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        marked.state = marked.states.ENDED;
    }
}


// please set global marked.section_now (-1 = initial)
// return : true = ok, false = no more to play
function marked_play_next_section() {
    marked.section_now++;
    if (marked.section_now >= marked.sections) {
        return false;
    }

    marked.from_time = new Date();
    from = markbar_get_from(marked.section_now);
    marked.player_duration = (markbar_get_to(marked.section_now) - from) / SLICE_IN_SEC;   // in sec

    marked.player_start_time = from / SLICE_IN_SEC;
    player.seekTo(marked.player_start_time, true);
    player.playVideo();
    return true;
}


/* debug */

$("#debug1-button").click(function() {
    sections = markbar_sections();
    for (var i = 0; i < sections; i++) {
        from = markbar_get_from(i) / SLICE_IN_SEC;
        to = markbar_get_to(i) / SLICE_IN_SEC;
        console.log(from + " - " + to);
    }
});



/* STUDY */

function study_start() {
    mode = modes.STUDY;
    study.state = study.states.COVER;
    study.countdown = 1 * SLICE_IN_SEC;
    study.audio_pause = 0;
    $("#msg1").text("Study");
    $("#msg2").text("");
    $("#msg-study").text("");
    $("#cover").css("opacity", "1");
    $("#control-button").css("visibility", 'visible');
    $("#control-button").text("Skip");

    clock_restart();
}

function study_stop() {
    $("#msg-study").text("");
}

function study_clock() {
    switch (study.state) {
        case study.states.COVER :
            study.countdown--;
            if (study.countdown <= 0) study_play();
            break;
        case study.states.PLAY :
            study.audio_pause--;
            if (study.audio_pause > 0) return;
            if (!study_play_step()) {
                study_start();
            }
            break;
        case study.states.PLAY_AUDIO :
            break;
        default :
            alert("study_clock() unhandled state " + study.state);
            break;
    }
}

function study_stateChange(event) {
}

// play

function study_play() {
    study.state = study.states.PLAY;
    study_words_init();
    study.steps_now = 0;
}

function study_play_step() {
    words = study_words_now();

    study.steps_now++;
    if (study.steps_now == 1) {
        $("#msg1").text("");
        $("#msg-study").text(words.words);
        $("#msg-study").css("opacity", 0);
        $("#audio").empty();
        $("#audio").append('<audio id="audio-now"><source src=' + words.audio
            + '"../public/audio" type="audio/ogg"></audio>')
    }
    else {
        if (study.steps_now > STUDY_STEPS) {
            study.steps_now = 0;
            if (!study_words_next()) return false;
            return true;
        }
    }

    var opacity = study_play_opacity(study.steps_now);
    $("#msg-study").css("opacity", opacity);

    study.audio_now = document.getElementById("audio-now");

    $("#audio-now").on('ended', function() {
        study.state = study.states.PLAY;
        study.audio_pause = 2 * SLICE_IN_SEC;
        // clock will start play audio
    });
    study.audio_now.play();
    study.state = study.states.PLAY_AUDIO;

    return true;
}


function study_play_stop() {
    switch (study.state) {
        case study.states.COVER :
            break;
        case study.states.PLAY :
            study.audio_pause = 0;
            study.steps_now = STUDY_STEPS;
            break;
        case study.states.PLAY_AUDIO :
            // stop current playing
            study.audio_now.currentTime = study.audio_now.duration;
            study.steps_now = STUDY_STEPS;
            break;
        default :
            alert("study_play_stop() unhandled state " + study.state);
            break;
    }
}



// step : 1..n
// return : 0~1
function study_play_opacity(step) {
    if (step < STUDY_STEP_SHOW_START) return 0;
    var steps = (STUDY_STEPS - STUDY_STEP_SHOW_START + 1);

    var op = (step - STUDY_STEP_SHOW_START + 1) * (1 / steps);
    return op;
}


function study_control_click() {
    study_play_stop();
}

/* study words */

function study_words_init() {
    study.words = [];
    level = 0;

    // find next level : 0 = end
    level = study_words_find_next_level(level);
    while (level > 0) {
        study_word_push_matching_level(level);
        level = study_words_find_next_level(level);
    }

    study.words_now_id = 0;
}

// return : next level, 0 = done
function study_words_find_next_level(level) {
    next = 0;
    for (var i = 0; i < SCRIPT.length; i++) {
        if (SCRIPT[i].level > level) {
            if (next == 0) next = SCRIPT[i].level;
            else {
                if (next > SCRIPT[i].level) next = SCRIPT[i].level;
            }
        }
    }
    return next;
}

function study_word_push_matching_level(level) {
    for (var i = 0; i < SCRIPT.length; i++) {
        if (level == SCRIPT[i].level) study.words.push(SCRIPT[i]);
    }
}


// return : entry of SCRIPT like element
function study_words_now() {
    return study.words[study.words_now_id];
}

// return : true = continue, false = end reached
function study_words_next() {
    study.words_now_id++;
    if (study.words_now_id >= study.words.length) return false;
    return true;
}




// action!
mode = modes.LISTEN;
$("#marker").hide();
markbar_init();
resizeVideo();
