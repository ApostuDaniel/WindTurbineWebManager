let rotationSpeed = 0.01;
let minSpeed = 0.005, maxSpeed = 0.05, windSpeed = 0.0001;
let rotate = false;
class Blade
{
    constructor(angle)
    {
        this.position = 
        {
            x: windmill.width/2,
            y: windmill.height/2,
        }
        this.angle = angle;
        this.color = 'white';
    }
    draw()
    {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        if(this.angle != 0)
        {
            ctx.bezierCurveTo(this.position.x, this.position.y, this.position.x + 30 * this.angle, this.position.y - 30 * this.angle, this.position.x + 200 * this.angle, this.position.y - 20 * this.angle);
            ctx.moveTo(this.position.x, this.position.y);
            ctx.bezierCurveTo(this.position.x, this.position.y + 10 * this.angle, this.position.x + 60 * this.angle, this.position.y + 30 * this.angle, this.position.x + 200 * this.angle, this.position.y - 20 * this.angle);
        }
        else
        {
            ctx.bezierCurveTo(this.position.x, this.position.y, this.position.x + 30, this.position.y - 30, this.position.x + 20, this.position.y + 200);
            ctx.moveTo(this.position.x, this.position.y);
            ctx.bezierCurveTo(this.position.x - 10, this.position.y, this.position.x - 30, this.position.y + 60, this.position.x + 20, this.position.y + 200);
        }
        ctx.closePath();
        this.color = "rgb(10, 10, 10)";
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }

    update()
    {
        ctx.translate(this.position.x, this.position.y );
        ctx.rotate(rotationSpeed);
        ctx.translate(-this.position.x, -this.position.y);
        this.draw();
    }
}

var c = document.getElementById('windmill');
var ctx = c.getContext("2d");

function animate()
{
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, windmill.width, windmill.height);
    let b1 = new Blade(0);
    let b2 = new Blade(-1);
    let b3 = new Blade(1);

    b1.update();
    b2.update();
    b3.update();
}

animate();
