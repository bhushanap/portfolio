class Car{
    constructor(x,y,width,height,controlType,maxspd){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.spd=0;
        this.acc=0.1;
        this.racc=0.002;
        this.dir=1;
        this.maxspd=maxspd;
        this.frc=0.03;
        this.thresh=0.005;
        this.maxangle=0.5;
        this.angle=0;
        this.steer=0.002;
        this.carAngle=0;
        this.carSteer=0;
        this.maxCarSteer=0.01;
        this.brakeRatio=0.96;

        this.tirew=this.width/4;
        this.tirer=this.height/4;
        this.wb=this.height-this.tirer;
        this.track=this.width-this.tirew;
        this.controls=new Controls(controlType);
        this.vec=new Vector(this.x,this.y,this.angle,this.width,this.height,this.tirew,this.tirer, controlType);
        this.useBrain=controlType=='AI';
        if(controlType!='DUMMY'){
            this.sensor=new Sensors(this, 11, Math.PI/2, 250);
            this.brain=new NeuralNetwork([11,7,7,3]);
        }
        this.damaged=false;


        this.r = Math.floor(Math.random() * 256);
        this.g = Math.floor(Math.random() * 256);
        this.b = Math.floor(Math.random() * 256);
    }

    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x:this.x-Math.sin(this.carAngle-alpha)*rad,
            y:this.y-Math.cos(this.carAngle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.carAngle+alpha)*rad,
            y:this.y-Math.cos(this.carAngle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.carAngle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.carAngle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.carAngle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.carAngle+alpha)*rad
        });
        return points
    }

    update(borders,traffic){
        if(!this.damaged){
        this.#move();

        this.calcfric();
        this.saturate();
        
        
        this.updatevec();
        
        this.saturate();
        this.carAngle+=this.carSteer;

        this.saturate();

        this.y-=this.spd * Math.cos(this.carAngle);
        this.x-=this.spd * Math.sin(this.carAngle);
        this.polygon=this.#createPolygon();
        this.damaged=this.#assessDamage(borders, traffic);
        
        }
        if(this.sensor){
            this.sensor.update(borders,traffic);
            const offsets=this.sensor.readings.map(s=>s==null?0:1-s.offset);
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);
            // console.log(outputs);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
            }
        }
        
    }

    #assessDamage(borders, traffic){
        for(let i=0;i<borders.length;i++){
            if(polysIntersect(this.polygon,borders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #move(){
        if(this.controls.forward){
            this.spd+=this.acc;
        }
        if(this.controls.reverse){
            this.spd-=this.racc;
        }
        if(this.controls.brake){
            this.spd*=this.brakeRatio;
        }
        if(this.controls.left){
            this.angle+=this.steer;
        }
        if(this.controls.right){
            this.angle-=this.steer;
        }
        if(this.controls.right==false && this.controls.left==false){
            this.angle-=this.angle*0.1;
        }
    }

    updatevec(){
        this.vec.angle=this.angle;
        this.vec.x=this.x;
        this.vec.y=this.y;
        this.vec.updateAckermann();
        if(this.vec.r!=0){
            this.carSteer = this.spd/this.vec.r * Math.sign(this.angle);
        }
    }

    calcfric(){
        this.frc = 0.00001 + (Math.abs(this.spd**2/50))
        this.dir = Math.sign(this.spd)
        if(Math.abs(this.spd)>this.thresh){
            this.spd-=this.frc*this.dir
        }
        else{
            this.spd=0
        }
        // console.log(this.spd)
    }
    saturate(){
        // console.log(this.spd)
        if(this.spd>this.maxspd){
            this.spd=this.maxspd;
        }
        if(this.spd<-this.maxspd){
            this.spd=-this.maxspd;
        }
        if(this.angle>this.maxangle){
            this.angle=this.maxangle;
        }
        if(this.angle<-this.maxangle){
            this.angle=-this.maxangle;
        }
        if(this.carSteer>this.maxCarSteer){
            this.carSteer=this.maxCarSteer;
        }
        if(this.carSteer<-this.maxCarSteer){
            this.carSteer=-this.maxCarSteer;
        }
    }

    draw(ctx,color,drawSensor){
        // ctx.save();
        // ctx.translate(this.x,this.y)
        // ctx.rotate(-this.carAngle);
        // ctx.beginPath();
        // ctx.fillStyle="black"
        // ctx.rect(
        //     -this.width/2,
        //     -this.height/2,
        //     this.width,
        //     this.height
        // );
        // ctx.fill();
        if(this.damaged){
            ctx.fillStyle='gray';
        }
        else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        if(!this.sensor){
            ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`
        };
        ctx.fill()
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.carAngle);
        
        this.vec.draw(ctx);
        ctx.restore();
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        };
        // ctx.restore();
    }
}