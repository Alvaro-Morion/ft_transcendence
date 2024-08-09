import Player from './player.js';
import AIPlayer from './aiplayer.js';

const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

let paddleWidth, paddleHeight, paddleSpeed, ballSize;
let player1, player2, ballX, ballY, ballSpeedX, ballSpeedY;
let player1_score = 0, player2_score=0;

function resizeCanvas() {
    // Set canvas width and height based on the window size
    canvas.width = window.innerWidth*.8; // 90% of the window width or height
    canvas.height = window.innerHeight*.8; // maintain a 2:1 aspect ratio
    canvas.width = Math.min(canvas.width, canvas.height*2);
    canvas.height = canvas.width / 2;

    // Update game element sizes
    paddleWidth = canvas.width * 0.02; // 2% of canvas width
    paddleHeight = canvas.height * 0.2; // 20% of canvas height
    paddleSpeed = canvas.height * 0.02; // 2% of canvas height

    // Initial positions
    player2 = new Player(canvas.width - paddleWidth, canvas.height, paddleHeight, paddleWidth, paddleSpeed);
    document.getElementById("player_right_name").innerText = player2.name;
    player1 = new AIPlayer(0, canvas.height, canvas.width, paddleHeight, paddleWidth, paddleSpeed);
    document.getElementById("player_left_name").innerText = player1.name;
    document.getElementById("player_left_photo").src = player1.image;
    
    //resetBall();

}

function resetBall()
{
    ballSize = canvas.width * 0.02; // 2% of canvas width
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (canvas.width * 0.005);
    if (Math.random() < 0.5)
        ballSpeedX *= -1; // 1% of canvas width per frame to either side
    ballSpeedY = ballSpeedX*1.5*(2*Math.random()-1); // a random value to change direction
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';

    // Dashed line ath the middle
    context.beginPath();
    context.setLineDash([canvas.height * .05, canvas.height * .1]); // Dash pattern: 5px dash, 15px space
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.lineWidth = canvas.width *.01;
    context.strokeStyle = 'white';
    context.stroke();
    context.setLineDash([]);

    // Draw paddles
    player1.draw(context);
    player2.draw(context);
    //aiplayer1.draw(context);

    // Draw ball
    context.beginPath();
    context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    context.fill();

    //Draw Scores

    context.font = canvas.height *.2 + "px Arial";
    context.textAlign = 'center';
    context.fillText(player1_score, canvas.width*.25, canvas.height*.5);
    context.fillText(player2_score, canvas.width*.75, canvas.height*.5);

    if (Math.max(player1_score, player2_score) === 10)
    {
        alert("Game Over");
    }
}

function move() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY < ballSize || ballY > canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    // Paddle collision
    if (ballX < paddleWidth && ballY >= player1.y && ballY <= player1.y + paddleHeight && ballSpeedX < 0) {
        ballSpeedX = -ballSpeedX + 0.0001*canvas.width;
    }
    if (ballX > canvas.width - paddleWidth - ballSize && ballY > player2.y && ballY < player2.y + paddleHeight && ballSpeedX > 0) {
        ballSpeedX = -ballSpeedX - 0.0001*canvas.width;
    }
    if (ballX < 0)
    {
        player2_score++;
        resetBall();
    }
    if (ballX > canvas.width)
    {
        player1_score++;
        resetBall();
    }
    player1.calculate_move([ballX, ballY], [ballSpeedX, ballSpeedY]);
}

function gameLoop(){
        draw();
        move();
        requestAnimationFrame(gameLoop);
}

//Adjust canvas size on window resize
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
gameLoop();