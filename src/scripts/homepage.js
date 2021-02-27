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
        let radius = randomExpo * 25 + 10;
        let ballOptions = {
            restitution: 0.9,
            density: 10 ,
            render: {
                fillStyle: '#222',
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

let aboutEl = document.querySelector('section#about .block');
let aboutBlock = Bodies.rectangle(
    window.innerWidth*0.5,
    aboutEl.getBoundingClientRect().top + 315,
    1150,
    630, {
        friction: 0,
        isStatic: true,
        label: 'block',
        render: {
            fillStyle: 'transparent',
            strokeStyle: null
        }
    });
World.add(world, aboutBlock);

let skillEls = document.querySelectorAll('section#skills .skill');
let skillOptions = {
    friction: 0,
    isStatic: true,
    label: 'blockSkill',
    render: {
        fillStyle: 'transparent',
        strokeStyle: null
    }
};
let skillsStack = [];
for(let i = 0; i < skillEls.length; i++) {
    const skillElRoot = document.querySelector('section#skills .skill:nth-of-type('+(i+1)+')');
    let skillSize = {
        w: skillElRoot.offsetWidth,
        h: skillElRoot.offsetHeight
    };
    let skillPos = skillElRoot.getBoundingClientRect();
    skillsStack.push(Bodies.rectangle(
        skillPos.left,
        skillPos.top,
        skillSize.w,
        skillSize.h,
        skillOptions
    ));
}
World.add(world, skillsStack);

window.addEventListener('scroll', function(e){
    let aboutBlockPosY = aboutEl.getBoundingClientRect().top + 315;
    Matter.Body.set(aboutBlock, 'position', {
        x: window.innerWidth*0.5 - 5,
        y: aboutBlockPosY
    });
    for(let i = 0; i < skillsStack.length; i++) {
        const skillElRoot = document.querySelector('section#skills .skill:nth-of-type('+(i+1)+')');
        let skillPos = skillElRoot.getBoundingClientRect();
        Matter.Body.set(skillsStack[i], 'position', {
            x: skillPos.left + skillElRoot.offsetWidth/2,
            y: skillPos.top + skillElRoot.offsetHeight/2
        });
    }
}, { passive: true });

window.addEventListener('resize', function(){
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
}, { passive: true });