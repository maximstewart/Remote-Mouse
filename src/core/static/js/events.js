const socket         = io();
let mouseHoldToggle  = document.getElementById("mouseHoldToggle");
let scrollTggl     = document.getElementById("scrollToggle");
let clickSound     = document.getElementById("clickSound");
let intervalTimer  = null;
let isHoldingMouse = false;
let isScrolling    = false;
let mod            = 0;
let px             = 0;
let py             = 0;


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

        if (isScrolling) {
            if (e.direction == "up") {
                socket.emit('scroll_up', "");
            } else {
                socket.emit('scroll_down', "");
            }
        } else {
            socket.emit('update_coords', px + "," + py);
            // doAjax("/update-coords/xy/" + px + "/" + py, "" , "update-coords", "GET");
            updateText (px, py);
        }
    });
});



function updateText (px, py) {
    const coordsTxt = "X coords: " + px + ", Y coords: " + py;
    document.getElementById("cordsText").innerText = coordsTxt;
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

function leftClick() {
    playClickSound();
    socket.emit('left_click', "");
}

function rightClick() {
    playClickSound();
    socket.emit('right_click', "");
}

function scrollToggle() {
    if (isScrolling) {
        isScrolling = false;
        scrollTggl.classList.add("btn-success");
        scrollTggl.classList.remove("btn-info");
        scrollTggl.innerText = "Scroll Mode: Inactive";
    } else {
        isScrolling = true;
        scrollTggl.classList.add("btn-info");
        scrollTggl.classList.remove("btn-success");
        scrollTggl.innerText = "Scroll Mode: Active";
    }
}


function holdToggle() {
    if (isHoldingMouse) {
        isHoldingMouse = false;
        mouseHoldToggle.classList.add("btn-success");
        mouseHoldToggle.classList.remove("btn-info");
        mouseHoldToggle.innerText = "Mouse Hold: Inactive";
        socket.emit('mouse_up', "");
    } else {
        isHoldingMouse = true;
        mouseHoldToggle.classList.add("btn-info");
        mouseHoldToggle.classList.remove("btn-success");
        mouseHoldToggle.innerText = "Mouse Hold: Active";
        socket.emit('mouse_down', "");
    }
}

function playClickSound() {
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play();
}


document.addEventListener("mousedown", beginTimerModBump, true);
document.addEventListener("mouseup", endTimerModBump, true);
document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);

document.getElementById("leftClickBtn").addEventListener("mouseup", leftClick, true);
document.getElementById("rightClickBtn").addEventListener("mouseup", rightClick, true);

document.getElementById("scrollToggle").addEventListener("mouseup", scrollToggle, true);
document.getElementById("mouseHoldToggle").addEventListener("mouseup", holdToggle, true);
