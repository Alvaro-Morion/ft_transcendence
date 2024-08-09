import Player from "./player.js";

class AIPlayer extends Player
{
    //The AI oponent is allways on the left.
    constructor(position = 0, canvas_height, canvas_width, paddle_height, paddle_width, paddle_speed)
    {
        super(position, canvas_height, paddle_height, paddle_width, paddle_speed, false);
        this.canvas_width = canvas_width;
        this.last_position_calculated = -1;
        this.last_ball_position = [canvas_width/2, canvas_height/2];
        this.predicted_ball_height = this.canvas_height/2;
        this.name = "Marvin";
        this.image = "static/image/AI.png"
    }

    calculate_next_collision(ball_position, ball_speed)
    {
        let t = Math.abs(ball_position[0]/ball_speed[0]);
        if (ball_speed[0] > 0)
        {
            t = 2*this.canvas_width/ball_speed[0] - t;
        }
        let h = ball_position[1] + t*ball_speed[1];
        this.previous_position = ball_position;
        while(h > this.canvas_height || h < 0)
        {
            if (h < 0)
            {
                h *= -1;
            }
            if (h > this.canvas_height)
            {
                h = this.canvas_height - (h - this.canvas_height)
            }
        }
        this.predicted_ball_height = h + (Math.random()*2 - 1)*this.canvas_height*.05;
    }
    
    calculate_move(ball_position, ball_speed)
    {
        let time = Date.now();
        if (this.last_position_calculated < 0 || (time - this.last_position_calculated) > 1000)
        {
            this.calculate_next_collision(ball_position, ball_speed);
            this.last_position_calculated = time;
        }
        if(this.y < this.predicted_ball_height)
        {
            this.move(1);
        }
        if(this.y > this.predicted_ball_height)
        {
            this.move(-1);
        }
    }
}

export default AIPlayer;