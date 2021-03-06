function writeMessage(canvas, message) {
    "use strict";
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
}
function getMousePos(canvas, evt) {
    "use strict";
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getSnapPoint(x, y) {
    "use strict";
    var proximity = 0.4, grid = 25;
    var point = {};
    if ((x % grid < (proximity * grid) || x % grid > (grid - proximity * grid)) && (y % grid > (proximity * grid) || y % grid < (grid - proximity * grid))) {
        point.x = Math.floor(x / grid) * grid + Math.round(x % grid / grid) * grid;
        point.y = Math.floor(y / grid) * grid + Math.round(y % grid / grid) * grid;
    }
    
    return point;
}

function highlightPoint(canvas, x, y) {
    "use strict";
    var ctx = canvas.getContext('2d');
    var point = getSnapPoint(x, y);
    if (point) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
        ctx.closePath();
    }
}

function drawGrid(canvas) {
    "use strict";
    var major = {'spacing': 50, 'strokeStyle': '#000000'};
    var minor = {'spacing': 25, 'strokeStyle': '#0000ff'};

    var drawGridLine = function (x1, x2, y1, y2, strokeStyle, canvas) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = strokeStyle;
        ctx.setLineDash([1, 3]);
        ctx.stroke();
        ctx.closePath();
    };
    var drawHorizontalGridLine = function (x, strokeStyle, canvas) {
        var rect = canvas.getBoundingClientRect();
        drawGridLine(x, x, 0, rect.height, strokeStyle, canvas);
    };
    var drawVerticalGridLine = function (y, strokeStyle, canvas) {
        var rect = canvas.getBoundingClientRect();
        drawGridLine(0, rect.width, y, y, strokeStyle, canvas);
    };
    var drawGridLines = function (gridLines, canvas) {
        var ctx = canvas.getContext('2d');
        var rect = canvas.getBoundingClientRect();
        var x = 0, y = 0;
        while (x < rect.width) {
            for (var i = 0; i < gridLines.length; i++) {
                if (x % gridLines[i].spacing === 0) {
                    drawHorizontalGridLine(x, gridLines[i].strokeStyle, canvas);
                    break;
                }
            }
            x++;
        }
        while (y < rect.height) {
            for (var i = 0; i < gridLines.length; i++) {
                if (y % gridLines[i].spacing === 0) {
                    drawVerticalGridLine(y, gridLines[i].strokeStyle, canvas);
                    break;
                }
            }
            y++;
        }
    };
        
    drawGridLines([major, minor], canvas);
}

function addPoint(point) {
    window.points.push(point);
}

function drawPoints(canvas) {
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < window.points.length; i++) {
        ctx.beginPath();
        ctx.arc(window.points[i].x, window.points[i].y, 2, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.closePath();
    }
}

var canvas = document.getElementById('my-canvas');
var gridCanvas = document.getElementById('grid-canvas');
var context = canvas.getContext('2d');

canvas.addEventListener('mousemove', function (evt) {
    "use strict";
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    writeMessage(canvas, message);
    highlightPoint(canvas, mousePos.x, mousePos.y);
    drawPoints(canvas);
}, false);

canvas.addEventListener('click', function (evt) {
    "use strict";
    var mousePos = getMousePos(canvas, evt);
    addPoint(getSnapPoint(mousePos.x, mousePos.y));
})

window.onload = function() {
    "use strict";
    drawGrid(gridCanvas);
    window.points = [];
};
