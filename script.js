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

//ukrywanie kursora, żeby nie był widoczny na canvie
document.getElementById('can').style.cursor = "none";

var circle = {
    x: ballX,
    y: ballY,
    r: radius
};

var rect = {
    x: 0,
    y: 0,
    w: 500,
    h: 300
};

//rysowanie piłki
function drawBall() {
    ctx.fillStyle = 'white';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);


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


    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

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
        drawPaddlePlayer();

        stop = collisionCheckCircleRect(circle, rect);
    }
}

setInterval(game, 1000 / 100);

//początek gry
function startgame(difficult) {
    let modalclass = document.getElementsByClassName('modal');
    modalclass[0].style.display = "none";
}

//funkcja sprawdzająca kolizje
function collisionCheckCircleRect(circle, rect) {
    var distX = Math.abs(circle.x + 10 - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y + 10 - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

//funkcja rysująca panele na stole
function paintPanel() {

}

//klasa reprezentująca obiekt panelu, który ma zostać "zniszczony" przez piłkę
function Panel() {
    this.position = new point();
    this.size = new size();
    this.color = "#FF0000";
    this.hardnessDegree = 1;
    this.actualHardnessDegree = 1;
}

//class tell us where is start point of element
function point() {
    this.X = 0;
    this.Y = 0;
}

//class tell us what size have element
function size() {
    this.width = 0;
    this.height = 0;
}