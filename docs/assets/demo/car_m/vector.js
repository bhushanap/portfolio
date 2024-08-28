class Vector{
    constructor(x,y,angle,width,height,tirew,tirer, type){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.tirew=tirew;
        this.tirer=tirer;
        this.angle=angle;
        this.length=this.height;
        this.langle=0;
        this.rangle=0;
        this.type=type
        
        
        this.wb=this.height-this.tirer;
        this.track=this.width-this.tirew;
    
    }

    updateAckermann(){
        this.r = this.wb/Math.tan(Math.abs(this.angle)) + this.track/2
        this.angle2 = Math.atan((this.wb)/(this.r + this.track/2))
        if(this.angle>0){
            this.langle=this.angle;
            this.rangle=this.angle2;
        }
        else if(this.angle<0){
            this.langle=-this.angle2;
            this.rangle=this.angle;
        }
        else{
            this.langle=0;
            this.rangle=0;
        }
    }

    drawtires(ctx){
        
        ctx.beginPath();
        ctx.fillStyle="darkred";
        if(this.type!="KEYS"){
            ctx.fillStyle='#333333';
        }
        ctx.rect(
            -this.width/2,
            this.height/2-this.tirer,
            this.tirew,
            this.tirer
        );
        ctx.rect(
            this.width/2-this.tirew,
            this.height/2-this.tirer,
            this.tirew,
            this.tirer
        );
        ctx.fill();

        ctx.save()
        ctx.translate(-this.width/2+this.tirew/2,-this.height/2+this.tirer/2);
        ctx.rotate(-this.langle);
        ctx.beginPath();
        ctx.fillStyle="darkred";
        if(this.type!="KEYS"){
            ctx.fillStyle='#333333';
        }
        ctx.rect(
            -this.tirew/2,
            -this.tirer/2,
            this.tirew,
            this.tirer
        );
        ctx.fill();
        ctx.restore();
        if(this.type!="KEYS"){
            ctx.fillStyle='#333333';
        }

        ctx.translate(this.width/2-this.tirew/2,-this.height/2+this.tirer/2);
        ctx.rotate(-this.rangle);
        ctx.beginPath();
        
        ctx.rect(
            -this.tirew/2,
            -this.tirer/2,
            this.tirew,
            this.tirer
        );
        ctx.fill();
        // ctx.restore();
    }

    drawarrow(ctx){
        ctx.translate(0,-this.height/2);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.lineWidth=3;
        ctx.strokeStyle="red";
        ctx.fillStyle="white";
        ctx.moveTo(0,0);
        ctx.lineTo(0,-this.length);
        ctx.stroke();
        ctx.rect(
            -this.tirew/2,
            -this.tirer/2,
            this.tirew,
            this.tirer
        );
        ctx.fill();
    }

    draw(ctx){
        ctx.save();
        this.drawtires(ctx);
        ctx.restore();
        ctx.save();
        if(this.type=="KEYS"){
            this.drawarrow(ctx);
        }
        ctx.restore();  
    }

}