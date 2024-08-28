class Move{
    constructor(x,y,value = null,parent=null){
        this.x = x;
        this.y = y;
        this.value = value;
        this.parent = parent;   
        this.moves = [];
        this.level = 0;
    }
}