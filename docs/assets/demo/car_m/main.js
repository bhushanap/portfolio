const carCanvas=document.getElementById("carCanvas");
carCanvas.width=300;//window.innerWidth/2;
carCanvas.height=window.innerHeight;

const networkCanvasCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
networkCanvas.height=window.innerHeight;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9,5);
const boundary=new Borders();
const traffic=[new Car(road.laneCenter(2),carCanvas.height/2-150,20,30,"DUMMY",1),
                new Car(road.laneCenter(3),carCanvas.height/2-200,20,30,"DUMMY",1)];
const n = 20;
for(let i=0;i<n;i++){
    let lane = Math.floor(5*Math.random())+1;
    let y = 200 + 1000*Math.random();
    let speed = 1 + 0.5*Math.random();
    traffic.push(new Car(road.laneCenter(lane),carCanvas.height/2-y,20,30,"DUMMY",speed));
}
// const car=new Car(carCanvas.width/2,carCanvas.height/2,20,30,"AI",5);
const N=1;
const cars = generateCars(N);
let bestCar=cars[0]
if(localStorage.getItem("bestBrain")){
    // bestCar.brain=JSON.parse(localStorage.getItem("bestBrain"))
    for(let i=0;i<cars.length;i++){
        // cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        // if(i!=0){
        //     NeuralNetwork.mutate(cars[i].brain,0.1);
        // }
    }
}

animate();

function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars = [];
    for(let i=0;i<N;i++){
        cars.push(new Car(carCanvas.width/2,carCanvas.height/2,20,30,"KEYS",5));
    }
    return cars;
}

function animate(){
    for (let i=0; i<traffic.length; i++){
        traffic[i].update(boundary.borders,[]);
    };
    // car.update(boundary.borders, traffic);
    for(let i=0;i<cars.length;i++){
        cars[i].update(boundary.borders, traffic);
    }
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );
    carCanvas.width=300;
    carCanvas.height=window.innerHeight;

    networkCanvas.height=window.innerHeight;

    carCtx.save();
    // carCtx.translate(0,-car.y+carCanvas.height*0.5);
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.5);
    boundary.draw(carCtx);
    road.draw(carCtx);
    for (let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx);
    };
    carCtx.globalAlpha = 0.2;
    for(let i=cars.length-1;i>0;i--){
        cars[i].draw(carCtx,'blue',false);
        // if(cars[i].damaged && cars.length>1){
        //     cars.pop(cars[i])
        // }
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,'blue',true)
    // car.draw(carCtx);
    // Visualizer.drawNetwork(networkCtx, car.brain);
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

