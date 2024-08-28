class Truck{
    constructor(x,y){
        this.cx = x;
        this.cy = y;
        this.width = 20;
        this.clength = 30;
        this.gap = 10;
        this.tlength = this.clength*4;
        this.mx=0;
        this.my=0;
        this.tx = this.cx;
        this.ty = this.cy+((this.clength+this.tlength)/2)+this.gap;  
        this.cAngle = 0;
        this.tAngle = this.cAngle;
        this.tomega = 0;
        this.controls=new Controls();

        this.steerAngle=0;
        this.dsteerAngle=0.02;
        this.maxsteerAngle=0.5;
        this.powerSteer=true;

        this.fAngle = this.cAngle+this.steerAngle;

        this.maxfric=0.01;
        this.maxcf=0.02;
        this.dcf=0.0002;
        this.cf=0;
        this.cacc=0;
        this.cmass=1;
        this.caccx=0;
        this.caccy=0;
        this.cvelx=0;
        this.cvely=0;
        this.ctor=0;
        this.calpha=0;
        this.comega=0;
        this.cmoi=10;
        this.tmoi=10000;
    }


    #createTrailer(){
        const points=[];
        const rad = Math.hypot(this.width,this.tlength)/2;
        const alpha = Math.atan2(this.width, this.tlength);
        points.push({
            x:this.tx-Math.sin(this.tAngle-alpha)*rad,
            y:this.ty-Math.cos(this.tAngle-alpha)*rad
        });
        points.push({
            x:this.tx-Math.sin(this.tAngle+alpha)*rad,
            y:this.ty-Math.cos(this.tAngle+alpha)*rad
        });
        points.push({
            x:this.tx-Math.sin(Math.PI+this.tAngle-alpha)*rad,
            y:this.ty-Math.cos(Math.PI+this.tAngle-alpha)*rad
        });
        points.push({
            x:this.tx-Math.sin(Math.PI+this.tAngle+alpha)*rad,
            y:this.ty-Math.cos(Math.PI+this.tAngle+alpha)*rad
        });
        return points;
    }
    #createCar(){
        const points=[];
        const rad = Math.hypot(this.width,this.clength)/2;
        const alpha = Math.atan2(this.width, this.clength);
        points.push({
            x:this.cx-Math.sin(this.cAngle-alpha)*rad,
            y:this.cy-Math.cos(this.cAngle-alpha)*rad
        });
        points.push({
            x:this.cx-Math.sin(this.cAngle+alpha)*rad,
            y:this.cy-Math.cos(this.cAngle+alpha)*rad
        });
        points.push({
            x:this.cx-Math.sin(Math.PI+this.cAngle-alpha)*rad,
            y:this.cy-Math.cos(Math.PI+this.cAngle-alpha)*rad
        });
        points.push({
            x:this.cx-Math.sin(Math.PI+this.cAngle+alpha)*rad,
            y:this.cy-Math.cos(Math.PI+this.cAngle+alpha)*rad
        });
        return points;
    }

    update(){
        // console.log(this.cvelx, this.cffAngle, this.vAngle, this.cfAngle, this.cAngle);
        this.updateControls();
        this.saturate();
        this.friction();
        this.dynamics();
        this.move();
        this.car=this.#createCar();
        this.trailer= this.#createTrailer();
        this.updateTrailer();
        // console.log(this.cvel)
        // console.log(this.cft, this.cff, this.cffAngle, this.cfx, this.cfy);
        
    }

    updateControls(){
        if(this.controls.forward){
            this.cf+=this.dcf;
        }
        else{
            this.cf-=this.cf*0.05;
        }
        if(this.controls.reverse){
            this.cf-=this.maxcf*0.1;
        }
        // if(this.controls.brake){
        //     this.cf=this.maxcf;
        // }
        if(this.controls.left){
            this.steerAngle+=this.dsteerAngle;
        }
        if(this.controls.right){
            this.steerAngle-=this.dsteerAngle;
        }
        if(this.controls.right==false && this.controls.left==false && this.powerSteer){
            this.steerAngle-=this.steerAngle*0.05;
            if(Math.abs(this.steerAngle)<0.005){
                this.steerAngle=0;
            }
        }
        
    }


    saturate(){
        if(Math.abs(this.steerAngle)>this.maxsteerAngle){
            this.steerAngle *= this.maxsteerAngle/Math.abs(this.steerAngle);
        }
        if(Math.abs(this.cf)>this.maxcf){
            this.cf *= this.maxcf/Math.abs(this.cf);
        }
    }

    friction(){
        
    }

    dynamics(){
        this.cfAngle = this.cAngle + this.steerAngle;
        this.ctor=0;
        
        let angleH = wrap(this.cAngle-Math.atan2(-this.cvelx,-this.cvely)) 
        let angleS = wrap(this.cfAngle-Math.atan2(-this.cvelx,-this.cvely)) 
        let mag = (this.cvelx**2 + this.cvely**2)**0.5
        this.cveld = (mag) * Math.cos(angleH)
        if(this.steerAngle!=0){
            this.r = this.clength/Math.tan(Math.abs(this.steerAngle)) + this.width/2
            this.ctor += (this.cveld**1)/this.r * Math.sign(this.steerAngle);
            
        }
        // this.cf+=0.03*this.cveld
        // this.cf=(Math.min(Math.abs(this.cf),this.maxcf)) * Math.sign(this.cf);
        this.cfx = -(this.cf)*Math.sin(this.cfAngle) - 0.05*this.cvelx;
        this.cfy = -(this.cf)*Math.cos(this.cfAngle) - 0.05*this.cvely;
        // this.cvelx = this.cvelx*Math.cos(angleS) - this.cvely*Math.sin(angleS);
        // this.cvely = this.cvelx*Math.sin(angleS) + this.cvely*Math.cos(angleS);
    }

    move(){
        this.caccx=this.cfx/this.cmass;
        this.caccy=this.cfy/this.cmass;
        this.cvelx += this.caccx;
        this.cvely += this.caccy;
        if((this.cvelx**2 + this.cvely**2)<0.0001){this.cvelx=0; this.cvely=0}
        this.cx+=this.cvelx;
        this.cy+=this.cvely;
        this.calpha=this.ctor/this.cmoi;
        this.calpha-=0.1*this.comega;
        this.comega+=this.calpha;
        this.cAngle+=this.comega;
        this.cAngle = wrap(this.cAngle)
        
        if(wrap(this.cAngle-this.tAngle)>0.5*Math.PI){this.cAngle = wrap(this.tAngle + 0.5*Math.PI)}
        if(wrap(this.cAngle-this.tAngle)<-0.5*Math.PI){this.cAngle = wrap(this.tAngle - 0.5*Math.PI)}
    }

    updateTrailer(){
        this.mx = this.cx+(this.gap+this.clength/2)*Math.sin(this.cAngle);
        this.my = this.cy+(this.gap+this.clength/2)*Math.cos(this.cAngle);
        if(Math.abs(this.cvely)<0.01) {this.vAngle = this.tAngle}
        else{this.vAngle = Math.atan2(-this.cvelx,-this.cvely)}
        this.tomega += ((Math.sin(wrap(this.vAngle-this.tAngle))*(this.tlength/2))*Math.abs(this.cveld) - this.tomega*10000) * (1/this.tmoi)
        
        this.tAngle += this.tomega;
        console.log(this.cveld)
        this.tx = this.mx+(this.tlength/2)*Math.sin(this.tAngle);
        this.ty = this.my+(this.tlength/2)*Math.cos(this.tAngle);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.car[0].x,this.car[0].y);
        for(let i=1;i<this.car.length;i++){
            ctx.lineTo(this.car[i].x,this.car[i].y);
        }
        ctx.fill()
        
        ctx.beginPath();
        ctx.moveTo(this.trailer[0].x,this.trailer[0].y);
        for(let i=1;i<this.trailer.length;i++){
            ctx.lineTo(this.trailer[i].x,this.trailer[i].y);
        }
        ctx.fill()

        ctx.beginPath();
        ctx.arc(this.mx, this.my, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100-(Math.sin(wrap(this.vAngle-this.tAngle)))*30, 100-(Math.cos(wrap(this.vAngle-this.tAngle)))*30);
        
        ctx.stroke();
    }
}

// initialize vectors

// vehicle head unit
// steer head unit
// steer angle unit
// f
// a
// v

// a = 0
// sh = vh + sa
// forward
// f += sh * k1


// fsh -= v perp sh  * k2
// fsh -= v proj sh  * k3

// fvh -= v proj vh  * k3
// fvh -= v perp vh  * k2

// ang = angdiff fsh vh
// fsh * wb/2 * sin(angdiff)
