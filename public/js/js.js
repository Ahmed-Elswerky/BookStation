

var user,on = false,ref=firebase.database().ref(),booksJs=0;
var bookInfo;

var fire = {
    fillHead:function(){
        document.head.insertAdjacentHTML('afterbegin','\
        <meta charset="utf-8" />\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\
        <link rel="shortcut icon" href="'+dir+'imgs/00-BS_Logo.gif" type="image/x-icon">\
        <link rel="stylesheet" type="text/css" media="screen" href="'+dir+'css/css.css" />\
        <link href="https://fonts.googleapis.com/css?family=Fredoka+One" rel="stylesheet">\
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
        page_title_active()

        

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
                // if(!document.body.classList.contains('home-p'))
                //     window.location.href = 'home.html' 

                $i('username').innerHTML = user.name;

                //book shelf page fill
                if(booksJs != 0 && document.body.getAttribute('data-page') == "book-shelf")
                    bookInit('shelf');

                if(document.body.classList.contains('home-p'))
                    bookInit('home')
            }
            else{
                user = false;

                // pLoad('intro','bcontainer',fire.fixLinks)
                if($i('intro-redirect') != undefined)
                    $i('intro-redirect').click();
                pLoad('register pops','bcontainer',fire.fixLinks);
                hide('in','c');
                remove('in','c');  

            } 
            // hide('loading','c');
            toggleId('navbar')
            init_notif();
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
            $i('sign-f-name').focus()
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
        n==1? $i('sign-pass').focus():1;
    }
    else cl('no');
}
