const canva = document.getElementById('can');
const ctx = canva.getContext('2d');



//rozmiar canvy
canva.height = 800;
canva.width = 700;

//rozmiar paletki
const paddleH = 20;
const paddleW = 120;

//pozycja paletek
let playerX = canva.width / 2 - paddleW / 2;
const playerY = 760;

//rozmiar canvy
const canvaW = canva.width;
const canvaH = canva.height;

//rozmiar piłki
const ballSize = 20;
var radius = 10;

//pozycja piłki
let ballX = canvaW / 2 - ballSize / 2;
let ballY = canvaH / 2 - ballSize / 2;

//prędkość piłki
let ballSpeedX = 2;
let ballSpeedY = 2;

//tablica elementów do zbicia
var rectArray = null;

//ukrywanie kursora, żeby nie był widoczny na canvie
document.getElementById('can').style.cursor = "none";

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

    if (ballY <= 0 || ballY + ballSize >= canvaH) {
        ballSpeedY = -ballSpeedY;
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

//rysowanie stołu i lini środkowej
function drawTable() {
    //rysujemy stół
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvaW, canvaH);
}

//rysowanie paletki gracza
function drawPaddlePlayer() {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(playerX, playerY, paddleW, paddleH);
}

canva.addEventListener("mousemove", playserPositon);
function playserPositon(event) {
    playerX = event.clientX - canva.offsetLeft - paddleW / 2;

    //jeżeli paletka chce wyjechać za canve od dołu ustawiamy wysokość na (canvaH - paddleH)
    if (playerX >= canvaW - paddleW) {
        playerX = canvaW - paddleW;
    }

    //jeżeli paletka chce wyjechać za canve od góry usatwiamy wysokość na 0
    if (playerX <= 0) {
        playerX = 0;
    }
}
var stop = false;
function game() {
    if (!stop) {
        drawTable();
        drawBall();
        drawRect();
        drawPaddlePlayer();

        for (var i = 0; i < rectArray.length; i++) {
            for (var j = 0; j < rectArray[i].length; j++) {
                if (rectArray[i][j].Visibility) {
                    rectArray[i][j].Visibility = !collisionCheckCircleRect(circle, rectArray[i][j]);
                }

            }
        }
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
        console.log("a");
        return true;
    }
    if (distY <= (rect.size.height / 2)) {
        ballSpeedX = -ballSpeedX;
        console.log("b");
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