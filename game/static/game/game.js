import Player from './player.js';
import AIPlayer from './aiplayer.js';
import Ball from './ball.js'


class Game{
    constructor(ai)
    {
        this.canvas = document.getElementById('pongCanvas');
        this.context = this.canvas.getContext('2d');
        this.player1_score = 0;
        this.player2_score = 0;
        this.ai = ai;
        document.getElementById("game_mode_menu").classList.add('d-none');
        document.getElementById("game").classList.remove('d-none');
        this.resizeCanvas(ai);
        this.canvas.classList.remove('d-none');
        this.gameInterval = setInterval(this.gameLoop.bind(this), 1000/60);
    }

    resizeCanvas(ai)
    {
        this.canvas.width = window.innerWidth*.8; // 90% of the window width or height
        this.canvas.height = window.innerHeight*.8; // maintain a 2:1 aspect ratio
        this.canvas.width = Math.min(this.canvas.width, this.canvas.height*2);
        this.canvas.height = this.canvas.width / 2;
        console.log(ai)
        this.player1 = ai ? new AIPlayer(this.canvas) : new Player(true, this.canvas, true);
        this.player2 = new Player(false, this.canvas, true);
        this.setPlayerID();
        this.ball = new Ball(this.canvas);
    }

    setPlayerID()
    {
        document.getElementById("player_left_name").innerText = this.player1.name;
        document.getElementById("player_right_name").innerText = this.player2.name;
    }

    drawCentralLine(){
        this.context.beginPath();
        this.context.setLineDash([this.canvas.height * .05, this.canvas.height * .1]);
        this.context.moveTo(this.canvas.width / 2, 0);
        this.context.lineTo(this.canvas.width / 2, this.canvas.height);
        this.context.lineWidth = this.canvas.width *.01;
        this.context.strokeStyle = 'white';
        this.context.stroke();
        this.context.setLineDash([]);
    }

    draw()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'white';
        this.drawCentralLine();
        this.player1.draw(this.context);
        this.player2.draw(this.context);
        this.ball.draw(this.context);
        this.context.font = this.canvas.height *.2 + "px Arial";
        this.context.textAlign = 'center';
        this.context.fillText(this.player1_score, this.canvas.width*.25, this.canvas.height*.5);
        this.context.fillText(this.player2_score, this.canvas.width*.75, this.canvas.height*.5);
    }

    move()
    {
        this.ball.move(this.canvas);
        if (this.ball.speedX < 0 && this.ball.x <= this.player1.width + this.ball.size && this.ball.y >= this.player1.y && this.ball.y <= this.player1.y + this.player1.height)
        {
            console.log("left colision")
            this.ball.speedX = -this.ball.speedX + 0.0001*this.canvas.width;
        }
        else if (this.ball.speedX > 0 && this.ball.x > this.canvas.width - this.ball.size - this.player2.width && this.ball.y >= this.player2.y && this.ball.y <= this.player2.y + this.player2.height) 
        {
            console.log("right colision")
            this.ball.speedX = -this.ball.speedX - 0.0001*this.canvas.width;
        }
        else if (this.ball.x < 0 || this.ball.x > this.canvas.width)
        {
            this.ball.x > 0 ? this.player1_score++ : this.player2_score++;
            this.ball.resetBall(this.canvas);
        }
        if (this.ai)
        {
            this.player1.calculate_move([this.ball.x, this.ball.y], [this.ball.speedX, this.ball.speedY]);
        }
    }

    end_game()
    {
        clearInterval(this.gameInterval);
        let name = this.player1_score === 10 ? this.player1.name : this.player2.name

        const gameData = {
            user1: this.player1.name,  // Assuming `id` is set to the Django User ID
            user2: this.player2.name,  // Null if playing against AI
            score1: this.player1_score,
            score2: this.player2_score,
        };

        fetch('/save-game-result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save game result');
            }
            return response.json();
        });

        document.getElementById("game_mode_menu").classList.remove('d-none');
        document.getElementById("game").classList.add('d-none');
        this.canvas.classList.add('d-none');
        document.getElementById("player_left_name").innerText = "";
        document.getElementById("player_right_name").innerText = "";
    }

    gameLoop()
    {
        this.draw();
        this.move();
        if (Math.max(this.player1_score,  this.player2_score) === 10)
        {
            this.end_game();
        }
    }
}

let ai_game = document.getElementById("ai-game");
let human = document.getElementById("local-game");
ai_game.addEventListener('click', () => {new Game(true)});
human.addEventListener('click', () => {new Game(false)});