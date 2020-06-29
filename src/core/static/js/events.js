const socket = io();
let px       = 0;
let py       = 0;


socket.on('connect', function() {
    console.log("Websocket connected...");
});


$(function () {
    $.mousedirection();
    $("#canvas").on("mousedirection", function (e) {
        if (e.direction == "up") {
            px = 0;
            py = -1;
        } else if (e.direction == "down") {
            px = 0;
            py = 1;
        } else if (e.direction == "left") {
            px = -1;
            py = 0;
        } else if (e.direction == "right") {
            px = 1;
            py = 0;
        } else if (e.direction == "top-left") {
            px = -1;
            py = -1;
        } else if (e.direction == "top-right") {
            px = 1;
            py = -1;
        } else if (e.direction == "bottom-left") {
            px = -1;
            py = 1;
        } else if (e.direction == "bottom-right") {
            px = 1;
            py = 1;
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

document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);
