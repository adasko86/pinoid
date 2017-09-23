const canva = document.getElementById('can');
const ctx = canva.getContext('2d');



//rozmiar canvy
canva.height = 800;
canva.width = 900;

////rozmiar paletki
//const paddleH = 20;
//const paddleW = 120;

////pozycja paletek
//let playerX = canva.width / 2 - paddleW / 2;
//const playerY = 760;

let playerRect = new Panel(canva.width / 2 - 120 / 2, 760, 120, 20, "green");

//rozmiar canvy
const canvaW = canva.width - 200;
const canvaH = canva.height;

//rozmiar piłki
const ballSize = 20;
var radius = 10;

//pozycja piłki
let ballX = canvaW / 2 - ballSize / 2;
let ballY = canvaH / 2 - ballSize / 2;

//prędkość piłki
let ballSpeedX = 4;
let ballSpeedY = 4;

//ilość kul
let ballCount = 3;

//tablica elementów do zbicia
var rectArray = null;

//ukrywanie kursora, żeby nie był widoczny na canvie
//document.getElementById('can').style.cursor = "none";

var circle = {
    x: ballX,
    y: ballY,
    r: radius
};

var rect = {
    x: 50,
    y: 50,
    w: 60,
    h: 20
};

//rysowanie piłki
function drawBall() {
    //ctx.fillStyle = 'white';
    //ctx.fillRect(ballX, ballY, ballSize, ballSize);


    ctx.beginPath();

    ctx.arc(ballX + 10, ballY + 10, radius, 0, 2 * Math.PI, false);
    //ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();

    ballY += ballSpeedY;
    ballX += ballSpeedX;

    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }
    else if (ballY + ballSize >= canvaH) {
        //console.log("wwwwww");
        ballSpeedY = -ballSpeedY;
        ballCount -= 1;
        if (ballCount == 0) {
            //alert("Przegrałeś");
            drawTableRight();
            stop = true;
        }
    }
    if (ballX <= 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballSize >= canvaW) {
        ballSpeedX = -ballSpeedX;
    }
    circle.x = ballX;
    circle.y = ballY;
}

let arrayColors = new Array("green", "red", "yellow", "blue", "purple", "pink");

//
function createArray(h, w) {
    var arr = new Array(h);
    //i = arr.length;

    if (arr.length > 1) {
        for (var i = 0; i < arr.length; i++) {
            arr[i] = new Array(w);
            for (var j = 0; j < arr[i].length; j++) {
                let p = new Panel(rect.w * j + rect.y, rect.h * i + rect.x, rect.w, rect.h, arrayColors[i]);
                arr[i][j] = p;
            }
        }
    }

    return arr;
}


//funkcja rysująca panele na stole
function drawRect() {
    for (var i = 0; i < rectArray.length; i++) {
        for (var j = 0; j < rectArray[i].length; j++) {
            let p = rectArray[i][j];
            if (p.Visibility) {
                ctx.strokeStyle = "white";
                ctx.fillStyle = p.color;
                ctx.stroke();
                ctx.fillRect(p.position.X, p.position.Y, p.size.width, p.size.height);
                ctx.strokeRect(p.position.X, p.position.Y, p.size.width, p.size.height);
            }

        }
    }
}

var ColorEnum = Object.freeze({
    "green": 60,
    "red": 50,
    "yellow": 40,
    "blue": 30,
    "purple": 20,
    "pink": 10
})

var points = 0;

//rysowanie stołu i lini środkowej
function drawTable() {
    //rysujemy stół
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvaW, canvaH);
}

//rysowanie stołu i lini środkowej
function drawTableRight() {
    //rysujemy stół
    ctx.fillStyle = 'gray';
    ctx.fillRect(canvaW, 0, 200, canvaH);

    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.fillText("Punkty:", canvaW + 20, 50);
    ctx.fillText(points, canvaW + 20, 80);
    ctx.fillText("Poziom:", canvaW + 20, 130);
    ctx.fillText("1", canvaW + 20, 160);
    ctx.fillText("Kule:", canvaW + 20, 210);
    if (ballCount == 3) {

        ctx.beginPath();
        ctx.arc(canvaW + 30, 230, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(canvaW + 60, 230, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(canvaW + 90, 230, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    else if (ballCount == 2) {

        ctx.beginPath();
        ctx.arc(canvaW + 30, 230, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(canvaW + 60, 230, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    else if (ballCount == 1) {

        ctx.beginPath();
        ctx.arc(canvaW + 30, 230, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}

//rysowanie paletki gracza
function drawPaddlePlayer() {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(playerRect.position.X, playerRect.position.Y, playerRect.size.width, playerRect.size.height);
}

canva.addEventListener("mousemove", playserPositon);
function playserPositon(event) {
    playerRect.position.X = event.clientX - canva.offsetLeft - playerRect.size.width / 2;

    //jeżeli paletka chce wyjechać za canve od dołu ustawiamy wysokość na (canvaH - paddleH)
    if (playerRect.position.X >= canvaW - playerRect.size.width) {
        playerRect.position.X = canvaW - playerRect.size.width;
    }

    //jeżeli paletka chce wyjechać za canve od góry usatwiamy wysokość na 0
    if (playerRect.position.X <= 0) {
        playerRect.position.X = 0;
    }
}
var stop = false;
function game() {
    if (!stop) {
        drawTable();
        drawTableRight();
        drawBall();
        drawRect();
        drawPaddlePlayer();
        detectCollision();
    }
}

function detectCollision() {
    let anyVisible = false;
    for (var i = 0; i < rectArray.length; i++) {
        for (var j = 0; j < rectArray[i].length; j++) {
            if (rectArray[i][j].Visibility) {
                anyVisible = true;
                rectArray[i][j].Visibility = !collisionCheckCircleRect(circle, rectArray[i][j]);
                if(!rectArray[i][j].Visibility)
                {
                    if (rectArray[i][j].color == arrayColors[0])
                    { points += ColorEnum.green;}
                    else if (rectArray[i][j].color == arrayColors[1])
                    { points += ColorEnum.red; }
                    else if (rectArray[i][j].color == arrayColors[2])
                    { points += ColorEnum.yellow; }
                    else if (rectArray[i][j].color == arrayColors[3])
                    { points += ColorEnum.blue; }
                    else if (rectArray[i][j].color == arrayColors[4])
                    { points += ColorEnum.purple; }
                    else if (rectArray[i][j].color == arrayColors[5])
                    { points += ColorEnum.pink; }

                }
            }
        }
    }
    collisionCheckCircleRect(circle, playerRect);

    //anyVisible - jeśli ustawione na false, oznacza to ze żaden element nie jest już widoczny (zwycięstwo gracza)
    if (!anyVisible) {
        stop = true;
    }
}

rectArray = createArray(6, 10);
//drawRect();
setInterval(game, 1000 / 100);

//początek gry
function startgame(difficult) {
    let modalclass = document.getElementsByClassName('modal');
    modalclass[0].style.display = "none";
}

//funkcja sprawdzająca kolizje
function collisionCheckCircleRect(circle, rect) {

    var distX = Math.abs(circle.x + 10 - rect.position.X - rect.size.width / 2);
    var distY = Math.abs(circle.y + 10 - rect.position.Y - rect.size.height / 2);

    if (distX > (rect.size.width / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.size.height / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.size.width / 2)) {
        ballSpeedY = -ballSpeedY;
        //console.log("a");
        return true;
    }
    if (distY <= (rect.size.height / 2)) {
        ballSpeedX = -ballSpeedX;
        //console.log("b");
        return true;
    }

    var dx = distX - rect.size.width / 2;
    var dy = distY - rect.size.height / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

//klasa reprezentująca obiekt panelu, który ma zostać "zniszczony" przez piłkę
function Panel(x, y, width, height, color) {
    this.position = new _point(x, y);
    this.size = new _size(width, height);
    this.color = color;
    this.hardnessDegree = 1;
    this.actualHardnessDegree = 1;
    this.Visibility = true;
}

//class tell us where is start point of element
function _point(x, y) {
    this.X = x;
    this.Y = y;
}

//class tell us what size have element
function _size(width, height) {
    this.width = width;
    this.height = height;
}