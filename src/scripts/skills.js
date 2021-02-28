const sinusCanvasEls = document.querySelectorAll('canvas[data-freq]');

for (let sinus of sinusCanvasEls) {
    const freq = parseFloat(sinus.getAttribute('data-freq')),
          ctx = sinus.getContext('2d'),
          height = parseInt(sinus.getAttribute('height')),
          width = parseInt(sinus.getAttribute('width'));

    ctx.strokeStyle = '#999EA1';

    let t = 0, x = 0, y = Math.floor(height / 2);
    const timing = 90/180*Math.PI / 9;
    for(let i = 0; i <= width; i+=1) {
        ctx.moveTo(x,y);
        x = i;
        y = 20 - Math.sin(t) * 18;
        t += timing;
        ctx.lineTo(x,y);
        ctx.stroke();
    }
    console.log(freq);
}
