function $i(m){
    return document.getElementById(m);
}

function $c(m){
    return document.getElementsByClassName(m);
}

function cl(m){
    console.log(m);
}

function toggleId(d){
    if($i(d) != undefined){
        if($i(d).classList.contains('hide')){
            $i(d).classList.remove('hide');
            $i(d).classList.add('show');
        }
        else{
            if(!$i(d).classList.contains('show'))
                $i(d).classList.add('show');
        }
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//Hiding function to hide elements, c for class and i for id selectors
function hide(t,k){
    if(k == 'c' && $c(t))
        for(var i = 0;i<$c(t).length;i++){
            if(!$c(t)[i].classList.contains('hide'))
                $c(t)[i].classList.add('hide');
            if($c(t)[i].classList.contains('show'))
                $c(t)[i].classList.remove('show');
            // cl($c(t)[i]);
            // cl(new Error().stack.split('\n')[1])
        }

    if(k == 'i' && $i(t))
        if(!$i(t).classList.contains('hide'))
            $i(t).classList.add('hide');
}
  
function remove(t){
    for(var i = 0;i<$c(t).length;i++){
        $c(t)[i].remove();
    }
}    

function pLoad(p,i,f){
    var xml = new XMLHttpRequest;
    xml.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4)
            if(this.responseText != undefined){
                $i(i).innerHTML += this.responseText
                f()
                fire.fixLinks();
                cl('load')
            }
    }
    xml.open('get',dir+p+'.html',true);
    xml.send();
}

