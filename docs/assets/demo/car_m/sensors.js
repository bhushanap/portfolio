class Sensors{
    constructor(car, rayCount, raySpread, rayLength){
        this.car=car;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.raySpread = raySpread;

        this.rays=[];
        this.readings=[];
    }

    update(borders, traffic){
        this.#castRays();
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            // console.log(this.#getReading(this.rays[i],borders))
            this.readings.push(
                this.#getReading(this.rays[i],borders, traffic)
            );
        }

    }

    #getReading(ray,borders, traffic){
        let touches=[];
        // console.log(borders.length)
        for(let i=0;i<borders.length;i++){
            const touch=getIntersection(
                ray[0],ray[1],borders[i][0],borders[i][1]
            );

            if(touch){
                touches.push(touch);
            }
        
        }
        
        for(let i=0;i<traffic.length;i++){
            const poly = traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    ray[0],ray[1],poly[j],poly[(j+1)%poly.length]
                );
    
                if(value){
                    touches.push(value);
                }
            
            }
        }
        

        // console.log(touches);
        if(touches.length==0){
            return null;
        }
        else{
            const offsets=touches.map(e=>e.offset);
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
        
    }

    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const relAngle=lerp(this.raySpread/2,
                                -this.raySpread/2,
                                i/(this.rayCount-1)
                                );  
            const rayAngle=relAngle  + this.car.carAngle;
            const start={x: this.car.x,y:this.car.y};
            const end={x:this.car.x-this.rayLength*Math.sin(rayAngle)*Math.cos(relAngle*Math.PI/this.raySpread*0.7),
                        y:this.car.y-this.rayLength*Math.cos(rayAngle)*Math.cos(relAngle*Math.PI/this.raySpread*0.7)};
            this.rays.push([start,end]);
        }
    }

    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle='yellow';
            ctx.moveTo(
                this.rays[i][0].x,this.rays[i][0].y
            );
            ctx.lineTo(
                end.x, end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle='black';
            ctx.moveTo(
                this.rays[i][1].x,this.rays[i][1].y
            );
            ctx.lineTo(
                end.x, end.y
            );
            ctx.stroke();
        }
    }

}