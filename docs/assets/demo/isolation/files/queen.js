class Queen{
    constructor(board,id,pos,first){
        this.board=board;
        this.id = id;
        this.image = new Image();
        this.moves = [];
        
        this.dirs = [{x: 0,y: 1},{x: 1,y: 1},{x: 1,y: 0},{x: 1,y: -1},{x: 0,y: -1},{x: -1,y: -1},{x: -1,y: 0},{x: -1,y: 1}];
        
        if(this.id=='P'){
            this.image.src = 'files/queen_white.png';
            // this.turn = first;
        }
        else{
            // this.turn = !first;
            this.image.src = 'files/queen_black.png';
        }    
        this.turn = first;
        this.i = pos.x;
        this.j = pos.y;
        this.updated=false;

        // console.log(this.i,this.j);

    }

    draw(ctx){
        
        let y = this.board.top + (this.j)*this.board.sqh;
        let x = this.board.left + (this.i)*this.board.sqw;
        // console.log(x,y);
        if(this.i==null){
            return
        }
        this.image.addEventListener("load", (e) => {
            ctx.drawImage(this.image, x, y + this.board.sqw*0.1, this.board.sqw, this.board.sqh*0.8);
            });
        ctx.drawImage(this.image, x, y + this.board.sqw*0.1, this.board.sqw, this.board.sqh*0.8);    
        
        if(this.turn){
            if(this.updated){
                this.board.state[this.i][this.j]=this.id=='P'?2:3;
                this.moves = this.getMoves(true);
            }
            
            for(let m=0;m<this.moves.length;m++){
                let left = lerp(this.board.left,this.board.right,this.moves[m].x/this.board.cols);
                let top = lerp(this.board.top,this.board.bottom,this.moves[m].y/this.board.rows);
                ctx.beginPath();
                ctx.rect(left,top,this.board.sqw,this.board.sqh);
                if(this.id=='P'){
                    ctx.fillStyle='#00ff0033';
                }
                else{ctx.fillStyle='#ff000033';}
                
                ctx.fill();
            }
            this.updated=false;
        }
        

    }

    update(move){
        if(this.i==null){
            this.i=move.x;
            this.j=move.y;
            this.board.state[this.i][this.j]=1;
            this.updated =  true;
            return true;
        }
        let run=true;
        return this.move(move,run);
    }

    insideBoard(i,j){
        if(i>=this.board.cols || j>=this.board.rows || i<0 || j<0){
            return false;
        }
        else return true;
    }

    getMoves(run){
        let moves=[];
        for(let dir=0;dir<this.dirs.length;dir++){
            let i=this.i;
            let j=this.j;
            i = i + this.dirs[dir].x;
            j = j + this.dirs[dir].y;
            while(this.insideBoard(i,j)){
                if(this.board.state[i][j]>0){
                    break;
                }
                moves.push({x:i,y:j});
                i = i + this.dirs[dir].x;
                j = j + this.dirs[dir].y;
            }
        }
        
        const playerName = this.id=='P'?'Player':'Computer'
        // console.log(run)
        if(moves.length==0 && run){
            // popup.style.display = 'block';
            window.alert(`${playerName} lost the game`);
            console.log(`${playerName} lost the game`)
        }
        return moves;
        // console.log(this.moves) 
    }

    move(pos,run){
        // console.log(this.moves);
        // console.log(pos);
        this.moves = this.getMoves(run);
        if(this.moves.some(move => move.x === pos.x && move.y === pos.y)){
            let stepx = Math.sign(pos.x-this.i);
            let stepy = Math.sign(pos.y-this.j);
            let i = this.i;
            let j = this.j;
            this.board.state[i][j]=1;
            while(true){ 
                i = i + stepx;
                j = j + stepy;
                this.board.state[i][j]=1;
                // console.log(i,j)        
                if(pos.x==i && pos.y==j){
                    break;
                }        
            }
            this.i=pos.x;
            this.j=pos.y; 
            this.board.state[this.i][this.j]=1;
            this.updated =  true;
            return true;
        }
        else{
            if(run){
                console.log('Not a valid move');
            }         
            return false;
        }

        
    }

}