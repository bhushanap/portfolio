class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    add(v2){
        return {x: this.x+v2.x,y: this.y+v2.y}
    }

    sub(v2){
        return {x: this.x-v2.x,y: this.y-v2.y}
    }

    mag(){
        return (this.x**2 + this.y**2)**0.5
    }
    
    scale(k){
        return {x: this.x*k,y: this.y*k};
    }

    unit(){
        return this.scale(1/this.mag());
    }

    proj(v2){
        let projl = v2.x*this.x + v2.y*this.y /  v2.mag();
        return {x: v2.x * projl,y: v2.y * projl}
    }

    perp(v2){
        return this.sub(this.proj(v2));
    }

    ang(){
        return Math.atan2(-this.x,-this.y)
    }

    angdiff(v2){
        return wrap(this.ang()-v2.ang());
    }    

    rot(t){
        return{x: this.x*Math.cos(t) - this.y*Math.sin(t), y: this.x*Math.sin(t) + this.y*Math.cos(t)}
    }
}