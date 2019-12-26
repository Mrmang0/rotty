const width = 1350;
const height = 1000;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.getElementsByTagName('body')[0].appendChild(canvas);
const context = canvas.getContext('2d');

context.strokeStyle = 'rgba(255,255,255,1)';
context.fillStyle = 'rgba(0,0,0,1)';
context.translate(675, 500);
let startPosition = {
    x: 0,
    y: 0
};

function* getMousePosition(sp = {}) {
    let currentPostion = {
        x: 0,
        y: 0
    };
    let prevPostion = {
        x: 0,
        y: 0
    }

    canvas.addEventListener("mousemove", e => {
        const bound = canvas.getBoundingClientRect()
        prevPostion = {
            ...currentPostion
        };
        currentPostion = {
            x: e.x - bound.x - 675,
            y: e.y - bound.y - 500
        };
    })

    while (true) {
        yield {
            currentPostion: currentPostion,
            prevPostion: prevPostion,
        }
    }
}

let isPressd = false;
canvas.addEventListener('mousedown', e => {
    isPressd = true;
    startPosition = {
        x: e.x,
        y: e.y
    };
});
canvas.addEventListener('mouseup', () => isPressd = false);

const render = () => {
    if (isPressd) draw();
    requestAnimationFrame(render);
}

const mouse = getMousePosition();
const draw = t => {

    // context.save();
    // context.setTransform(1, 0, 0, 1, 0, 0);
    // context.fillStyle = 'rgba(0,0,0,0.04)';
    // context.fillRect(0, 0, canvas.width, canvas.height);
    // context.restore();

    const {
        prevPostion,
        currentPostion,
    } = mouse.next().value;

    console.log(startPosition);
    const dist = Math.sqrt((startPosition.x - currentPostion.x) ** 2 + (startPosition.y - currentPostion.x) ** 2);
    context.strokeStyle = `hsl(${(currentPostion.x+currentPostion.y)%360},${dist%100}%,${dist%100}%)`;
    context.lineWidth = 4;

    const range = 3.14
    for (let i = 0; i < range; i++) {
        context.beginPath();
        if (prevPostion.x == 0 && prevPostion.y == 0)
            context.moveTo(currentPostion.x, currentPostion.y);
        else
            context.moveTo(prevPostion.x, prevPostion.y);
        context.lineTo(currentPostion.x, currentPostion.y);
        context.stroke();
        context.closePath();
        context.rotate(Math.PI / 180 * 360 / range);
    }
}

render();