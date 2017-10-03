const canva = document.getElementById('can');
const ctx = canva.getContext('2d');

//rozmiar canvy
canva.height = 800;
canva.width = 900;

//paletka użytkownika
let playerRect = new Panel(canva.width / 2 - 120 / 2, 760, 120, 20, "green");

//paletka użytkownika
let mousePosition = new Panel(canva.width / 2 - 120 / 2, 760, 120, 20, "green");

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

//tablica punktów do pokazania na stole
var rectPointArray = new Array(0);

//keyDown code. Kiedy naciśniemy strzałkę na klawiaturze to wpisujemy tam kod tej strzałki. Gry podnosimy palec z klawisza i anstępuje keyUp to ustawiamy -1;
let keyDownCode = -1;

// Create gradient
grd = ctx.createLinearGradient(0.000, 0.000, canvaW, canvaH);

// Add colors
grd.addColorStop(0.000, 'rgba(178, 178, 178, 1.000)');
grd.addColorStop(0.998, 'rgba(0, 0, 0, 0.792)');

//koordynaty gwiazdek pokazywanych po zwycięstwie
let winPath = ['m197.084991,305.50278l25.973885,0l8.02613,-22.918036l8.026135,22.918036l25.973881,0l-21.013276,14.163963l8.026546,22.918036l-21.013285,-14.164349l-21.013281,14.164349l8.026548,-22.918036l-21.013283,-14.163963z',
                'm196.084991,153.50278l25.973885,0l8.026131,-22.918036l8.026135,22.918036l25.97388,0l-21.013276,14.163963l8.026546,22.918036l-21.013285,-14.164349l-21.013281,14.164349l8.026548,-22.918036l-21.013283,-14.163963z',
                'm311.084991,229.50278l25.973885,0l8.026131,-22.918036l8.026135,22.918036l25.97388,0l-21.013276,14.163963l8.026546,22.918036l-21.013285,-14.164349l-21.013281,14.164349l8.026548,-22.918036l-21.013283,-14.163963z',
                'm427.084991,306.50278l25.973885,0l8.026131,-22.918036l8.026135,22.918036l25.97388,0l-21.013276,14.163963l8.026546,22.918036l-21.013285,-14.164349l-21.013281,14.164349l8.026548,-22.918036l-21.013283,-14.163963z',
                'm312.084991,383.50278l25.973885,0l8.026131,-22.918036l8.026135,22.918036l25.97388,0l-21.013276,14.163963l8.026546,22.918036l-21.013285,-14.164349l-21.013281,14.164349l8.026548,-22.918036l-21.013283,-14.163963z',
                'm425.084991,152.50278l25.973885,0l8.026131,-22.918036l8.026135,22.918036l25.97388,0l-21.013276,14.163963l8.026546,22.918036l-21.013285,-14.164349l-21.013281,14.164349l8.026548,-22.918036l-21.013283,-14.163963z'];

//piłeczka
var circle = {
    x: ballX,
    y: ballY,
    r: radius
};

//położenie pierwszego elementu
var rect = {
    x: 50,
    y: 50,
    w: 60,
    h: 20
};

//zmienna, gdy ustawiona na true oznacza zatrzymanie gry z jakiegoś powodu np. zwycięstwa/przegranej
var stop = true;

//zmienna, gdy ustawiona na true oznacza włączenie pierwszego ekranu
var firstScreen = true;

//lista kolorów jakie posiadają elementy
let arrayColors = new Array("green", "red", "yellow", "blue", "purple", "pink");

//słownik (nazwa koloru/ilość punktów) - chyba do zmiany
var ColorEnum = Object.freeze({
    "green": 60,
    "red": 50,
    "yellow": 40,
    "blue": 30,
    "purple": 20,
    "pink": 10
})

//liczba punktów zdobytych przez użytkownika
var points = 0;

//tworzenie tablicy dwuwymiariwej z prostokątami do zbicia
rectArray = createArray(6, 10);

//rysowanie piłki
function drawBall() {
    ctx.beginPath();

    ctx.arc(ballX + 10, ballY + 10, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();

    ballY += ballSpeedY;
    ballX += ballSpeedX;

    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }
    else if (ballY + ballSize >= canvaH) {
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

//funkcja tworzy tablicę dwuwymiarową elementów, które należy zbić
function createArray(h, w) {
    var arr = new Array(h);

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
                ctx.lineWidth = 2;
                ctx.fillStyle = p.color;

                roundRect(ctx, p.position.X, p.position.Y, p.size.width, p.size.height, 8, true);
            }

        }
    }
}

//rysowanie stołu
function drawTable() {
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvaW, canvaH);
}

//rysowanie prostokąta z prawej strony z liczbbą punktów etc.
function drawTableRight() {
    //rysujemy "menu" po prawej stronie stołu
    ctx.fillStyle = 'gray';
    ctx.fillRect(canvaW, 0, 200, canvaH);

    ctx.fillStyle = 'white';
    //rysujemy punktację
    ctx.font = "30px Arial";
    ctx.fillText("Punkty:", canvaW + 20, 50);
    ctx.fillText(points, canvaW + 20, 80);
    //rysujemy numer poziomu
    ctx.fillText("Poziom:", canvaW + 20, 130);
    ctx.fillText("1", canvaW + 20, 160);
    //rysujemy ilość pozostałych kul
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
    if (keyDownCode != -1) {
        if (keyDownCode == 37) {
            //lewa strzałka
            playerRect.position.X -= 9;

            //jeżeli paletka chce wyjechać za canve z lewej strony, to usatwiamy szerokość na 0 
            if (playerRect.position.X <= 0) {
                playerRect.position.X = 0;
            }
        }
        else if (keyDownCode == 39) {
            //prawa strzałka
            playerRect.position.X += 9;

            //jeżeli paletka chce wyjechać za canve z prawej strony, to usatwiamy szerokość canvaW - playerRect.size.width
            if (playerRect.position.X >= canvaW - playerRect.size.width) {
                playerRect.position.X = canvaW - playerRect.size.width;
            }
        }
    }

    //rysowanie paletki
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(playerRect.position.X, playerRect.position.Y, playerRect.size.width, playerRect.size.height);
}

//event mouse move dla ustalenia pozycji myszki
canva.addEventListener("mousemove", playserPositon);
function playserPositon(event) {
    playerRect.position.X = event.clientX - canva.offsetLeft - playerRect.size.width / 2;
    mousePosition.position.X = event.clientX - canva.offsetLeft;
    mousePosition.position.Y = event.clientY - canva.offsetTop;

    //jeżeli paletka chce wyjechać za canve z lewej strony, to usatwiamy szerokość na 0 
    if (playerRect.position.X >= canvaW - playerRect.size.width) {
        playerRect.position.X = canvaW - playerRect.size.width;
    }

    //jeżeli paletka chce wyjechać za canve z prawej strony, to usatwiamy szerokość canvaW - playerRect.size.width
    if (playerRect.position.X <= 0) {
        playerRect.position.X = 0;
    }
}

//funkcja rozpoczynająca grę
function game() {
    if (!stop) {
        //początek gry
        zmiana = false;
        ctx.clearRect(0, 0, canva.width, canva.height);
        drawTable();
        drawTableRight();
        drawBall();
        drawRect();
        drawPaddlePlayer();
        detectCollision();
        drwaTbalePoint();
    }
    else if (firstScreen) {
        //gra podczas wyboru poziomu trudności
        zmiana = false;
        ctx.clearRect(0, 0, canva.width, canva.height);

        drawTable();
        drawTableRight();
        drawBall();
        drawRect();
        drawPaddlePlayer();
        detectCollision();
        drwaTbalePoint();

        //Napis PINOID
        ctx.fillStyle = 'white';
        ctx.font = '130px sefri';
        ctx.fillText('PINOID', 130, 280);

        //POZIOM trudności
        if (mousePosition.position.X >= easy.x && mousePosition.position.X <= easy.x + easy.w
            && mousePosition.position.Y >= easy.y && mousePosition.position.Y <= easy.y + easy.h) {

            ctx.fillStyle = "white";
            roundRect(ctx, easy.x, easy.y, easy.w, easy.h, 20, true);

            ctx.fillStyle = 'black';
            ctx.font = '60px sefri';
            ctx.fillText('ŁATWY', 250, 440);
        }
        else {
            ctx.fillStyle = 'white';
            ctx.font = '60px sefri';
            ctx.fillText('ŁATWY', 250, 440);
        }

        if (mousePosition.position.X >= normal.x && mousePosition.position.X <= normal.x + normal.w
            && mousePosition.position.Y >= normal.y && mousePosition.position.Y <= normal.y + normal.h) {

            ctx.fillStyle = "white";
            roundRect(ctx, normal.x, normal.y, normal.w, normal.h, 20, true);

            ctx.fillStyle = 'black';
            ctx.font = '60px sefri';
            ctx.fillText('NORMALNY', 175, 510);
        }
        else {
            ctx.fillStyle = 'white';
            ctx.font = '60px sefri';
            ctx.fillText('NORMALNY', 175, 510);
        }

        if (mousePosition.position.X >= hard.x && mousePosition.position.X <= hard.x + hard.w
            && mousePosition.position.Y >= hard.y && mousePosition.position.Y <= hard.y + hard.h) {

            ctx.fillStyle = "white";
            roundRect(ctx, hard.x, hard.y, hard.w, hard.h, 20, true);

            ctx.fillStyle = 'black';
            ctx.font = '60px sefri';
            ctx.fillText('TRUDNY', 225, 580);
        }
        else {
            ctx.fillStyle = 'white';
            ctx.font = '60px sefri';
            ctx.fillText('TRUDNY', 225, 580);
        }
    }
}

easy = {
    x: 240,
    y: 390,
    w: 225,
    h: 60
};

normal = {
    x: 165,
    y: 460,
    w: 365,
    h: 60
};

hard = {
    x: 215,
    y: 530,
    w: 268,
    h: 60
};

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

//click event listener
canva.addEventListener('click', restartGame, false);

//function watch if user click to restart (only when variable stopGame is true)
function restartGame(e) {
    var p = getMousePos(e);

    if (p.x >= easy.x && p.x <= easy.x + easy.w &&
        p.y >= easy.y && p.y <= easy.y + easy.h) {

        ballCount = 3;
        points = 0;
        setAllRectVisible();

        firstScreen = false;
        stop = false;
    }
    else if (p.x >= normal.x && p.x <= normal.x + normal.w &&
        p.y >= normal.y && p.y <= normal.y + normal.h) {

        ballCount = 3;
        points = 0;
        setAllRectVisible();

        firstScreen = false;
        stop = false;
        ballSpeedX = 6;
        ballSpeedY = 6;
    }
    else if (p.x >= hard.x && p.x <= hard.x + hard.w &&
        p.y >= hard.y && p.y <= hard.y + hard.h) {

        ballCount = 3;
        points = 0;
        setAllRectVisible();

        firstScreen = false;
        stop = false;
        ballSpeedX = 8;
        ballSpeedY = 8;
    }
}

//function returns mouse position
function getMousePos(e) {
    var r = canva.getBoundingClientRect();
    return {
        x: e.clientX - r.left,
        y: e.clientY - r.top
    };
}

//funkcja rysuje punkty na stole po zniszczeniu prostokąta
function drwaTbalePoint() {
    if (rectPointArray != null) {
        for (var i = 0; i < rectPointArray.length; i++) {
            if (rectPointArray[i].elapsedTime > 0) {
                ctx.font = "bold 16px Arial";
                ctx.fillStyle = 'white';
                ctx.fillText("+ " + rectPointArray[i].amount, rectPointArray[i].X, rectPointArray[i].Y);
                rectPointArray[i].elapsedTime -= 1;
            }
            else {
                rectPointArray.splice(i, 1);
            }
        }
    }
}

//ustawia wszystkie prostokąty na widoczne (ma zastosowanie na początku gry)
function setAllRectVisible() {
    for (var i = 0; i < rectArray.length; i++) {
        for (var j = 0; j < rectArray[i].length; j++) {
            rectArray[i][j].Visibility = true;
        }
    }
}

//funkcja wykrywająca kolizje pomiędzy kulą, a prostokątami
function detectCollision() {
    //jeżeli 'anyVisible' zostało ustawione na true oznacza to, że pozostały jeszcze jakieś elementy do zbicia i gra ma być kontynuowana. W przeciwnym wypadku grę zatrzymujemy.
    let anyVisible = false;
    //wykrywamy kolizję prostokątów, czy któryś został zbity
    for (var i = 0; i < rectArray.length; i++) {
        for (var j = 0; j < rectArray[i].length; j++) {
            if (rectArray[i][j].Visibility) {
                anyVisible = true;
                rectArray[i][j].Visibility = !collisionCheckCircleRect(circle, rectArray[i][j]);
                if (!rectArray[i][j].Visibility) {
                    if (rectArray[i][j].color == arrayColors[0]) {
                        points += ColorEnum.green;
                        rectPointArray.push(new TablePoint(rectArray[i][j].position.X, rectArray[i][j].position.Y, ColorEnum.green));
                    }
                    else if (rectArray[i][j].color == arrayColors[1]) {
                        points += ColorEnum.red;
                        rectPointArray.push(new TablePoint(rectArray[i][j].position.X, rectArray[i][j].position.Y, ColorEnum.red));
                    }
                    else if (rectArray[i][j].color == arrayColors[2]) {
                        points += ColorEnum.yellow;
                        rectPointArray.push(new TablePoint(rectArray[i][j].position.X, rectArray[i][j].position.Y, ColorEnum.yellow));
                    }
                    else if (rectArray[i][j].color == arrayColors[3]) {
                        points += ColorEnum.blue;
                        rectPointArray.push(new TablePoint(rectArray[i][j].position.X, rectArray[i][j].position.Y, ColorEnum.blue));
                    }
                    else if (rectArray[i][j].color == arrayColors[4]) {
                        points += ColorEnum.purple;
                        rectPointArray.push(new TablePoint(rectArray[i][j].position.X, rectArray[i][j].position.Y, ColorEnum.purple));
                    }
                    else if (rectArray[i][j].color == arrayColors[5]) {
                        points += ColorEnum.pink;
                        rectPointArray.push(new TablePoint(rectArray[i][j].position.X, rectArray[i][j].position.Y, ColorEnum.pink));
                    }

                }
            }
        }
    }

    //sprawdzamy kolizję paletki
    collisionCheckCircleRect(circle, playerRect);

    //anyVisible - jeśli ustawione na false, oznacza to ze żaden element nie jest już widoczny (zwycięstwo gracza)
    if (!anyVisible) {
        stop = true;

        ctx.lineWidth = 22;
        let grd1 = ctx.createRadialGradient(350.000, 350.000, 0.000, 350.000, 350.000, 350.000);

        // Add colors
        grd1.addColorStop(0.000, 'rgba(255, 255, 0, 1.000)');
        grd1.addColorStop(1.000, 'rgba(255, 170, 86, 1.000)');
        ctx.strokeStyle = grd1;

        var path2 = new Path2D(winPath[0]);
        ctx.stroke(path2);
        path2 = new Path2D(winPath[1]);
        ctx.stroke(path2);
        path2 = new Path2D(winPath[2]);
        ctx.stroke(path2);
        path2 = new Path2D(winPath[3]);
        ctx.stroke(path2);
        path2 = new Path2D(winPath[4]);
        ctx.stroke(path2);
        path2 = new Path2D(winPath[5]);
        ctx.stroke(path2);


        ctx.font = "bold 66px Arial";
        ctx.fillStyle = 'rgba(255, 255, 0, 1.000)';
        ctx.fillText("ZWYCIĘSTWO", 120, 580);

        ctx.lineWidth = 1;
    }
}

//zmienna wykorzystywana podczas detekcji kolizji
let zmiana = false;

//początek gry
setInterval(game, 1000 / 60);

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
        if (!zmiana) {
            ballSpeedY = -ballSpeedY;
            zmiana = true;
        }
        return true;
    }
    if (distY <= (rect.size.height / 2)) {
        if (!zmiana) {
            ballSpeedX = -ballSpeedX;
            zmiana = true;
        }
        return true;
    }

    var dx = distX - rect.size.width / 2;
    var dy = distY - rect.size.height / 2;
    if (dx * dx + dy * dy <= (circle.r * circle.r)) {
        console.log("3");

        if (!zmiana) {
            ballSpeedX = -ballSpeedX;
            zmiana = true;
        }
        return true;
    }
    else {
        return false;
    }
}

//event reagujący na przyciśnięcie przycisku na klawiaturze
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 68) {
        if (!stop)
            stop = true;
        else
            stop = false;
    }
    else if (event.keyCode == 37 || event.keyCode == 39) {
        keyDownCode = event.keyCode;
    }
});

//event reagujący na podniesienia palca z klawiatury (ustawiamy wtedy zmienną keyDownCode na -1)
document.addEventListener('keyup', function (event) {
    keyDownCode = -1;
});

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

//class tell us where is start point of element
function TablePoint(x, y, amount) {
    this.X = x + 12;
    this.Y = y + 16;
    this.amount = amount;
    this.elapsedTime = 200;
}