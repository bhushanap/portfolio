class Board{
    constructor(x,y,size,rows=6,cols=6){
        this.x=x;
        this.y=y;
        this.rows=rows;
        this.cols=cols;
        // this.ratio = w>h?w/h:h/w;
        // console.log(this.ratio);
        // this.ogw = w;
        // this.ogh = h;
        this.w=size;
        this.h=size;
        this.left = this.x-this.w/2;
        this.top = this.y-this.h/2;
        this.right = this.x+this.w/2;
        this.bottom = this.y+this.h/2;
        this.sqw=this.w/this.cols;
        this.sqh=this.h/this.rows;
        this.state=[];
        for(let i=0;i<this.rows;i++){
            let tmp = []
            for(let j=0;j<this.cols;j++){ 
                    tmp.push(0);     
            }
            this.state.push(tmp);
    
        }
        this.click = {x:0,y:0};
        // console.log(this.state);
}

    draw(ctx){
        
        for(let i=0;i<this.cols;i++){
            let left = lerp(this.left,this.right,i/this.cols);
            for(let j=0;j<this.rows;j++){
                // console.log(i,j);
                let top = lerp(this.top,this.bottom,j/this.rows);      
                // console.log(left,top,this.sqw,this.sqh);
                ctx.beginPath();
                ctx.rect(left,top,this.sqw,this.sqh);
                // console.log(this.state[i][j])
                if((i+j)%2==0){
                    // console.log(i,j);
                    switch(this.state[i][j]){
                        case 0: ctx.fillStyle = '#777777'; break;
                        case 1: ctx.fillStyle = '#221a22'; break;
                        case 2: ctx.fillStyle = '#224422'; break;
                        case 3: ctx.fillStyle = '#441a22'; break;
                        }
                }
                else{
                    // console.log(i,j);
                    switch(this.state[i][j]){
                        case 0: ctx.fillStyle = '#bbbbbb'; break;
                        case 1: ctx.fillStyle = '#332733'; break;
                        case 2: ctx.fillStyle = '#336633'; break;
                        case 3: ctx.fillStyle = '#663333'; break;
                        }
                }
                
                ctx.lineWidth=2;
                ctx.fill();
                // console.log(ctx.fillStyle);
                ctx.stroke(); 
        }
    }
    
    ctx.beginPath();
    ctx.lineWidth=5;
    ctx.rect(this.left,this.top,this.w,this.h);
    ctx.stroke();
    
    }

    }
