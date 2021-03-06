let useSocket = true;

const socket = io();
socket.on('connect', function() {
  console.log("Websocket connected...");
});


let mouseHoldToggle  = document.getElementById("mouseHoldToggle");
let scrollTggl       = document.getElementById("scrollToggle");
let clickSound       = document.getElementById("clickSound");
let isHoldingMouse   = false;
let isTwoFinger      = false;
let isScrolling      = false;
let isRightClicking  = false;
let isClicking       = true;
let step             = 1;
let stepBump         = 0.1;
let mod              = 0;
let px               = 0;
let py               = 0;




$(function () {
    $.mousedirection();
    $("#canvas").on("mousedirection", function (e) {
        isClicking = false;

        if (e.direction == "up") {
            px = 0;
            py = -step - mod;
        } else if (e.direction == "down") {
            px = 0;
            py = step + mod;
        } else if (e.direction == "left") {
            px = -step - mod;
            py = 0;
        } else if (e.direction == "right") {
            px = step + mod;
            py = 0;
        } else if (e.direction == "top-left") {
            px = -step - mod;
            py = -step - mod;
        } else if (e.direction == "top-right") {
            px = step + mod;
            py = -step - mod;
        } else if (e.direction == "bottom-left") {
            px = -step - mod;
            py = step + mod;
        } else if (e.direction == "bottom-right") {
            px = step + mod;
            py = step + mod;
        }

        mod += stepBump;

        if (isScrolling) {
            if (useSocket) {
                if (e.direction == "up") {
                  socket.emit('scroll_up', "");
                } else if (e.direction == "down") {
                  socket.emit('scroll_down', "");
                }
            } else {
                if (e.direction == "up") {
                  doAjax("/scroll-up" , "scroll-up", "GET");
                } else if (e.direction == "down") {
                  doAjax("/scroll-down" , "scroll-down", "GET");
                }
            }
        } else {
            if (useSocket) {
                socket.emit('update_coords', px + "," + py);
            } else {
                doAjax("/update-coords/xy/" + px + "/" + py, "" , "update-coords", "GET");
            }
        }
    });
});


// Touch events converted to mouse events
function touchHandler(event) {
    if (event.type == "touchstart" && event.touches.length > 1) {
        isClicking      = false;
        isRightClicking = true;
        isTwoFinger     = true;
    }

    if (event.type == "touchmove" && isTwoFinger) {
        isClicking      = false;
        isRightClicking = false;
        isScrolling     = true;
    }

    if (event.type == "touchend") {
        isTwoFinger = false;
        isScrolling = false;
        if (isRightClicking) {
            isRightClicking = false;
            rightClick();
            return ;
        }
    }

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


function setClickkCheck() {
    isClicking = true;
}

function resetClickCheckAndModBump(e) {
    mod = 0;
    if (e.target.id == "canvas" && isClicking) {
        leftClick();
    }
}

function leftClick() {
    if (useSocket) {
        playClickSound();
        socket.emit('left_click', "");
    } else {
        doAjax("/left-click" , "left-click", "GET");
    }
}

function rightClick() {
    if (useSocket) {
        playClickSound();
        socket.emit('right_click', "");
    } else {
        doAjax("/right-click", "right-click", "GET");
    }
}

function sendKeys() {
    const text = document.getElementById("sendKeysField").value.trim();
    doAjax("/send-keys", "text=" + text, "send-keys");
}

function pressEnter() {
    if (useSocket) {
        socket.emit('press_enter', "");
    } else {
        doAjax("/press-enter", "press-enter", "GET");
    }
}

function pressBack() {
    if (useSocket) {
        socket.emit('press_back', "");
    } else {
        doAjax("/press-back", "" , "back-press", "GET");
    }
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


$( "#controlsModalBtn" ).bind( "mouseup", async function(eve) {
    $('#controlsModal').modal({"focus": true, "show": true});
});

$( "#typingModalBtn" ).bind( "mouseup", async function(eve) {
    $('#typingModal').modal({"focus": true, "show": true});
});

$( "#closeControlsModalBtn" ).bind( "mouseup", async function(eve) {
    console.log("here");
    $('#controlsModal').modal('hide');
});

$( "#closeTypingModalBtn" ).bind( "mouseup", async function(eve) {
    console.log("here2");
    $('#typingModal').modal('hide');
});


document.addEventListener("mousedown", setClickkCheck, true);
document.addEventListener("mouseup", resetClickCheckAndModBump, true);
document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);

document.getElementById("rightClickBtn").addEventListener("mouseup", rightClick, true);
document.getElementById("sendKeysBtn").addEventListener("mouseup", sendKeys, true);
document.getElementById("pressEnterBtn").addEventListener("mouseup", pressEnter, true);
document.getElementById("pressBackBtn").addEventListener("mouseup", pressBack, true);


document.getElementById("scrollToggle").addEventListener("mouseup", scrollToggle, true);
document.getElementById("mouseHoldToggle").addEventListener("mouseup", holdToggle, true);
