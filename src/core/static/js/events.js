const socket = io();
socket.on('connect', function() {
    console.log("Websocket connected...");
});


// When true, moving the mouse updates coords
const canvas   = document.getElementById("canvas");
let isDragging = false;
let runUpdate  = false;
let xLast      = 0;
let yLast      = 0;
let mod        = 2;
let px         = 0;
let py         = 0;
let x1         = 0;
let y1         = 0;
let x2         = 0;
let y2         = 0;
let m          = undefined; // slope value


canvas.addEventListener('touchstart', e => { onPress(e);   });
canvas.addEventListener('mousedown',  e => { onPress(e);   });
canvas.addEventListener('touchmove',  e => { onMoveing(e); });
canvas.addEventListener('mousemove',  e => { onMoveing(e); });
canvas.addEventListener('touchend',   e => { onRelease(e); });
canvas.addEventListener('mouseup',    e => { onRelease(e); });


const onPress = (e) => {
    isDragging = true;
    runUpdate  = true;
    xLast      = e.offsetX;
    yLast      = e.offsetY;
    updateText(xLast, yLast);
}


const onMoveing = (e) => {
    if (isDragging === true) {
        x1 = xLast;
        y1 = yLast;

        if (e.type === 'mousemove') {
            x2    = e.offsetX;
            y2    = e.offsetY;
            xLast = e.offsetX;
            yLast = e.offsetY;
        } else if (e.type === 'touchmove') {
            x2    = parseInt(e.touches[0].clientX, 10);
            y2    = parseInt(e.touches[0].clientY, 10);
            xLast = parseInt(e.touches[0].clientX, 10);
            yLast = parseInt(e.touches[0].clientY, 10);
        }

        // Calculate the delta of the points
        if (x2 > x1) {
            px = mod   // Is growing
        } else {
            px = -mod  // Is shrinking
        }

        if (y2 > y1) {
            py = mod   // Is growing
        } else {
            py = -mod  // Is shrinking
        }

        m = (y2-y1)/(x2-x1)
        if (m === undefined) {
            py = 0;
        } else if (!isFinite(m)) {
            px = 0;
        }

        if ( (m > 0.05 && m <= 1) && (m > -0.05 && m >= -1) ) {
            py = 0;
        }

        socket.emit('update_coords', x2 + "," + y2);
    }
}


const onRelease = (e) => {
    if (isDragging === true) {
        isDragging = false;
        mod        = 2
        xLast      = 0;
        yLast      = 0;
        px         = 0;
        py         = 0;
        updateText(px, py);
    }
}


const updateText = (x, y) => {
    const coordsTxt = "X coords: " + x + ", Y coords: " + y;
    document.getElementById("cordsText").innerText = coordsTxt;
}



// Click events
document.getElementById("singleClickBtn").addEventListener('mouseup',  e => { onSingleClick(e); });
document.getElementById("singleClickBtn").addEventListener('touchend', e => { onSingleClick(e); });
document.getElementById("doubleClickBtn").addEventListener('mouseup',  e => { onDoubleClick(e); });
document.getElementById("doubleClickBtn").addEventListener('touchend', e => { onDoubleClick(e); });

const onSingleClick = (e) => {
    doAjax("/single-click", "ref=null", "singleClick");
}

const onDoubleClick = (e) => {
    doAjax("/double-click", "ref=null", "doubleClick");
}



// Key input events
// document.getElementById("sendKeysField").addEventListener('input',  e => { onSendKeys(e); });
// document.getElementById("sendKeysField").addEventListener('change',  e => { onSendKeys(e); });
document.getElementById("sendKeysBtn").addEventListener('mouseup',  e => { onSendKeys(e); });
document.getElementById("sendKeysBtn").addEventListener('touchend', e => { onSendKeys(e); });

const onSendKeys = (e) => {
    let target = document.getElementById("sendKeysField");
    const text = target.value;
    doAjax("/send-key", "text=" + text, "sendKeys");
    target.value = "";
}
