

var user,on = false,ref=firebase.database().ref(),booksJs=0;
var bookInfo;

var fire = {
    fillHead:function(){
        document.head.insertAdjacentHTML('afterbegin','\
        <meta charset="utf-8" />\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\
        <link rel="shortcut icon" href="'+dir+'imgs/00-BS_Logo.gif" type="image/x-icon">\
        <link rel="stylesheet" type="text/css" media="screen" href="'+dir+'css/css.css" />\
        ');
    },
    fixLinks:function(){
        if($c('f-l-s'))
            [].forEach.call($c('f-l-s'),e=>{
                e.setAttribute('src',dir+e.getAttribute('src'))
                // cl(e)
                if(e.classList.contains('f-l-s')){ 
                    e.classList.remove('f-l-s')
                }
            })
        if($c('f-l-h'))
            [].forEach.call($c('f-l-h'),e=>{
                e.setAttribute('href',dir+e.getAttribute('href'))
                // cl(e)
                if(e.classList.contains('f-l-h')){ 
                    e.classList.remove('f-l-h')
                }
            })
        // if($c('f-l-h'))
    },
    load:function(){
        // making the link of the page in the navbar unique to refere to the curernt location
        if(document.body.getAttribute('data-page') != undefined){
            [].forEach.call($c('menu-link'),(d)=>{
                var dcla = d.classList;
                if(dcla.contains('active'))
                    dcla.remove('active')
            })            
            let cla = $i(document.body.getAttribute('data-page')).classList;
            if(!cla.contains('active'))
                cla.add('active')
        }
        if(document.body.classList.contains('home-p'))
            ref.child('books/').once('value',m=>{
                cl('home books')
                if(m.exists()){
                    m.forEach(d=>{
                        let v = d.val()
                        bookInfo = d;
                        var arr = {
                            im:'',
                            title:v.title,
                            author:v.author,
                            isbn:v.isbn,
                            tags:v.tags,
                            swap:v.swap,
                            swapStars:v.swapStars,
                            lend:v.lend,
                            lendPrice:v.lendPrice,
                            lendPoints:v.lendPoints,
                            sell:v.sell,
                            sellPrice:v.sellPrice
                        }
                       
                        firebase.storage().ref().child('images/'+v.title).getDownloadURL().then(i=>{
                            arr.im = i
                            book(arr,$i('bcontainer'))
                        }).catch(m=>{
                            cl(m.message)
                            book(arr,$i('bcontainer'))

                        })
                    })
                }
            })

        firebase.auth().onAuthStateChanged(u=>{
            if(u){
                user = {
                    id:u.uid,
                    email:u.email,
                    name:u.displayName
                }
                // pLoad('intro','bcontainer',fire.fixLinks)
                
                hide('out','c');
                remove('out','c');

                $i('username').innerHTML = user.name;

                //book shelf page fill
                if(booksJs != 0)
                    bookInit();
            }
            else{
                user = false;

                pLoad('intro','bcontainer',fire.fixLinks)
                
                pLoad('register pops','bcontainer',fire.fixLinks);
                hide('in','c');
                remove('in','c');  

            } 
            // hide('loading','c');
            toggleId('navbar')
        });
    }
}

window.onload = function(){
    fire.fillHead();

    pLoad('navbar','navbar',fire.load)

    document.body.addEventListener('click',function(){
        if(!on){
            hide('hidable','c');
            !user? slide(0,'l'):1;
        }
    });
}



function pop(t){
    if(($i('gray-back-log') == undefined || $i('gray-back-sign') == undefined) && !user){
        pLoad('register pops');
    }
    
    switch(t){
        case 'up':{
            toggleId('gray-back-sign');
            break;
        };
        case 'in':{
            toggleId('gray-back-log');
            break;
        };
        case 'add-book':{
            toggleId('gray-back-add-book');
            break
        }
        default:break;
    }
}

var ln=0,
    sld = [true,false,true,true],name=false,c=0,len=false,ti=0;    
function slide(n,t){
    var sl = $c(t);
    if(sl[n]){
        Array.from(sl).forEach(s=>{
            if(!s.classList.contains('hide')){
                s.classList.add('hide');
            }
        });
        if(sl[n].classList.contains('hide'))
            sl[n].classList.remove('hide');
        // sl[n].classList.add('s-show');
        t == 'slide1' && n == 2? sign('up'):1;
    }
    else cl('no');
}


function assign(t,n,t1,f){
    switch(t){
        case 'sign':{
            n == 1 ? 
                validateEmail($i('sign-mail').value) && $i('sign-u-name').classList.contains('in-success') ?
                    slide(n,t1)
                :1
            : 1; 
            n == 2 ? 
                $i('sign-pass').value.length > 5 && $i('sign-place').value.length >0  && $i('sign-phone').value.length >0 ?
                    slide(n,t1)
                : 1 
            : 1; 
            break;
        };
        case 'check':{
            if(c == 0){
                c++;
                var int = setInterval(function(){
                    n == undefined ? clearInterval(int) : 1;
                    if(len == false)
                        len = n.value.length;
                    if(len != false){
                        cl('len is not false');
                        if(n.value.length == len){
                            if(ti == 10){
                                clearInterval(int); 
                                ti=0;
                                len = false;
                                c=0;
                                f == search? f(n,t1) : f(n);
                                
                                cl('did not type for 1sec');
                            }
                            ti++;
                        }
                        else{
                            len = false;
                            ti = 0;
                        }
                    }
                },100);
                
            }
            break;
        };
        default:break;
    }
}

function search(n,t = ''){
    n.parentElement.children[1].children[0].innerHTML ='';
    if(t == 'main'){
        firebase.database().ref('users/').orderByChild('title').equalTo(n.value).once('value').then(m=>{
            if(m.val() != null){
                // $i(n.innerText = n.getAttribute('data-type')+'is taken';
                n.classList.add('danger');
                if(n.classList.contains('in-success'))
                    n.classList.remove('in-success');
            }    
            else {
                n.classList.add('in-success');
            }
        })
    }
    else {
        var xml = new XMLHttpRequest;
        xml.onreadystatechange = function(){
            if(this.status == 200 && this.readyState == 4)
                if(this.responseText != undefined){
                    setTimeout(()=>{
                        JSON.parse(this.responseText).items.forEach(d=>{
                            var arr = {
                                im:d.volumeInfo.imageLinks.smallThumbnail,
                                title:d.volumeInfo.title,
                                author:d.volumeInfo.authors[0],
                                isbn:d.volumeInfo.industryIdentifiers[0].identifier,
                                tags:d.volumeInfo.categories[0]
                            }
                            book(arr,n.parentElement.children[1].children[0])
                            // n.parentElement.children[1].children[0].innerHTML += d.volumeInfo.title+'<br><br>'
                        })
                    },300)
                }
        }
        xml.open('get','https://www.googleapis.com/books/v1/volumes?q='+n.value+'&key=AIzaSyBBPeeNyKzSJaA7uOl0_Emt6gc-hEhuFQY',true);
        xml.send();
    }

  
}

function fireCheck(n){
    firebase.database().ref('users/').orderByChild(n.getAttribute('data-type')).equalTo(n.value).once('value').then(m=>{
        if(m.val() != null){
            // $i(n.innerText = n.getAttribute('data-type')+'is taken';
            n.classList.add('danger');
            if(n.classList.contains('in-success'))
                n.classList.remove('in-success');
        }    
        else {
            n.classList.add('in-success');
        }
    });
}



function sign(t){
    switch(t){
        case 'up':{
            if($i('form-alert'))
                $i('form-alert').remove();
            cl('up');
            var email = $i('sign-mail').value,
            pass = $i('sign-pass').value,
            name = $i('sign-f-name').value + ' ' + $i('sign-l-name').value,
            uName = $i('sign-u-name').value;
            firebase.auth().createUserWithEmailAndPassword(email,pass).then(()=>{
                firebase.auth().currentUser.updateProfile({
                    displayName:name
                })
                ref.child('users/'+firebase.auth().currentUser.uid).set({
                    name:name,
                    email:email,
                    userName:uName
                });
            }).catch(function(err){
                cl(err.message)
            });
            break;
        };
        case 'in':{
            cl('in');
            var email = $i('log-mail').value,
            pass = $i('log-pass').value;
            firebase.auth().signInWithEmailAndPassword(email,pass).then(()=>{
                window.location.reload();
            });
            break;
        };
        default:break;
    }
}
