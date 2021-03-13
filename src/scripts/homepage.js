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
    element: document.getElementById('canvas'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        showAngleIndicator: false,
        background: 'transparent',
        enableSleeping: true,
        wireframes: false
    }
});
Render.run(render);

let runner = Runner.create();
Runner.run(runner, engine);

let ballsLength = 30;
let ballsIndex = 0;
let ballsStack = Composites.stack(
    Math.floor(ballsLength/1000),
    Math.floor(ballsLength/1000),
    window.innerWidth/100,
    window.innerHeight/500,
    20,
    20,
    function (x,y){
        let randomExpo = -Math.log(Math.random());
        let radius = randomExpo * 20 + 10;
        let ballOptions = {
            restitution: 0.5,
            stiffness: 0.5,
            density: 10,
            render: {
                fillStyle: '#212a31',
                strokeStyle: null
            }
        };
        if(ballsIndex % Math.floor(ballsLength / 4) === 0  && radius < 40) {
            ballOptions.render.fillStyle = '#ff5127';
        }
        ballsIndex++;
        return Bodies.circle(x + radius/2, y + radius/2, radius, ballOptions);
    }
);

World.add(world, ballsStack);

let ballOneOptions = {
    radius: 20,
    stiffness: 0.5,
    isStatic: false,
    render: {
        fillStyle: '#fff',
        strokeStyle: null
    }
};

let ballOne = Bodies.circle(
    window.innerWidth/2,
    window.innerHeight - ballOneOptions.radius * 0.75 - 50,
    ballOneOptions.radius,
    ballOneOptions
);

World.add(world, ballOne);

const width = render.options.width,
      height = render.options.height,
      wallsThickness = 150,
      wallOptions = {
          isStatic: true,
          render: { visible: false }
      };

World.add(world, [
    //Bodies.rectangle(width/2, -wallsThickness/2, width, wallsThickness, wallOptions),
    Bodies.rectangle(width+wallsThickness/2, height/2, wallsThickness, height*3, wallOptions),
    Bodies.rectangle(-wallsThickness/2, height/2, wallsThickness, height*3, wallOptions),
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

Matter.Events.on(mouseConstraint, 'mousemove', function (event) {
    const foundPhysics = Matter.Query.point(Matter.Composite.allBodies(world), event.mouse.position);
    if(typeof foundPhysics[0] !== 'undefined') {
        document.body.classList.add('body-hovered');
    } else {
        document.body.classList.remove('body-hovered');
    }
});

let aboutEl = document.getElementById('about-img');
let aboutBlock = Bodies.rectangle(
    aboutEl.getBoundingClientRect().left,
    aboutEl.getBoundingClientRect().top + 315,
    aboutEl.offsetWidth,
    aboutEl.offsetHeight,
    {
        friction: 0,
        isStatic: true,
        label: 'blockAbout',
        render: {
            fillStyle: 'transparent',
            strokeStyle: null
        }
    });

World.add(world, aboutBlock);


let gravityChangingState = false;
document.getElementById('gravity').addEventListener('click', () => {
    console.log(world.gravity.y);
    if(world.gravity.y === 1) {
        world.gravity.y = -0.25;
        gravityChangingState = true;
        document.body.classList.add('gravity-alert');
        document.getElementById('gravity').classList.add('active');
        setTimeout(()=> {
            world.gravity.y = 0;
            gravityChangingState = false;
        }, 1000);
    } else if(gravityChangingState === false) {
        world.gravity.y = 1;
        document.body.classList.remove('gravity-alert');
        document.getElementById('gravity').classList.remove('active');
    }
});

window.addEventListener('scroll', function(e){
    let aboutBlockPosY = aboutEl.getBoundingClientRect().top + 315;
    Matter.Body.set(aboutBlock, 'position', {
        x: aboutEl.getBoundingClientRect().left + aboutEl.offsetWidth/2,
        y: aboutBlockPosY
    });
}, { passive: true });

window.addEventListener('resize', function(){
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
}, { passive: true });
