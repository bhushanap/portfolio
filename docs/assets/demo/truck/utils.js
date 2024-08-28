function wrap(angle){
    let ang = angle%(2*Math.PI)
    if(Math.abs(ang)>Math.PI){
       return ang - Math.sign(ang)*(2*Math.PI);
    }
    else{
        return ang
    }
}

function fricA(headA, velA){
    if(wrap(velA-headA)>0){
        return wrap(headA-(Math.PI/2))
    }
    else{
        return wrap(headA+(Math.PI/2))
    }
}