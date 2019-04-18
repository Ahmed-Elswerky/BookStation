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
    // document.body.style.overflow = 'hidden'
    if($i(d) != undefined){
        if($i(d).classList.contains('hide')){
            $i(d).classList.remove('hide');
            // if(!$i(d).classList.contains('gray-back'))
                // $i(d).classList.add('show');
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
    // document.body.style.overflow = 'auto';
    
}
  
function remove(t){
    for(var i = 0;i<$c(t).length;i++){
        $c(t)[i].remove();
    }
}    

function pLoad(p,i,f){
    cl(p)
    var xml = new XMLHttpRequest;
    xml.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4)
            if(this.responseText != undefined){
                $i(i).innerHTML += this.responseText
                f()
                fire.fixLinks();
            }
    }
    xml.open('get',dir+p+'.html?1',true);
    xml.send();
}



function page_title_active(){
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
}

function req(e){
    if(e.getAttribute('data-book') != undefined){
        ref.child('transactions').push().set({
            requester:user.id,
            book:e.getAttribute('data-book'),
            dat:Date(),
            info:$i('req-sel').value,
            owner:e.getAttribute('data-owner'),
            status:'1'
        })
        hide('gray-back-request','i')
    }
}

function init_notif(){
    if(user){
        ref.child('transactions').orderByChild('requester').equalTo(user.id).once('value',m=>{
            if(m.exists()) 
                m.forEach(d=>{
                    var p = document.createElement('p'),
                    p1 = document.createElement('p')

                    p.appendChild(document.createElement('br'))

                    ref.child('users/'+d.val().owner).once('value',n=>{
                        ref.child('books/'+d.val().book).once('value',o=>{
                            p.appendChild(document.createTextNode('You requested \''+o.val().title + '\' From ' + n.val().name))
                            $i('trans').children[1].children[0].insertAdjacentElement('afterbegin',p)
                            ref.child('notifications').orderByChild('trans').equalTo(d.key).once('value',q=>{
                                p1.appendChild(document.createElement('br'))
                                p1.appendChild(document.createElement('br'))
                                
                                p1.appendChild(document.createTextNode(n.val().name + ' accepted your request for ' + o.val().title + ', And you can chat now from the chat list'))
                                $i('notifs').children[1].children[0].insertAdjacentElement('afterbegin',p1) 
                            })
                        })
                    })
                })
        })

        ref.child('transactions').orderByChild('owner').equalTo(user.id).once('value',m=>{
            if(m.exists()) 
                m.forEach(d=>{
                    var p = document.createElement('p'),
                    button = document.createElement('button')

                    p.appendChild(document.createElement('br'))

                    ref.child('users/'+d.val().requester).once('value',n=>{
                        ref.child('books/'+d.val().book).once('value',o=>{
                            p.appendChild(document.createTextNode(n.val().name + ' requested \''+o.val().title + '\' From you '))
                            p.appendChild(button)
                            button.innerHTML = 'Accept'
                            button.onclick = ()=>{
                                ref.child('transactions/'+d.key).update({status:'2'}).then(()=>{
                                    ref.child('chats').update({
                                        [user.id]:[d.val().requester]
                                    })
                                })
                                ref.child('notifications').push().set({trans:m.key,status:'accpted'})
                            }
                            $i('trans').children[1].children[0].insertAdjacentElement('afterbegin',p)
                        })
                    })
                })
        })

        ref.child('chats/'+user.id).once('value',m=>{
            cl(m.val())
            m.forEach(d=>{
                cl(d.val())
            })
        })

    }
}



function assign(t,n,t1,f){
    switch(t){
        case 'sign':{
            n == 1 ? 
                validateEmail($i('sign-mail').value)?
                    slide(n,t1)
                :1
            : 1; 
            n == 2 ? 
                $i('sign-pass').value.length > 5 && $i('sign-uni').value.length >0  && $i('sign-phone').value.length >0?
                    sign('up')
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
        default:f == search? f(n,t1) : f(n);break;
    }
}

function search(n,t = ''){
    cl('aasd')
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
            var email = $i('sign-mail').value,
            pass = $i('sign-pass').value,
            name = $i('sign-f-name').value + ' ' + $i('sign-l-name').value,
            // uName = $i('sign-u-name').value,
            uni = $i('sign-uni').value,
            pho = $i('sign-phone').value;
            firebase.auth().createUserWithEmailAndPassword(email,pass).then(()=>{
                firebase.auth().currentUser.updateProfile({
                    displayName:name
                })
                ref.child('users/'+firebase.auth().currentUser.uid).set({
                    name:name,
                    email:email,
                    // userName:uName,
                    university:uni,
                    phone:pho
                });
                slide(2,'slide1')
            }).catch(err=>{
                $i('sign-err').innerHTML = err.message;
                slide(0,'slide1')
            });
            break;
        };
        case 'in':{
            var email = $i('log-mail').value,
            pass = $i('log-pass').value;
            firebase.auth().signInWithEmailAndPassword(email,pass).then(()=>{
                window.location.reload();
            })
            .catch(err=>{
                $i('log-err').innerHTML = err.message
            })
            break;
        };
        default:break;
    }
}



var key='0';
function bookInit(t){
    if(user != null){
        switch(t){
            case 'shelf':{
                ref.child('books/').once('value',m=>{
                    if(m.exists()){
                        m.forEach(d=>{
                            if(d.val().userId == user.id){
                                let v = d.val()
                                var arr = {
                                    im:'',
                                    title:v.title,
                                    author:v.author,
                                    isbn:v.isbn,
                                    tags:v.tags,
                                    id:d.key
                                }
                                book(arr,$i('bcontainer'))
                            }
                            key = m.key
                        })
                    }
                ref.child('books/').startAt(key).on('value',m=>{
                    if(m.exists()){
                        // m.forEach(d=>{
                            if(m.val().userId == user.id){
                                let v = m.val()
                                var arr = {
                                    im:'',
                                    title:v.title,
                                    author:v.author,
                                    isbn:v.isbn,
                                    tags:v.tags,
                                    id:m.key
                                }
                                book(arr,$i('bcontainer'))
                            }
                        // })
                    }
                })
                })
                break;
            }
            case 'home':{
                ref.child('books/').orderByKey().once('value',m=>{
                    cl('home books')
                    if(m.exists()){
                        m.forEach(d=>{
                            if(d.val().userId != user.id){
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
                                    sellPrice:v.sellPrice,
                                    gov:v.gov,
                                    area:v.area,
                                    user:v.userId,
                                    id:d.key
                                }
                                book(arr,$i('bcontainer'))
                            }
                        })
                    }
                })
                break;
            }
            default:cl('def');break;
        }
        
    }
}

//create the book html element and append it to the parent
function book(arr,i){
	var img = document.createElement('img'),
	bElem = document.createElement('div'),
	cont = document.createElement('div'),
	p = document.createElement('p'),
	p1 = document.createElement('p'),
	h1 = document.createElement('p'),
	tag = document.createElement('p'),
    userCont = document.createElement('div'),
    userName = document.createElement('h1'),
    gover = document.createElement('p'),
    areaa = document.createElement('p');
	
	bElem.classList.add('book');
	tag.classList.add('b-tag');

    firebase.storage().ref().child('images/'+arr.title).getDownloadURL().then(I=>{
        img.src = I
    });

    

    p1.innerHTML = arr.isbn;p1.title = arr.isbn
	h1.innerHTML = arr.title;h1.title = arr.title
	p.innerHTML = arr.author;p.title = arr.author
	tag.innerHTML = arr.tags;tag.title = arr.tags
    


	cont.appendChild(p1)
	cont.appendChild(h1)
	cont.appendChild(p)
	cont.appendChild(tag)

    


	bElem.appendChild(img)
	bElem.appendChild(cont)

    if(i.classList.contains('home-p')){
        ref.child('users/'+arr.user).once('value',m=>{
            userName.innerHTML = userName.title = m.val().name
        })

        userCont.appendChild(userName)
        userCont.appendChild(gover)
        userCont.appendChild(areaa)

        gover.innerHTML = arr.gov;gover.title = arr.gov
        areaa.innerHTML = arr.area;areaa.title = arr.area

        bElem.appendChild(userCont)
    }
    
    if(i)
        if(i.parentElement.parentElement.getAttribute('data-type') == 'pop' || i.getAttribute('id') == 'bookAdd'){
            let dWrap = document.createElement('div')
            dWrap.style.cursor = 'crosshair'
            dWrap.onclick = ()=>{
                $i('bookAdd').innerHTML = ''
                $i('bookAdd').appendChild(bElem.cloneNode(true))
                slide(2,'slide2')
            }
            dWrap.appendChild(bElem)
            $i('bookId').value = arr.key
            i.insertAdjacentElement('afterbegin',dWrap)
        }
        if(i.classList.contains('home-p')){
            var pc1 = document.createElement('h1'),
            div = document.createElement('div'),
            pc2 = document.createElement('h1'),
            pc3 = document.createElement('h1'),
            pc = document.createElement('p')
        
            pc.innerHTML = 'Available for: ';
        	div.appendChild(pc)
            if(arr.lend){
                pc1.innerHTML += 'Borrow (For: ' + arr.lendPrice + ' L.E)'
                div.appendChild(pc1)
            }
            if(arr.swap){
                pc2.innerHTML += 'Swap (With: ' + arr.swapStars + ' Book/s)'
                div.appendChild(pc2)
            }
            if(arr.sell){
                pc3.innerHTML += 'Buy (For: ' + arr.sellPrice + ' L.E)'
                div.appendChild(pc3)
            }
            var bu = document.createElement('button');
            bu.onmouseover=()=>{on=true}
            bu.onmouseout=()=>{on=false}

            bu.innerHTML = 'Request';
            
            div.appendChild(bu)
            bElem.appendChild(div)
           /////////////////////////////////////////////////////////
            bu.onclick = ()=>{
                $i('init-req').children[0].innerHTML = ''
                $i('req-sel').innerHTML = ''

                var op = document.createElement('option'),
                bElem2 = bElem.cloneNode(true)
                bElem2.children[3].remove()

                $i('init-req').children[0].insertAdjacentElement('afterbegin',bElem2)

                if(arr.lend){
                    op.innerHTML = ''
                    op.appendChild(document.createTextNode(pc1.innerHTML))
                    op.value = 'lend,'+arr.lendPrice
                    $i('req-sel').appendChild(op.cloneNode(true))
                }
                
                if(arr.swap){
                    op.innerHTML = ''
                    op.appendChild(document.createTextNode(pc2.innerHTML))
                    op.value = 'swap,'+arr.swapStars
                    $i('req-sel').appendChild(op.cloneNode(true))
                }

                if(arr.sell){
                    op.innerHTML = ''
                    op.appendChild(document.createTextNode(pc3.innerHTML))
                    op.value = 'sell,'+arr.sellPrice
                    $i('req-sel').appendChild(op.cloneNode(true))
                }
                if($i('req-send') != undefined){
                    $i('req-send').setAttribute('data-book',arr.id)
                    $i('req-send').setAttribute('data-owner',arr.user)
                }
                
                toggleId('gray-back-request')
                /*
                function(){
                    toggleId('gray-back-request)
                }
                */
            }
            ///////////////////////////////////////////////////////////////
            i.insertAdjacentElement('afterbegin',bElem)
        }
        else 
            i.insertAdjacentElement('afterbegin',bElem)

}

Date.prototype.customFormat = function(formatString){
  var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
  YY = ((YYYY=this.getFullYear())+"").slice(-2);
  MM = (M=this.getMonth()+1)<10?('0'+M):M;
  MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
  DD = (D=this.getDate())<10?('0'+D):D;
  DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
  th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
  formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
  h=(hhh=this.getHours());
  if (h==0) h=24;
  if (h>12) h-=12;
  hh = h<10?('0'+h):h;
  hhhh = hhh<10?('0'+hhh):hhh;
  AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
  mm=(m=this.getMinutes())<10?('0'+m):m;
  ss=(s=this.getSeconds())<10?('0'+s):s;
  return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}//# DD#/#MM#/#YYYY# #hh#:#mm#:#ss#

