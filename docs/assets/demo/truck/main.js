const canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const ctx = canvas.getContext("2d");
const truck=new Truck(canvas.width/2,canvas.height/2);
const v1 = new Vector(1,1);
const v2 = new Vector(1,0);

console.log(v1.add(v2), v1.sub(v2),  v1.mag(), v1.proj(v2), v1.perp(v2), v1.ang(), v1.angdiff(v2), v1.scale(3), v1.unit());

animate();

function animate(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    truck.update();
    ctx.save();
    ctx.translate(-truck.x+canvas.width*0.5,-truck.y+canvas.height*0.5);
    truck.draw(ctx);
    requestAnimationFrame(animate);
}

