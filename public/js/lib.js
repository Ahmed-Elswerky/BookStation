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

//add a book request to the transactions parent
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

//adding elements to transactions and notification list
function init_notif(){
    if(user){
        //retrieving the requests of the user
        ref.child('transactions').orderByChild('requester').equalTo(user.id).once('value',m=>{
            if(m.exists()) 
                m.forEach(d=>{
                    var p = document.createElement('p'),
                    p1 = document.createElement('p')

                    p.appendChild(document.createElement('br'))

                    ref.child('users/'+d.val().owner).once('value',n=>{
                        ref.child('books/'+d.val().book).once('value',o=>{
                            p.appendChild(document.createTextNode('You requested \''+o.val().title + '\' From ' + n.val().name))

                            //if the transaction is not accepted yet
                            if(d.val().status == 1)
                                $i('trans').children[1].children[0].insertAdjacentElement('afterbegin',p)
                            //retrieving the successful requests
                            ref.child('notifications').orderByChild('trans').equalTo(d.key).once('value',q=>{
                                if(q.exists()){
                                    p1.appendChild(document.createTextNode(n.val().name + ' accepted your request for ' + o.val().title + ', And you can chat now from the chat list'))
                                    p1.appendChild(document.createElement('br'))
                                    p1.appendChild(document.createElement('br'))

                                    $i('notifs').children[1].children[0].insertAdjacentElement('afterbegin',p1) 
                                    
                                    chatPop_add(d,n,o)
                                }
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

                            ref.child('notifications').orderByChild('trans').equalTo(d.key).once('value',q=>{
                                if(q.exists()){
                                    chatPop_add(d,n,o)
                                }
                            })

                            p.appendChild(document.createTextNode(n.val().name + ' requested \''+o.val().title + '\' From you '))
                            p.appendChild(button)
                            button.innerHTML = 'Accept'
                            button.onclick = ()=>{
                                ref.child('transactions/'+d.key).update({status:'2'}).then(()=>{
                                    var dat = new Date();
                                    dat = dat.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#")
                                    ref.child('chats/'+d.key).push({
                                        mess:'',
                                        date:dat,
                                        user:''
                                    })

                                    chatPop_add(d,n,o)
                                })
                                ref.child('notifications').push().set({trans:d.key,status:'accpted'})
                            }

                            if(d.val().status == "1")
                                $i('trans').children[1].children[0].insertAdjacentElement('afterbegin',p)
                        })
                    })
                })
        })


    }
}


function chatPop_add(d,n,o){
    var chat_head = document.createElement('div')
    chat_head.setAttribute('data-trans',d.key)
    chat_head.onclick = ()=> chat('open',chat_head)
    chat_head.innerHTML = "Chat with "+n.val().name + " about "+o.val().title + "<br><br>"
    $i('people').children[1].children[0].insertAdjacentElement('afterbegin',chat_head)
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
    // n.parentElement.children[1].children[0].innerHTML ='';
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
    if(t=='search'){
        if(n.length > 2){
            
            var len=false,ti=0, int = setInterval(function(){
                n == undefined ? clearInterval(int) : 1;
                if(len == false)
                    len = n.length;
                if(len != false){
                    if(n.length == len){
                        if(ti == 10){
                            clearInterval(int); 
                            ti=0;
                            len = false;
                            cl('search after sec of stopping typing') 
                            searchBy('title',n)
                            searchBy('author',n)
                            searchBy('tags',n)
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

function searchBy(t,v){
    ref.child('books').orderByChild(t).equalTo(v).once('value',m=>{
        //append an absolute select element
        $i('s-res-'+t).innerHTML = ''

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
                sellPrice:v.sellPrice,
                gov:v.gov,
                area:v.area,
                user:v.userId,
                id:d.key
            }
            book(arr,$i('s-res-'+t),'select')
        })
    })
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
}//#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#

var mess_cache;
function chat(t,e=document.body){
    switch(t){
        case "open":{
            if($c('chat-pop')[0])
                $c('chat-pop')[0].remove()
            var chatPop = document.createElement('div'),
            chatHeader = document.createElement('div'),
            chatClose = document.createElement('button'),
            chatBody = document.createElement('div'),
            chatFooter = document.createElement('form'),
            chatMess = document.createElement('input'),
            chatSend = document.createElement('input')
            
            chatPop.classList.add('chat-pop')
            chatHeader.classList.add('chat-header')
            chatBody.classList.add('chat-body')
            chatFooter.classList.add('chat-footer')
            chatMess.classList.add('chat-message')
            chatSend.classList.add('chat-send')

            chatMess.setAttribute('data-trans',e.getAttribute('data-trans'))

            chatMess.type = 'text'
            chatSend.type = 'submit'

            chatFooter.onsubmit = ()=>{chat('send',chatMess);return false}

            ref.child('transactions/'+e.getAttribute('data-trans')).once('value',m=>{
                ref.child('users/'+m.val().owner).once('value',n=>{
                    chatHeader.innerHTML += n.val().name
                }).then(()=>{
                    chatHeader.appendChild(chatClose)
                })
                ref.child('books/'+m.val().book).once('value',n=>{
                    chatHeader.innerHTML += '<br>Book title: '+n.val().title
                })
            })            

            chatPop.appendChild(chatHeader)
            chatPop.appendChild(chatBody)
            chatFooter.appendChild(chatMess)
            chatFooter.appendChild(chatSend)
            chatPop.appendChild(chatFooter)

            document.body.appendChild(chatPop)

            chatClose.appendChild(document.createTextNode('X'))
            chatClose.style.float = 'right'
            chatClose.style.margin = '0.5rem'
            chatClose.setAttribute('onclick','$c(\'chat-pop\')[0].remove()')

            chat('init',chatBody)

            break
        }
        case "send":{
            if(e.value.length > 0){
                var mess = e.value
                e.value = ''
                var dat = new Date();
                dat = dat.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#")
                ref.child('chats/'+e.getAttribute('data-trans')+'messages').push({
                    mess:mess,
                    date:dat,
                    user:user.id
                })
            }
            break
        }
        case 'init':{
            var trans = e.parentElement.children[2].children[0].getAttribute('data-trans')
            cl(trans)
            ref.child('chats/'+trans+'messages').on('child_added',m=>{mess_cache = m;chat('dis-mess',e)})
            // ref.child('chats/'+trans+'messages').on('value',m=>{mess_cache = m;chat('dis-mess',e)})
            break
        }
        case 'dis-mess':{
            var mess = document.createElement('div'),
            p = document.createElement('p'),
            date = document.createElement('p')
            
            p.innerHTML = mess_cache.val().mess
            date.innerHTML = mess_cache.val().date

            date.style.fontSize = '0.5rem'
            
            mess.classList.add('chat-mess')
            if(mess_cache.val().user == user.id)
                mess.classList.add('mess-same')
            
            mess.appendChild(p)
            e.appendChild(date)
            e.appendChild(mess)
            mess.scrollIntoView()
            break
        }
        default:break;
    }
}