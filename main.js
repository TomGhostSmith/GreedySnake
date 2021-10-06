var wid, hei;
var widNum, heiNum;
var canvas = document.getElementById("myCanvas");
var snake = [];
var c = document.getElementById("myCanvas");
var mainTimer;
var nextDirection = 0;
var food = new Object();
var sequence = ['L', 'A', 'D', 'E', 'R', 'V', 'A', 'V', 'D', 'A', 'F', 'V', 'E', 'L', 'A', 'H', 'A', 'V', 'V', 'I', 'L', 'K', 'G', 'M', 'L', 'D', 'A', 'E', 'G', 'H', 'L', 'N', 'G', 'Q', 'A', 'L', 'R', 'V', 'W', 'A', 'Y', 'A', 'G', 'D', 'L', 'Y', 'A', 'N', 'G', 'Q', 'L', 'W', 'K', 'L', 'R', 'L', 'A', 'W', 'V', 'Y', 'L', 'A', 'D', 'E', 'R', 'V', 'A', 'V', 'D', 'A', 'F', 'V', 'E', 'L', 'A', 'H', 'A', 'V', 'V', 'I', 'L', 'K', 'G', 'M', 'L', 'D', 'A', 'E', 'G', 'H', 'L', 'N', 'G', 'Q', 'A', 'L', 'R', 'V', 'W', 'A', 'Y', 'A', 'G', 'D', 'L', 'Y', 'A', 'N', 'G', 'Q', 'L', 'W', 'K', 'L', 'R', 'L', 'A', 'W', 'V', 'Y']
    // var ctx = c.getContext("2d");

function Initiate() {
    wid = parseInt(document.body.clientWidth);
    hei = parseInt(document.body.clientHeight);
    widNum = parseInt(wid / 30) - 1;
    heiNum = parseInt(hei / 30) - 6;
    canvas.style.width = widNum * 30 + "px";
    canvas.style.height = heiNum * 30 + "px";
    AddLength(parseInt(widNum / 2), parseInt(heiNum / 2), 'B', 0);
    AddLength(parseInt(widNum / 2), parseInt(heiNum / 2) + 1, 'G', 0);
    AddLength(parseInt(widNum / 2), parseInt(heiNum / 2) + 2, 'V', 0);
    CreateFood();
    Draw();
}

function Pumped(nextx, nexty) {
    var result = false;
    if (nextx < 0 || nextx > widNum || nexty < 0 || nexty > heiNum) {
        result = true;
        return result;
    }
    for (i = 1; i < snake.length; i++) {
        if (nextx == snake[i].x && nexty == snake[i].y) {
            result = true;
            break;
        }
    }
    return result;
}

function Forward() {
    var len = snake.length;

    var nextx, nexty;
    switch (nextDirection) {
        case 0:
            nextx = snake[0].x
            nexty = snake[0].y - 1;
            break;
        case 3:
            nextx = snake[0].x + 1;
            nexty = snake[0].y;
            break;
        case 6:
            nextx = snake[0].x
            nexty = snake[0].y + 1;
            break;
        case 9:
            nextx = snake[0].x - 1;
            nexty = snake[0].y;
            break;
    }

    if (nextx == food.x && nexty == food.y) {
        var newBody = new Object();
        newBody.x = food.x;
        newBody.y = food.y;
        newBody.protein = 'B';
        newBody.obj = food.obj;
        newBody.direction = nextDirection;
        snake.unshift(newBody);
        snake[1].protein = food.protein;
        CreateFood();
    } else if (Pumped(nextx, nexty)) {
        clearInterval(mainTimer);
        alert("You failed.");
    } else {
        for (i = len - 1; i > 0; i--) {
            snake[i].x = snake[i - 1].x;
            snake[i].y = snake[i - 1].y;
            snake[i].direction = snake[i - 1].direction;
        }
        snake[0].x = nextx;
        snake[0].y = nexty;
        snake[0].direction = nextDirection;
    }
    nextDirection = snake[0].direction;

}

function AddLength(xLoad, yLoad, proteinLoad, directionLoad) { // 在尾上加
    var len = snake.length;
    snake[len] = new Object();
    snake[len].x = xLoad;
    snake[len].y = yLoad;
    snake[len].protein = proteinLoad;
    snake[len].obj = document.createElement("img");
    snake[len].direction = directionLoad;
    canvas.appendChild(snake[len].obj);
}


function CreateFood() {
    var found = false; // 发现重叠
    while (1) {
        found = false;
        food.x = parseInt(Math.random() * widNum);
        food.y = parseInt(Math.random() * heiNum);
        for (i = 0; i < snake.length; i++) {
            if (food.x == snake[i].x && food.y == snake[i].y) {
                found = true;
                break;
            }
        }
        if (found == false) break;
    }
    if (sequence.length > 0) {
        food.protein = sequence.shift();
        food.obj = document.createElement("img");
        canvas.appendChild(food.obj);
        food.obj.style.left = food.x * 30 + "px";
        food.obj.style.top = food.y * 30 + "px";
        food.obj.src = food.protein + "1.png";
    } else {
        alert("You finished the task!");
    }
}

function Draw() {

    for (i = 0; i < snake.length; i++) {
        snake[i].obj.style.left = snake[i].x * 30 + "px";
        snake[i].obj.style.top = snake[i].y * 30 + "px";
        snake[i].obj.src = snake[i].protein + ".png";
        snake[i].obj.classList.remove("up");
        snake[i].obj.classList.remove("left");
        snake[i].obj.classList.remove("right");
        switch (snake[i].direction) {
            case 0:
            case 6:
                if (snake[i].x < widNum / 2) {
                    snake[i].obj.classList.add("left");
                } else {
                    snake[i].obj.classList.add("right");
                }
                break;
            case 3:
            case 9:
                if (snake[i].y < heiNum / 2) {
                    snake[i].obj.classList.add("up");
                }
                break;
        }
    }
}


document.onkeydown = function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var keyCode = e.keyCode;
    switch (keyCode) {
        case 39: // right
            if (snake[0].direction != 9) nextDirection = 3;
            break;
        case 40: // down
            if (snake[0].direction != 0) nextDirection = 6;
            break;
        case 37: // left
            if (snake[0].direction != 3) nextDirection = 9;
            break;
        case 38: // up
            if (snake[0].direction != 6) nextDirection = 0;
            break;
    }
}
Initiate()

function Start() {
    mainTimer = setInterval(() => {
        Forward();
        Draw();
    }, 150);
}

function End() {
    clearInterval(mainTimer);
}

function Left() {
    if (snake[0].direction != 3) nextDirection = 9;
}

function Right() {
    if (snake[0].direction != 9) nextDirection = 3;
}

function Up() {
    if (snake[0].direction != 6) nextDirection = 0;
}

function Down() {
    if (snake[0].direction != 0) nextDirection = 6;
}