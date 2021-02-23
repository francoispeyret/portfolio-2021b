import Matter from 'matter-js';

let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine = Engine.create(),
    world = engine.world;

let render = Render.create({
    element: document.getElementById('home'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        showAngleIndicator: false,
        background: 'transparent',
        wireframes: false
    }
});

Render.run(render);

let runner = Runner.create();
Runner.run(runner, engine);

let balls = [];
let ballOne;

let ballsLength = Math.floor(window.innerWidth / 120);
let ballOneChosen = Math.floor(ballsLength / 2);

for(let i = 0; i < ballsLength; i++) {
    let pos = {
        x: i * 120,
        y: render.options.height / 3
    };
    let radius = Math.random() * 80 + 10;
    let options = {
        restitution: 0.9,
        density: 0.1 + Math.random() / 2,
        render: {
            fillStyle: '#222',
            strokeStyle: null
        }
    };
    if(i === ballOneChosen) {
        options.render.fillStyle = '#eb4c25';
        options.density = 1;
        options.restitution = 0.75;
        radius = 20;
    }
    let ball = Bodies.circle(
        pos.x,
        pos.y,
        radius,
        options
    );
    if(i === ballOneChosen) {
        ballOne = ball;
    }

    balls.push(ball);

    World.add(
        world,
        ball
    );
}

const width = render.options.width,
      height = render.options.height,
      wallsThickness = 30,
      wallOptions = {
          isStatic: true,
          render: { visible: false }
      };

World.add(world, [
    Bodies.rectangle(width/2, -wallsThickness/2, width, wallsThickness, wallOptions),
    Bodies.rectangle(width+wallsThickness/2, height/2, wallsThickness, height, wallOptions),
    Bodies.rectangle(-wallsThickness/2, height/2, wallsThickness, height, wallOptions),
    Bodies.rectangle(width/2, height+wallsThickness/2, width, wallsThickness, wallOptions)
]);

let mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.02,
            render: {
                visible: false
            }
        }
    });
World.add(world, mouseConstraint);

mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

render.mouse = mouse;

document.addEventListener('wheel', function(e){
    let scale = 1;
    if(
        (ballOne.circleRadius > 10 || e.deltaY > 0) &&
        (ballOne.circleRadius < window.innerWidth/2 || e.deltaY < 0)
    ) {
        scale = 1 + e.deltaY/1000;
    }
    if(scale < 1 || scale > 1) {
        Matter.Body.scale(ballOne, scale, scale);
    }
}, {passive: true});
