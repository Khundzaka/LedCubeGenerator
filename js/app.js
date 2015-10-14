Array.prototype.insertAt = function (index, el) {
    var i;
    var k = [];
    this.forEach(function (e) {
        k.push(e);
    });
    while (this.length > 0) {
        this.pop();
    }
    for (i = 0; i < index; i++) {
        this.push(k[i]);
    }
    this.push(el);
    for (i = index; i < k.length; i++) {
        this.push(k[i]);
    }
};

var boxes, canvas, ctx, activeFrame, frames, frameBox, durationInput, checkboxes, timeoutVar;
var durationStep = 20;

function initApp() {
    boxes = [
        [50, 10],
        [70, 10],
        [90, 10],
        [40, 20],
        [60, 20],
        [80, 20],
        [30, 30],
        [50, 30],
        [70, 30],
        //layer 1 end
        [50, 40],
        [70, 40],
        [90, 40],
        [40, 50],
        [60, 50],
        [80, 50],
        [30, 60],
        [50, 60],
        [70, 60],
        ////layer2 end
        [50, 70],
        [70, 70],
        [90, 70],
        [40, 80],
        [60, 80],
        [80, 80],
        [30, 90],
        [50, 90],
        [70, 90]
        ////layer 3 end
    ];
    canvas = document.getElementById('simulator');
    ctx = canvas.getContext('2d');
    frames = [];
    frameBox = document.getElementById("frames");
    checkboxes = [];
    durationInput = document.getElementById("durationInput");
    durationInput.addEventListener("change", function () {
        if (activeFrame !== undefined) {
            activeFrame.duration = durationInput.value;
            activeFrame.dom.firstChild.nextSibling.innerHTML = activeFrame.duration.toString();
        }
    });

    for (var i = 1; i <= 27; i++) {
        var chk = document.getElementById("check" + parseInt(i));
        chk.onclick = function () {
            updateSimulation();
        };
        checkboxes.push(chk);
    }

    updateSimulation();
}

function updateSimulation() {
    ctx.clearRect(0, 0, 100, 100);
    for (var i = 0; i < boxes.length; i++) {
        var path = new Path2D();
        if (checkboxes[i].checked) {
            ctx.fillStyle = "rgb(100,0,0)";
            path.arc(boxes[i][0], boxes[i][1], 3, 0, Math.PI * 2, true);
            leds[i].material.color.setHex(0xffffff);
        }
        else {
            ctx.fillStyle = "rgb(200,0,0)";
            path.arc(boxes[i][0], boxes[i][1], 1, 0, Math.PI * 2, true);
            leds[i].material.color.setHex(0x333333);
        }
        ctx.fill(path);
    }
    ctx.strokeStyle = "rgb(100,100,100)";
    ctx.beginPath();
    ctx.moveTo(26,35);
    ctx.lineTo(74,35);
    ctx.lineTo(96,11);
    ctx.stroke();
    ctx.moveTo(26,65);
    ctx.lineTo(74,65);
    ctx.lineTo(96,41);
    ctx.stroke();
    ctx.moveTo(26,95);
    ctx.lineTo(74,95);
    ctx.lineTo(96,71);
    ctx.stroke();
    if (activeFrame !== undefined) {
        activeFrame.dom.firstChild.src = canvas.toDataURL();
        var currentIndex = getCurrentIndex();
        frames[currentIndex].states = getStateList();
    }
    render();
}

var updateFramesBox = function () {
    while (frameBox.firstChild) {
        frameBox.removeChild(frameBox.firstChild);
    }
    for (var i = 0; i < frames.length; i++) {
        frameBox.appendChild(frames[i].dom);
    }
};

function removeActiveFrame() {
    if (activeFrame !== undefined) {
        frames.splice(getCurrentIndex(), 1);
        activeFrame = undefined;
        updateFramesBox();
    }
}

function makeActive(dom) {
    if (activeFrame !== undefined) {
        activeFrame.dom.setAttribute("class", "single-frame");
    }
    for (var i = 0; i < frames.length; i++) {
        if(frames[i].dom === dom){
            activeFrame = frames[i];
            break;
        }
    }
    setStates(activeFrame.states);
    durationInput.value = activeFrame.duration;
    dom.setAttribute("class", "single-frame single-frame-active");
    updateSimulation();

}


function moveLeft() {
    if (activeFrame !== undefined) {
        var currentIndex = getCurrentIndex();
        if (currentIndex > 0) {
            frames[currentIndex] = frames[currentIndex - 1];
            frames[currentIndex - 1] = activeFrame;
        }
        updateFramesBox();
    }
}

function moveRight() {
    if (activeFrame !== undefined) {
        var currentIndex = getCurrentIndex();
        if (currentIndex < frames.length - 1) {
            frames[currentIndex] = frames[currentIndex + 1];
            frames[currentIndex + 1] = activeFrame;
        }
        updateFramesBox();
    }
}

function createFrame() {
    var div = document.createElement("div");
    div.setAttribute("class", "single-frame");
    var image = new Image();
    image.src = canvas.toDataURL();
    div.appendChild(image);
    var durationSpan = document.createElement("span");
    durationSpan.innerHTML = durationInput.value.toString();
    div.appendChild(durationSpan);
    div.onclick = function () {
        makeActive(this);
    };

    return div;
}

function addFrame() {
    var frameBox = document.getElementById("frames");
    var div = createFrame();
    frameBox.appendChild(div);
    var newFrame = {
        states: getStateList(),
        dom: div,
        duration: durationInput.value
    };
    frames.push(newFrame);
    makeActive(div);
}

function getStateList() {
    var list = [];
    checkboxes.forEach(function (e) {
        list.push(e.checked);
    });
    return list;
}

function cloneFrame() {
    if (activeFrame !== undefined) {
        var currentIndex = getCurrentIndex();
        var newDom = createFrame();
        var newFrame = {
            states: getStateList(),
            dom: newDom,
            duration: durationInput.value
        };
        frames.insertAt(currentIndex + 1, newFrame);
        updateFramesBox();
    }
}

function setStates(states) {
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = states[i];
    }
}

function getCurrentIndex() {
    for(var i = 0; i<frames.length; i++){
        if(frames[i].dom === activeFrame.dom)
        return i;
    }
    return -1;
}

function playSimulation() {
    timeoutVar = setTimeout(simulateNextFrame, durationStep * activeFrame.duration);
}

function pauseSimulation() {
    clearTimeout(timeoutVar);
}

function stopSimulation() {
    pauseSimulation();
    makeActive(frames[0].dom);
    frames[0].dom.scrollIntoView();
}

function simulateNextFrame() {
    var index = getCurrentIndex();
    if (++index >= frames.length) {
        index = 0;
    }

    makeActive(frames[index].dom);
    frames[index].dom.scrollIntoView();

    timeoutVar = setTimeout(simulateNextFrame, durationStep * activeFrame.duration);
}

function generateArduinoCode() {
    var intFrames = [];
    for (var i = 0; i < frames.length; i++) {
        var byteFrame = 0;
        for (var j = 0; j < frames[i].states.length; j++) {
            byteFrame |= frames[i].states[j] << (j + 5);
        }
        byteFrame|=frames[i].duration-1;
        intFrames.push(byteFrame);
    }
    console.log(intFrames);
}

initApp();