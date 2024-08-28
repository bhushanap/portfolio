let moves = 0;
let x = null;
let y = null;
let first = false;
let rows = 6;
let cols = 6;
let memory = 120000;
const max_depth = 31;
let flag = 0;
let running = false;

const boardCanvas = document.getElementById('boardCanvas')
boardCanvas.width = window.innerWidth*0.75;
boardCanvas.height = window.innerHeight*0.75;
const boardCtx = boardCanvas.getContext('2d');
const info = document.getElementById('info');
const runButton = document.getElementById('runButton');
const gameSelector = document.getElementById('gameSelector');
const firstSelector = document.getElementById('firstSelector');
const firstTSelector = document.getElementById('firstTSelector');
const nodeSlider = document.getElementById('nodeSlider');
const nodeValue = document.getElementById('nodeValue');
const nodeContainer = document.getElementById('nodeContainer');
const colSlider = document.getElementById('colSlider');


let board = new Board(boardCanvas.width/2,boardCanvas.height/2,
    Math.min(boardCanvas.width,boardCanvas.height)*0.9,rows,cols);
let player = new Queen(board,'P',{x:null,y:null},first);
let opponent = new Queen(board,'AI',{x:x,y:y},!first);

board.draw(boardCtx);


gameSelector.addEventListener('change', function () {
  if (gameSelector.value === 'Player') {
    info.style.justifyContent = 'center';
    info.textContent = 'Play locally vs another human. Press Run to Start!';
    info.style.textAlign = 'center';
    // opponent = new Queen(board,'P2',{x:null,y:null},!first);
    nodeContainer.style.display = 'none';
    nodeSlider.style.display = 'none';
    nodeValue.style.display = 'none';
    firstTSelector.style.display = 'none';
    firstSelector.style.display = 'none';


  } else if (gameSelector.value === 'AI') {
    // opponent = new Queen(board,'AI',{x:x,y:y},!first);
    info.textContent = 'Play against AI. Press Run to Start!';
    nodeContainer.style.display = 'block';
    nodeSlider.style.display = 'block';
    nodeValue.style.display = 'block';
    firstTSelector.style.display = 'block';
    firstSelector.style.display = 'block';
    
  }
});
firstSelector.addEventListener('change', function () {
    if (firstSelector.value === 'Player') {
        first = true;
        console.log(first);
        info.textContent = 'AI will go second. Press Run to Start!';
        // player = new Queen(board,'P',{x:null,y:null},first);
        // opponent = new Queen(board,'AI',{x:x,y:y},!first);
    } else if (firstSelector.value === 'AI') {
        first = false;
        console.log(first);
        info.textContent = 'AI will go first. Press Run to Start!';
        // player = new Queen(board,'P',{x:null,y:null},first);
        // opponent = new Queen(board,'AI',{x:x,y:y},!first);
    }
  });

runButton.addEventListener('click', () => {
    // console.log('run');
    if(!running){
        board = new Board(boardCanvas.width/2,boardCanvas.height/2,
        Math.min(boardCanvas.width,boardCanvas.height)*0.9,rows,cols);
        player = new Queen(board,'P',{x:null,y:null},first);
        opponent = new Queen(board,gameSelector.value=='AI'?'AI':'P2',{x:x,y:y},!first);
        console.log(player.id);
        console.log(opponent.id);
        running = true;
        info.textContent = opponent.id=='P2'?'Player 1 turn! Click to make a move.':'Player turn! Click to make a move.';
        runButton.textContent = 'Restart';
        isAnimating=true;
        animate();
      }
    else{
        running = false;
        runButton.textContent = 'Run';
        isAnimating=false;
        location.reload();
    }
   
})


nodeSlider.addEventListener('input', function () {
    memory = parseInt(nodeSlider.value);
    nodeValue.textContent = nodeSlider.value;
  });

colSlider.addEventListener('input', function () {
cols = parseInt(colSlider.value);
rows = cols;
colValue.textContent = colSlider.value;
let board = new Board(boardCanvas.width/2,boardCanvas.height/2,
Math.min(boardCanvas.width,boardCanvas.height)*0.9,rows,cols);

board.draw(boardCtx);
});

// rowSlider.addEventListener('input', function () {
//     rows = parseInt(rowSlider.value);
//     rowValue.textContent = rowSlider.value;
//     let board = new Board(boardCanvas.width/2,boardCanvas.height/2,
//     Math.min(boardCanvas.width,boardCanvas.height)*0.9,rows,cols);

//     board.draw(boardCtx);
//     });

boardCanvas.addEventListener('click', (event) => {
    // console.log((event.clientX),(event.clientY));
    // console.log((board.left),(board.top));
    const rect = boardCanvas.getBoundingClientRect();
    clickx = Math.floor((event.x-board.left-rect.left)/board.sqw);
    clicky = Math.floor((event.y-board.top-rect.top)/board.sqh);
    console.log(clickx,clicky);
    if(clickx<0 || clicky<0 || clickx>=board.cols || clicky>=board.rows){
        // console.log('wrong click');
        return;
        
    }
    // console.log('clicked')
    isAnimating=false;
    
    if(player.turn){
        console.log('P1 turn');
        
        
        valid = player.update({x:clickx,y:clicky});
        if(valid)
        {info.textContent = opponent.id=='P2'?'Player 1 turn! Click to make a move.':'AI is thinking..... (Decrease number of nodes if it runs slow)';
        player.turn=false;
        opponent.turn=true;
        flag = 0;
        moves++;}
   
    }
    else{
        
        if(opponent.turn && opponent.id=='P2'){
            console.log('P2 turn');
            
            valid = opponent.update({x:clickx,y:clicky});
            if(valid)
            {info.textContent = 'Player 2 turn! Click to make a move.';
            opponent.turn=false;
            player.turn=true;
            flag = 0;
            moves++;}
        // let tree = new Minimax(opponent,player);
        // bestmove = tree.find();
        // valid = opponent.update({x:bestmove.x,y:bestmove.y});
        // if(valid){
        //     player.turn=true;
        //     opponent.turn=false;
        // }
       
    }

}

// console.log(board.State)
isAnimating=true;
// animate();
});






// isAnimating=false;
function aimove(){
    let bestmove = null;
    isAnimating = false;
    info.textContent = 'Player turn! Click to make a move.';
    if(moves==0){
        x = Math.floor( (cols- 2) * Math.random() + 1);
        y =  Math.floor( (rows- 2) * Math.random() + 1);
        bestmove = {x:x,y:y};
        while(board.state[x][y]!=0){
            x = Math.floor( (cols- 2) * Math.random() + 1);
            y =  Math.floor( (rows- 2) * Math.random() + 1);
            bestmove = {x:x,y:y};
        }
    }
    if(!bestmove){
        let tree = new Minimax(opponent,player);
        // console.log('hol')
        for(let d = 2;d<=max_depth;d=d+1){
            // console.log('hola');
            tree = new Minimax(opponent,player,d)
            tree.find();
            console.log(d,tree.moves.length);
            if(tree.moves.length>memory){
                break;
            }
        }
        bestmove = tree.find();
    }
    
        valid = opponent.update({x:bestmove.x,y:bestmove.y});
        if(valid){
            player.turn=true;
            opponent.turn=false;
        }
        moves = moves+1;
        player.turn=true;
        opponent.turn=false;
        isAnimating=true;
        // info.textContent = 'Player turn! Click to make a move.';
        // console.log(moves);
}


function animate(){
    if(!isAnimating){
        return;
    }
    
    // setCanvas();
    board.draw(boardCtx);
    player.draw(boardCtx);
    opponent.draw(boardCtx);
    if(flag==30 && opponent.turn && opponent.id=='AI'){
        aimove();
    }
    
    flag = flag + 1;
    // console.log(flag)

    // console.log(board.State);
    // player.update(move);
    // console.log(board.State);
    // opponent.update(move);
    // console.log(board.State);
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 10);
}




// p1move = board.getMove();
