let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let draggables = [];
let r = 250;
for (let i = 0; i < 10; i++) {
  let angle = Math.PI * 2 / 10 * i;
  draggables.push({ x: 300 + r * Math.cos(angle), y: 300 + r * Math.sin(angle) });
}
let draggableIndex = -1;
function withinCircle(c, r, p) {
  return (c.x - p.x) ** 2 + (c.y - p.y) ** 2 < r ** 2;
}
function clickLocation(e) {
  return { x: e.offsetX, y: e.offsetY };
}

let clickRadius = 10;
canvas.addEventListener('mousedown', e => {
  for (let i = 0; i < draggables.length; i++) {
    let d = draggables[i];
    if (withinCircle(d, clickRadius, clickLocation(e))) {
      draggableIndex = i;
      return;
    }
  }
  draggableIndex = -1;
});

canvas.addEventListener('mousemove', e => {
  if (draggableIndex >= 0) {
    draggables[draggableIndex] = clickLocation(e);
  }
});

canvas.addEventListener('mouseup', e => {
  draggableIndex = -1;
});

function createSpline(p0, p1, p2, p3) {
  return {
    p0: p0,
    p1: p1,
    p2: p2,
    p3: p3
  };
}

// This is the workhorse, based on the wikipedia page
// https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline#Definition
function splinePoint(spline, tVal) {
  function ti1(pi, pi1, ti) {
    return Math.sqrt(((pi1.x - pi.x) ** 2 + (pi1.y - pi.y) ** 2)) ** 0.5 + ti;
  }
  let P0 = spline.p0;
  let P1 = spline.p1;
  let P2 = spline.p2;
  let P3 = spline.p3;
  let t0 = 0;
  let t1 = ti1(spline.p0, spline.p1, t0);
  let t2 = ti1(spline.p1, spline.p2, t1);
  let t3 = ti1(spline.p2, spline.p3, t2);
  let t = (t2 - t1) * tVal + t1;
  let A1 = {
    x: (t1 - t) / (t1 - t0) * P0.x + (t - t0) / (t1 - t0) * P1.x,
    y: (t1 - t) / (t1 - t0) * P0.y + (t - t0) / (t1 - t0) * P1.y
  }
  let A2 = {
    x: (t2 - t) / (t2 - t1) * P1.x + (t - t1) / (t2 - t1) * P2.x,
    y: (t2 - t) / (t2 - t1) * P1.y + (t - t1) / (t2 - t1) * P2.y
  }
  let A3 = {
    x: (t3 - t) / (t3 - t2) * P2.x + (t - t2) / (t3 - t2) * P3.x,
    y: (t3 - t) / (t3 - t2) * P2.y + (t - t2) / (t3 - t2) * P3.y
  }
  let B1 = {
    x: (t2 - t) / (t2 - t0) * A1.x + (t - t0) / (t2 - t0) * A2.x,
    y: (t2 - t) / (t2 - t0) * A1.y + (t - t0) / (t2 - t0) * A2.y
  };
  let B2 = {
    x: (t3 - t) / (t3 - t1) * A2.x + (t - t1) / (t3 - t1) * A3.x,
    y: (t3 - t) / (t3 - t1) * A2.y + (t - t1) / (t3 - t1) * A3.y
  };
  let C = {
    x: (t2 - t) / (t2 - t1) * B1.x + (t - t1) / (t2 - t1) * B2.x,
    y: (t2 - t) / (t2 - t1) * B1.y + (t - t1) / (t2 - t1) * B2.y
  };
  return C;
}

function drawSpline(spl, color, thickness, iter) {
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  let tInc = 1 / iter;
  let t = tInc;
  ctx.beginPath();
  firstPt = splinePoint(spl, 0);
  ctx.moveTo(firstPt.x, firstPt.y);
  for (let i = 0; i < iter; i++) {
    pt = splinePoint(spl, t);
    ctx.lineTo(pt.x, pt.y);
    t += tInc;
  }
  ctx.stroke();
}

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let mySpline1 = createSpline(draggables[0],
                               draggables[1],
                               draggables[2],
                               draggables[3]);
  let mySpline2 = createSpline(draggables[1],
                               draggables[2],
                               draggables[3],
                               draggables[4]);
  let mySpline3 = createSpline(draggables[2],
                               draggables[3],
                               draggables[4],
                               draggables[5]);
  let mySpline4 = createSpline(draggables[3],
                               draggables[4],
                               draggables[5],
                               draggables[6]);
  let mySpline5 = createSpline(draggables[4],
                               draggables[5],
                               draggables[6],
                               draggables[7]);
  let mySpline6 = createSpline(draggables[5],
                               draggables[6],
                               draggables[7],
                               draggables[8]);
  let mySpline7 = createSpline(draggables[6],
                                draggables[7],
                                draggables[8],
                                draggables[9]);
  let mySpline8 = createSpline(draggables[7],
                                draggables[8],
                                draggables[9],
                                draggables[0]);
  let mySpline9 = createSpline(draggables[8],
                                draggables[9],
                                draggables[0],
                                draggables[1]);
  let mySpline10 = createSpline(draggables[9],
                                draggables[0],
                                draggables[1],
                                draggables[2]);
  
  let thickness = 60;
  let res = 200;
  drawSpline(mySpline1, "#000000", thickness, res);
  drawSpline(mySpline2, "#000000", thickness, res);
  drawSpline(mySpline3, "#000000", thickness, res);
  drawSpline(mySpline4, "#000000", thickness, res);
  drawSpline(mySpline5, "#000000", thickness, res);
  drawSpline(mySpline6, "#000000", thickness, res);
  drawSpline(mySpline7, "#000000", thickness, res);
  drawSpline(mySpline8, "#000000", thickness, res);
  drawSpline(mySpline9, "#000000", thickness, res);
  drawSpline(mySpline10, "#000000", thickness, res);
  
  ctx.fillStyle = "#FF0000";
  for (let i = 0; i < draggables.length; i++) {
    let d = draggables[i];
    ctx.beginPath();
    ctx.arc(d.x, d.y, clickRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}, 16);