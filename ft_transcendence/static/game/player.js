class Player
{
    constructor(position, canvas_height, paddle_height, paddle_width, paddle_speed, human=true){
        this.x = position;
        this.y = (canvas_height - paddle_height) / 2;
        this.canvas_height = canvas_height;
        this.height = paddle_height;
        this.width = paddle_width;
        this.speed = paddle_speed;
        this.previous_position = this.y;
        this.name = "Human player";
        if(human)
        {
            this.setListener();
        }
    }

    setListener()
    {
        if(this.x === 0)
        {
            document.addEventListener('keydown', function(e)
            {
                if (e === 'w')
                    this.move(-1);
                if (e === 's')
                    this.move(1);

            }.bind(this));
        }
        else
        {
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowUp') {
                    this.move(-1);
                } else if (e.key === 'ArrowDown') {
                    this.move(1);
                }
            }.bind(this));
        }
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