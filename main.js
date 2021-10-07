var wid, hei;
var widNum, heiNum;
var canvas = document.getElementById("myCanvas");
var snake = [];
var c = document.getElementById("myCanvas");
var mainTimer;
var nextDirection = 0;
var food = new Object();
var description = document.getElementById("description");
var btn = document.getElementById("start");
var sequence = [];
var hasEnd;
var result = document.getElementById("result");
var all = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'];
// var ctx = c.getContext("2d");

function Initiate() {
    wid = parseInt(document.body.clientWidth) - 16;
    hei = parseInt(document.body.clientHeight);
    widNum = parseInt(wid / 30);
    heiNum = parseInt(hei / 30) - 10;
    canvas.style.width = widNum * 30 + "px";
    canvas.style.height = heiNum * 30 + "px";
    AddLength(parseInt(widNum / 2), parseInt(heiNum / 2), 'B', 0);
    // AddLength(parseInt(widNum / 2), parseInt(heiNum / 2) + 1, 'G', 0);
    // AddLength(parseInt(widNum / 2), parseInt(heiNum / 2) + 2, 'V', 0);
    CreateFood();
    Draw();
}

function Pumped(nextx, nexty) {
    var result = false;
    if (nextx < 0 || nextx >= widNum || nexty < 0 || nexty >= heiNum) {
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
        snake[1].obj.onclick = function() { ShowDetail(this.alt) };
        result.innerHTML = "长度：" + snake.length;
        if (snake.length == widNum * heiNum) {
            clearInterval(mainTimer);
            if (confirm("您已填满全部空间！是否观看我们项目的简介视频？") == true) {
                window.location.href = "https://video.igem.org/w/7nsVni1Fc2HXbewZ6U3quV";
            } else {
                alert("您可以刷新后选择不同难度再次挑战！");
                location.reload;
            }
        }
        if (CreateFood() == false) {
            Draw();
            clearInterval(mainTimer);
            btn.innerHTML = "继续";
            setTimeout(() => {
                if (confirm("您已完成该难度任务！是否观看我们项目的简介视频？") == true) {
                    window.location.href = "https://video.igem.org/w/7nsVni1Fc2HXbewZ6U3quV";
                } else {
                    alert("您可以刷新后选择不同难度再次挑战！");
                    location.reload;
                }
            }, 100);
        }
    } else if (Pumped(nextx, nexty)) {
        clearInterval(mainTimer);
        alert("啊哦，核糖体的翻译中断了。不要灰心，您可以调整方向，然后按继续按钮复活~");
        btn.innerHTML = "继续";
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
    snake[len].obj.onclick = function() { ShowDetail(this.alt) };
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
    if (hasEnd == false || sequence.length > 0) {
        if (hasEnd) {
            food.protein = sequence.shift();
        } else {
            food.protein = all[parseInt(Math.random() * 20)];
        }
        food.obj = document.createElement("img");
        canvas.appendChild(food.obj);
        food.obj.style.left = food.x * 30 + "px";
        food.obj.style.top = food.y * 30 + "px";
        food.obj.src = food.protein + "1.png";
    } else {
        return false;
    }
    return true;
}

function Draw() {

    for (i = 0; i < snake.length; i++) {
        snake[i].obj.style.left = snake[i].x * 30 + "px";
        snake[i].obj.style.top = snake[i].y * 30 + "px";
        snake[i].obj.src = snake[i].protein + ".png";
        snake[i].obj.alt = snake[i].protein;
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


function Start() {
    var description2 = document.getElementById("description2");
    if (description2.style.display == "none") {
        if (btn.innerHTML == "开始" || btn.innerHTML == "继续") {
            mainTimer = setInterval(() => {
                Forward();
                Draw();
            }, 300);
            btn.innerHTML = "暂停";
        } else {
            clearInterval(mainTimer);
            btn.innerHTML = "继续";
        }
    }
}

function Dictionary() {
    var description2 = document.getElementById("description2");
    if (description2.style.display == "none") {
        var description3 = document.getElementById("description3");
        clearInterval(mainTimer);
        btn.innerHTML = "继续";
        description3.style.display = "block";
    }
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

function CloseWindow() {
    description.style.display = "none";
}

function CloseWindow2() {
    var description2 = document.getElementById("description2");
    var select = document.getElementById("difficulty");
    description2.style.display = "none";
    switch (select.value) {
        case "1":
            hasEnd = true;
            sequence = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'];
            // sequence = ['A', 'C', 'D'];
            break;
        case "2":
            hasEnd = true;
            sequence = ['G', 'I', 'V', 'E', 'Q', 'C', 'C', 'T', 'S', 'I', 'C', 'S', 'L', 'Y', 'Q', 'L', 'E', 'N', 'Y', 'C', 'N', 'F', 'V', 'N', 'Q', 'H', 'L', 'C', 'G', 'S', 'H', 'L', 'V', 'E', 'A', 'L', 'Y', 'L', 'V', 'C', 'G', 'E', 'R', 'G', 'F', 'F', 'Y', 'T', 'P', 'K', 'T'];
            break;
        case "3":
            hasEnd = false;
            sequence = [];
            break;
    }
    alert("点击左上角“开始”以开启游戏~");
    Initiate();
}

function CloseWindow3() {
    var description3 = document.getElementById("description3");
    description3.style.display = "none";
}

function ShowDetail(protein) {
    var btn = document.getElementById("start");
    clearInterval(mainTimer);
    btn.innerHTML = "继续";

    var pic = document.getElementById("pic");
    var name = document.getElementById("name");
    var text = document.getElementById("text");
    description.style.display = "block"
    pic.src = protein + ".png";
    switch (protein) {
        case 'A':
            name.innerHTML = "丙氨酸";
            text.innerHTML = "生理作用：<br>预防肾结石、协助葡萄糖的代谢，有助缓和低血糖，改善身体能量。<br><br>富含丙氨酸的食品：<br>奶酪、巧克力和柑橘类食品";
            break;
        case 'G':
            name.innerHTML = "甘氨酸";
            text.innerHTML = "生理作用：<br>非人体必需氨基酸。如果甘氨酸的摄入量过多，不仅不会被吸收，还会影响其他氨基酸的吸收，从而影响健康。以甘氨酸为主要原料的乳制品，会影响青少年的生长发育。<br><br>富含甘氨酸的食品：<br>绿色蔬菜、动物内脏";
            break;
        case 'V':
            name.innerHTML = "缬氨酸";
            text.innerHTML = "生理作用：<br>必需氨基酸，促进人体对钙的吸收及积累,促进胃蛋白酶分泌,调节大脑神经及中枢神经。缬氨酸作用于黄体、乳腺及卵巢。<br><br>富含缬氨酸的食品：<br>谷物、奶制品、香菇、蘑菇等";
            break;
        case 'L':
            name.innerHTML = "亮氨酸";
            text.innerHTML = "一般用途：<br>必需氨基酸，作为营养增补剂、调味增香剂、降血糖剂。<br><br>富含亮氨酸的食品：<br>牛肉、猪肉、乳制品、牛奶";
            break;
        case 'I':
            name.innerHTML = "异亮氨酸";
            text.innerHTML = "生理作用：<br>必需氨基酸，参与胸腺、脾脏及脑下腺的调节以及代谢；脑下腺属总司令部作用于甲状腺、性腺。<br><br>富含异亮氨酸的食品：<br>鸡蛋、大豆、杏仁、黑米";
            break;
        case 'F':
            name.innerHTML = "苯丙氨酸";
            text.innerHTML = "生理作用：<br>必需氨基酸，是生产肾上腺素、甲状腺素和黑色素的原料，抑制癌瘤生长，降低药物的毒副作用。<br><br>富含苯丙氨酸的食品：<br>肉类和奶制品";
            break;
        case 'W':
            name.innerHTML = "色氨酸";
            text.innerHTML = "生理作用：<br>可参与动物体内血浆蛋白质的更新。<br><br>富含色氨酸的食品：<br>小米等";
            break;
        case 'Y':
            name.innerHTML = "酪氨酸";
            text.innerHTML = "生理作用：<br>酪氨酸是构成甲状腺素的重要成分，酪氨酸与神经元的传递有重要的关系。它常被用来治疗忧郁症，甲状腺机能降低，也有助于细胞长久保持年轻化，提高身体的免疫力。<br><br>富含酪氨酸的食品：<br>鱼类、全麦面包等";
            break;
        case 'D':
            name.innerHTML = "天冬氨酸";
            text.innerHTML = "生理作用：<br>绝大多数蛋白质合成路径的重要中介，若缺乏会造成营养不良，代谢紊乱等，不过人体内可以自行合成天冬氨酸。<br><br>富含天冬氨酸的食品：<br>绿芦笋、豆类、豆芽、梨、桃子、肉类等";
            break;
        case 'H':
            name.innerHTML = "组氨酸";
            text.innerHTML = "一般用途：<br>可作为生化试剂和药剂，还可用于治疗心脏病，贫血，风湿性关节炎等。<br><br>富含组氨酸的食品：<br>香蕉、葡萄、肉类、禽畜、牛奶等";
            break;
        case 'N':
            name.innerHTML = "天冬酰胺";
            text.innerHTML = "生理作用：<br>保护中枢神经系统，抗疲劳，提高运动的耐力。<br><br>富含天冬酰胺的食品：<br>绿芦笋、豆类、豆芽、梨、桃子、肉类等";
            break;
        case 'E':
            name.innerHTML = "谷氨酸";
            text.innerHTML = "生理作用：<br>为营养药物可用于皮肤和毛发。易与血氨形成谷酰氨，能解除代谢过程中氨的毒害作用，因而能预防和治疗肝昏迷，保护肝脏，是肝脏疾病患者的辅助药物。<br><br>富含谷氨酸的食品：<br>乳制品、肉类";
            break;
        case 'K':
            name.innerHTML = "赖氨酸";
            text.innerHTML = "生理作用：<br>必需氨基酸，促进大脑发育，是肝及胆的组成成分，能促进脂肪代谢，调节松果腺、乳腺、黄体及卵巢，防止细胞退化<br><br>富含赖氨酸的食品：<br>鱼类、肉类、蛋类、奶类以及豆制品";
            break;
        case 'Q':
            name.innerHTML = "谷氨酰胺";
            text.innerHTML = "生理作用：<br>有助于溃疡病灶的消除。同时，它能通过血脑屏障促进脑代谢，提高脑机能，与谷氨酸一样是脑代谢的重要营养剂。<br><br>富含谷氨酰胺的食品：<br>瘦肉制品、水产品、蛋类";
            break;
        case 'M':
            name.innerHTML = "甲硫氨酸";
            text.innerHTML = "生理作用：<br>必需氨基酸，参与组成血红蛋白、组织与血清，有促进脾脏、胰脏及淋巴的功能。<br><br>富含甲硫氨酸的食品：<br>大豆制品和肉类";
            break;
        case 'R':
            name.innerHTML = "精氨酸";
            text.innerHTML = "生理作用：<br>维持正常氮平衡与正常的生理功能，维持正常生长、发育，调节免疫功能．促进伤口愈合。<br><br>富含精氨酸的食品：<br>蔬菜与水产品";
            break;
        case 'S':
            name.innerHTML = "丝氨酸";
            text.innerHTML = "生理作用：<br>有助于免疫血球素和抗体的产生，维持健康的免疫系统。<br><br>富含丝氨酸的食品：<br>肉类及鱼类";
            break;
        case 'T':
            name.innerHTML = "苏氨酸";
            text.innerHTML = "生理作用：<br>必需氨基酸，参与组成血红蛋白、组织与血清，有促进脾脏、胰脏及淋巴的功能。<br><br>富含苏氨酸的食品：<br>大豆制品、水产品";
            break;
        case 'C':
            name.innerHTML = "半胱氨酸";
            text.innerHTML = "生理作用：<br>清除黑色素，生成抗氧化剂谷胱甘肽，排铅养颜。<br><br>富含半胱氨酸的食品：<br>家禽等肉类食品";
            break;
        case 'P':
            name.innerHTML = "脯氨酸";
            text.innerHTML = "一般用途：<br>用于营养不良、蛋白质缺乏症、严重胃肠道疾病，烫伤及外科手术后的蛋白质补充。<br><br>富含脯氨酸的食品：<br>萝卜、生菜、甜菜";
            break;
    }
}