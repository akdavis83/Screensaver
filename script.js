var stage = new createjs.Stage("canvas"),
    w = 1000, h = 1000,
    shapes = [];

createjs.Ticker.on("tick", tick);
createjs.Ticker.timingMode = "raf";
stage.autoClear = false;

var noiseMachine = new PerlinNoiseMachine();

var cont = new createjs.Container();
stage.addChild(cont)

var f = new createjs.Shape().set({alpha:0.05});
f.size = f.graphics.f("black").dr(0,0,w,h).command;
stage.addChild(f);

function addShape() {
  var shape = {
    shape: new createjs.Shape(),
    points: [],
    color: createjs.Graphics.getHSL(Math.random()*360|0, 100, 50)
  };
  shapes.push(shape);
  shape.shape.shadow = new createjs.Shadow(shape.color, 0,0,20);
  shape.compositeOperation = "screen";
  cont.addChild(shape.shape);
  for (var i=0, l=(Math.random()*5|0)+6; i<l; i++) {
    addPoint(shape);
  }
}
function addPoint(shape) {
  var p = {
    i1:Math.random()*1000, i2: Math.random()*1000, i3: Math.random()*1000, speed: 1,
    p: new createjs.Point()
  };
  shape.points.push(p);
}

addShape();
stage.on("stagemouseup", addShape);

var index = 0, i2 = 0, i3 = 0;
function tick(e) {
  var h2 = h/2, w2 = w/2;
  for (var j=0, jl=shapes.length; j<jl; j++) {
    var shape = shapes[j];  
    shape.shape.graphics.clear().s(shape.color);
    
    for (var i=0, l=shape.points.length/2|0; i<l-1; i+=2) {
      var p = shape.points[i],
          lp = shape.points[i+1];
      p.p.setValues(w2 + (noiseMachine.noise(p.i1++/200, p.i2++/200, p.i3++/200) * w*2 - w),
                    h2 + (noiseMachine.noise(p.i1/224, p.i2/223, p.i3/222) * h*2 - h));
      lp.p.setValues(w2 + (noiseMachine.noise(lp.i1++/200, lp.i2++/200, lp.i3++/200) * w*2 - w),
                     h2 + (noiseMachine.noise(lp.i1/224, lp.i2/223, lp.i3/222) * h*2 - h));    
      if (i == 0) {
        shape.shape.graphics.moveTo(p.p.x, p.p.y);
      } else {
        shape.shape.graphics.qt(p.p.x, p.p.x, lp.p.x, lp.p.y);
      }
    }
    p = shape.points[shape.points.length-1];
    shape.shape.graphics.qt(p.p.x, p.p.y, shape.points[0].p.x, shape.points[0].p.y);
  }
  stage.update(e);
}

window.addEventListener("resize", handleResize);
function handleResize() {
  w = window.innerWidth;
  h = window.innerHeight;
  stage.canvas.width = w;
  stage.canvas.height = h;
  f.size.w = w;
  f.size.h = h;
}

handleResize();