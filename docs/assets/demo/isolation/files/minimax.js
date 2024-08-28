class Minimax{
    constructor(plr,opp,depth=3){
        this.pid = plr.id=='AI'?3:2;
        this.oid = opp.id=='P'?2:3;

        
        this.depth=depth;
        this.rows = plr.board.rows;
        this.cols = plr.board.cols;
        this.state = [];
        for(let i=0;i<this.rows;i++){
            let tmp = []
            for(let j=0;j<this.cols;j++){ 
                    tmp.push(plr.board.state[i][j]);     
            }
            this.state.push(tmp);
        }
        
        this.plr = {i:plr.i,j:plr.j,id:plr.id};
        this.opp = {i:opp.i,j:opp.j,id:opp.id};
        if(this.plr.i!=null){
            this.state[this.plr.i][this.plr.j] = this.pid;
        }  
        if(this.opp.i!=null){
            this.state[this.opp.i][this.opp.j] = this.oid;
        }   
        this.dirs = [{x: 0,y: 1},{x: 1,y: 1},{x: 1,y: 0},{x: 1,y: -1},{x: 0,y: -1},{x: -1,y: -1},{x: -1,y: 0},{x: -1,y: 1}];
        
        // console.log(this.state);
        this.root = new Move(this.plr.i,this.plr.j)
        this.moves = [];
        
        // console.log(this.getMoves(this.plr,this.state));
    }

    find(){
        this.getBestMove(this.plr,this.state,this.opp,this.depth,this.root);
        // console.log(this.moves.length);
        // console.log(this.depth);
        let moves = this.getMoves(this.plr,this.state);
        let x = moves[Math.floor(Math.random()*moves.length)].x
        let y = moves[Math.floor(Math.random()*moves.length)].y
        let bestmove = new Move(x,-y);
        let found = false;
        for(let m=0;m<this.moves.length;m++){
            if(this.moves[m].level==1){
                if(!found){
                    bestmove = this.moves[m];
                    // console.log(bestmove,bestmove.value);
                    found = true;
                }
                else{
                    bestmove = this.moves[m].value>bestmove.value?this.moves[m]:bestmove;
                    // console.log(bestmove, bestmove.value);
                }
            }
        }
        // console.log(bestmove,bestmove.value);
        return bestmove;
    }

    getBestMove(plr,state,opp,depth,rt){
        if(depth==0){
            return
        }
        let root = rt;
        let moves = this.getMoves(plr,state);
        let vals = [];
        
        for(let m=0;m<moves.length;m++){
            // console.log(moves[m]);
            // console.log(state);
            let move = new Move(moves[m].x,moves[m].y)
            let tempstate = JSON.parse(JSON.stringify(state));
            // console.log(tempstate);
            let newstate = this.move(moves[m],plr,tempstate);
            let newplr = {i:moves[m].x,j:moves[m].y}
            newstate[moves[m].x][moves[m].y] = (this.depth-depth)%2==0?this.pid:this.oid;
            move.parent=root;
            root.moves.push(move);
            if(depth==1){
                let val = (this.getMoves(newplr,newstate)).length-(this.getMoves(opp,newstate)).length;
                // console.log(newstate);
                // console.log()
                move.value = (this.depth)%2==1?val:-val;
                move.level = this.depth-depth+1;
                vals.push(val);
                this.moves.push(move);
                // console.log(move);

                continue;
            };  
            let val = this.getBestMove(opp,newstate,newplr,depth-1,move);
            move.value = val;
            move.level = this.depth-depth+1;
            // if(move.level==3){
            //     console.log(move.value)
            // }
            vals.push(val);
            this.moves.push(move);
        }
        return (this.depth-depth)%2==0?Math.max(...vals):Math.min(...vals);
    }

    getMoves(plr,state){
        let moves=[];
        if(plr.i==null){
            for(let i=0;i<this.cols;i++){
                for(let j=0;j<this.rows;j++){
                    if(state[i][j]==0){
                        moves.push({x:i,y:j});
                    }
                }
            }
            return moves;
        }
        
        for(let dir=0;dir<this.dirs.length;dir++){
            let i=plr.i;
            let j=plr.j;
            i = i + this.dirs[dir].x;
            j = j + this.dirs[dir].y;
            while(this.insideBoard(i,j)){
                if(state[i][j]>0){
                    break;
                }
                moves.push({x:i,y:j});
                i = i + this.dirs[dir].x;
                j = j + this.dirs[dir].y;
            }
        }
        
        
        return moves;
    }

    insideBoard(i,j){
        if(i>=this.cols || j>=this.rows || i<0 || j<0){
            return false;
        }
        else return true;
    }

    move(pos,plr,state){

        if(plr.i==null){
            state[pos.x][pos.y]=plr.id=='AI'?3:2;;
            return state;
        }
        
            
            let i = plr.i;
            let j = plr.j;
            let stepx = Math.sign(pos.x-i);
            let stepy = Math.sign(pos.y-j);
            // console.log(i,j,pos.x,pos.y);
            state[i][j]=1;
            while(true){ 
                i = i + stepx;
                j = j + stepy;
                state[i][j]=1;
                // console.log(i,j)        
                if(pos.x==i && pos.y==j){
                    state[i][j]=plr.id=='AI'?3:2;
                    break;

                }        
            }
            return state;
        

        
    }
}