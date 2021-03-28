import Matter from 'matter-js';
import MatterAttractors from 'matter-attractors';

Matter.use(MatterAttractors);

let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Common = Matter.Common,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

let engine = Engine.create();
engine.positionIterations = 4;
let world = engine.world;
world.gravity.scale = 0;

const attractionFactorMax = 1e-7;
const attractionFactorMin = 1e-8;
let attractionFactor = attractionFactorMin;

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


const width = render.options.width,
      height = render.options.height,
      wallsThickness = 150,
      wallOptions = {
          isStatic: true,
          render: { visible: false }
      };

World.add(world, [
    Bodies.rectangle(width/2, -wallsThickness/2, width, wallsThickness, wallOptions),
    Bodies.rectangle(width+wallsThickness/2, height/2, wallsThickness, height*3, wallOptions),
    Bodies.rectangle(-wallsThickness/2, height/2, wallsThickness, height*3, wallOptions),
    Bodies.rectangle(width/2, height+wallsThickness/2, width, wallsThickness, wallOptions)
]);

let attractiveBody = Bodies.circle(
    render.options.width / 2,
    render.options.height / 2 - 150,
    40,
    {
        isStatic: true,
        render: {
            fillStyle: '#efefef'
        },
        plugin: {
            attractors: [
                function(bodyA, bodyB) {
                    const force = {
                        x: (bodyA.position.x - bodyB.position.x) * attractionFactor,
                        y: (bodyA.position.y - bodyB.position.y) * attractionFactor,
                    };
                    // apply force to both bodies
                    //Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
                    Body.applyForce(bodyB, bodyB.position, force);
                }
            ]
        }
    });

World.add(world, attractiveBody);
let aboutEl = document.getElementById('about-img');
let aboutBlock = Bodies.rectangle(
    aboutEl.getBoundingClientRect().left,
    aboutEl.getBoundingClientRect().top + 315,
    aboutEl.offsetWidth,
    aboutEl.offsetHeight,
    {
        isStatic: true,
        render: { visible: false },
        chamfer: { radius: Math.floor(aboutEl.offsetWidth/1.5) }
    });

World.add(world, aboutBlock);

const colorsRandom = [
    '#323c43',
    '#323c43',
    '#323c43',
    '#323c43',
    '#3e4951',
    '#3e4951',
    '#3e4951',
    '#49555d',
    '#49555d',
    '#56656e',
    '#ff5127'
];

for (let i = 0; i < 123; i++) {
    let body = Bodies.polygon(
        Common.random(0, render.options.width),
        Common.random(0, render.options.height),
        Common.random(1, 5),
        Common.random() > 0.9 ? Common.random(15, 25) : Common.random(5, 10),
        {
            frictionAir: 0,
            render: {
                fillStyle: colorsRandom[Math.floor(Common.random(0,colorsRandom.length))]
            },
        }
    );

    World.add(world, body);
}

Events.on(engine, 'afterUpdate', function() {
    if (!mouseWindowPos.x) {
        return;
    }
    Body.translate(attractiveBody, {
        x: (mouseWindowPos.x - attractiveBody.position.x) * 0.05,
        y: (mouseWindowPos.y - attractiveBody.position.y) * 0.05
    });
    let aboutBlockPos = {
        x:  aboutEl.getBoundingClientRect().left + aboutEl.offsetWidth/2,
        y: aboutEl.getBoundingClientRect().top + aboutEl.offsetHeight/2
    };
    Body.setPosition(aboutBlock, {
        x: aboutBlockPos.x,
        y: aboutBlockPos.y
    });
    /*Body.set(aboutBlock, 'position', {
        x: aboutBlockPos.x,
        y: aboutBlockPos.y
    });*/
});

window.addEventListener('resize', function(){
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
}, { passive: true });

// add mouse control
let mouse = Mouse.create(render.canvas);
render.mouse = mouse;
mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

let mouseWindowPos = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', function (e) {
    mouseWindowPos.x = e.clientX;
    mouseWindowPos.y = e.clientY;
}, {
    passive: true
});
window.addEventListener('click', function (e) {
    mouseWindowPos.x = e.clientX;
    mouseWindowPos.y = e.clientY;
}, {
    passive: true
});

window.addEventListener('mousedown', function (e) {
    attractionFactor = attractionFactorMax;
    Body.scale(attractiveBody, 1.25, 1.25);
}, {
    passive: true
});
window.addEventListener('mouseup', function (e) {
    attractionFactor = attractionFactorMin;
    Body.scale(attractiveBody, 0.8, 0.8);
}, {
    passive: true
});

let gravityChangingState = false;
document.getElementById('gravity').addEventListener('click', () => {
    console.log(world.gravity.y);
    if(world.gravity.y === 1) {
        world.gravity.y = -0.25;
        gravityChangingState = true;
        document.body.classList.add('gravity-alert');
        document.getElementById('gravity').classList.add('active');
        attractionFactor = -attractionFactorMax;
        setTimeout(()=> {
            world.gravity.y = 0;
            attractionFactor = 0;
            gravityChangingState = false;
        }, 1000);
    } else if(gravityChangingState === false) {
        world.gravity.y = 1;
        attractionFactor = attractionFactorMin;
        document.body.classList.remove('gravity-alert');
        document.getElementById('gravity').classList.remove('active');
    }
});

Render.run(render);

let runner = Runner.create();
Runner.run(runner, engine);