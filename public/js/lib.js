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
    document.body.style.overflow = 'hidden'
    if($i(d) != undefined){
        if($i(d).classList.contains('hide')){
            $i(d).classList.remove('hide');
            if(!$i(d).classList.contains('gray-back'))
                $i(d).classList.add('show');
        }
        else{
            if(!$i(d).classList.contains('show') && !$i(d).classList.contains('gray-back'))
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
    document.body.style.overflow = 'auto';
    
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


//create the book html element and append it to the parent
function book(i,title,author,isbn,tags){
	var img = document.createElement('img'),
	bElem = document.createElement('div'),
	cont = document.createElement('div'),
	p = document.createElement('p'),
	p1 = document.createElement('p'),
	h1 = document.createElement('p'),
	tag = document.createElement('p');
	
	bElem.classList.add('book');
	tag.classList.add('b-tag');

	img.src = i
	p1.innerHTML = isbn
	h1.innerHTML = title
	p.innerHTML = author
	tag.innerHTML = tags

	cont.appendChild(p1)
	cont.appendChild(h1)
	cont.appendChild(p)
	cont.appendChild(tag)

	bElem.appendChild(img)
	bElem.appendChild(cont)

	if($i('bcontainer'))
		$i('booksContain').insertAdjacentElement('afterbegin',bElem)

}
