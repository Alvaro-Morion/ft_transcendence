class Player
{
    constructor(position, canvas_height, paddle_height, paddle_width, paddle_speed){
        this.x = position;
        this.y = (canvas_height - paddle_height) / 2;
        this.canvas_height = canvas_height;
        this.height = paddle_height;
        this.width = paddle_width;
        this.speed = paddle_speed;
        this.previous_position = this.y;
    }
    
    move(direction){
        this.previous_position = this.y;
        this.y += direction*this.speed;
        this.y = Math.max(0, Math.min(this.y, this.canvas_height - this.height));
    }

    draw(context)
    {
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Player;