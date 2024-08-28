class Visualizer{
    static drawNetwork(ctx,network){
        const margin=50;
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;
        const levelHeight=height/network.levels.length;
        // console.log(network.levels[0].outputs)
        // console.log(network.levels[1].inputs)
        for(let i=0;i<network.levels.length;i++){
            const levelTop = top + lerp(height-levelHeight,0,network.levels.length==1?0.5:i/(network.levels.length-1))
            Visualizer.drawLevel(ctx,network.levels[i],left,levelTop,width,levelHeight);
        }

    }

    static drawLevel(ctx,level,left,top,width,height){
        const right=left+width;
        const bottom=top+height;
        // console.log(level.inputs.length)
        const {inputs,outputs} = level
        const nodeRadius=width/25;
        for(let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs,i,left,right),bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs,j,left,right),top);
                ctx.lineWidth=1;
                ctx.strokeStyle='#333333aa';
                ctx.stroke();  
                ctx.lineWidth=2;
                // console.log((Math.abs(inputs[i]*outputs[j]))**0.25);
                const value = Math.max(Math.min((Math.abs(inputs[i]*outputs[j]))**0.25,1),0)
                ctx.strokeStyle=`rgba(255,100,100,${value})`;
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs,i,left,right),bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs,j,left,right),top);
                ctx.stroke();
                ctx.lineWidth=1;
            }

            for(let i=0;i<inputs.length;i++){
                const x=Visualizer.#getNodeX(inputs,i,left,right);
                ctx.fillStyle="#222222";
                ctx.beginPath();
                ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
                ctx.fill();
                const value = Math.max(Math.min((Math.abs(inputs[i]))**0.5,1),0);
                // console.log(value);
                ctx.fillStyle=`rgba(255,255,200,${value})`;
                ctx.beginPath();
                ctx.arc(x,bottom,nodeRadius*0.9,0,Math.PI*2);
                ctx.fill();
                ctx.strokeStyle=`rgba(255,255,200,${value})` 
                ctx.lineWidth=1;
                ctx.setLineDash([2,2]);
                ctx.beginPath();
                ctx.arc(x,bottom,nodeRadius*1.3,0,Math.PI*2);
                ctx.stroke();
                ctx.setLineDash([]);
                // console.log(level.inputs)
            }
        
        for(let i=0;i<outputs.length;i++){
            const x=Visualizer.#getNodeX(outputs,i,left,right);
            ctx.fillStyle="#222222";
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fill();
            const value = Math.max(Math.min((Math.abs(outputs[i]))**0.5,1),0)
            ctx.fillStyle=`rgba(255,255,200,${value})`
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.9,0,Math.PI*2);
            ctx.fill();
            ctx.strokeStyle=`rgba(255,255,200,${value})`
            ctx.lineWidth=1;
            ctx.setLineDash([2,2]);
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*1.3,0,Math.PI*2);
            ctx.stroke();
            ctx.setLineDash([]);
            // console.log(level.outputs)
        }



        // ctx.restore();
        }

    }

    static #getNodeX(nodes,index,left,right){
        return lerp(left,right,nodes.length==1?0.5:index/(nodes.length-1))

    }
}