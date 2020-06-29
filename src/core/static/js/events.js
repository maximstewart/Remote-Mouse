const socket = io();
let intervalTimer = null;
let px       = 0;
let py       = 0;
let mod      = 0;


socket.on('connect', function() {
    console.log("Websocket connected...");
});


$(function () {
    $.mousedirection();
    $("#canvas").on("mousedirection", function (e) {
        if (e.direction == "up") {
            px = 0;
            py = -1 - mod;
        } else if (e.direction == "down") {
            px = 0;
            py = 1 + mod;
        } else if (e.direction == "left") {
            px = -1 - mod;
            py = 0;
        } else if (e.direction == "right") {
            px = 1 + mod;
            py = 0;
        } else if (e.direction == "top-left") {
            px = -1 - mod;
            py = -1 - mod;
        } else if (e.direction == "top-right") {
            px = 1 + mod;
            py = -1 - mod;
        } else if (e.direction == "bottom-left") {
            px = -1 - mod;
            py = 1 + mod;
        } else if (e.direction == "bottom-right") {
            px = 1 + mod;
            py = 1 + mod;
        }

        updateText (px, py);
    });
});



function updateText (px, py) {
    const coordsTxt = "X coords: " + px + ", Y coords: " + py;
    document.getElementById("cordsText").innerText = coordsTxt;
    // doAjax("/update-coords/xy/" + px + "/" + py, "" , "update-coords", "GET");
    socket.emit('update_coords', px + "," + py);
}

// Touch events converted to mouse events
function touchHandler(event) {
    let touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

    let simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                  first.screenX, first.screenY,
                                  first.clientX, first.clientY, false,
                                  false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}


function beginTimerModBump() {
    intervalTimer = setInterval(function () {
        mod += 2;
    }, 600);
}

function endTimerModBump() {
    clearInterval(intervalTimer);
    mod = 0;
}

function singleClick() {
    socket.emit('single_click', "");
}

function doubleClick() {
    socket.emit('double_click', "");
}


document.addEventListener("mousedown", beginTimerModBump, true);
document.addEventListener("mouseup", endTimerModBump, true);
document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);
document.getElementById("singleClickBtn").addEventListener("mouseup", singleClick, true);
document.getElementById("doubleClickBtn").addEventListener("mouseup", doubleClick, true);
