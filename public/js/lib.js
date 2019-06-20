function $i(m){
    return document.getElementById(m);
}

function $c(m){
    return document.getElementsByClassName(m);
}

function cl(m){
    console.log(m);
}

function dc(m){
    return document.createElement(m)
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
            status:'1',
            seen:0
        })
        hide('gray-back-request','i')
        $c('book')[e.getAttribute('data-index')].children[3].innerHTML = '<center>Request is sent</cente>'
    }
}

//adding elements to transactions and notification list
function init_notif(){
    if(user){
        //retrieving the requests of the user
        
        ref.child('transactions').on('child_added',d=>{
            // if(m.exists()) 
            if(d.val().requester == user.id){
                // m.forEach(d=>{
                    var p = dc('p'),
                    p1 = dc('p')

                    p.appendChild(dc('br'))

                    ref.child('users/'+d.val().owner).once('value',n=>{
                        ref.child('books/'+d.val().book).once('value',o=>{
                            p.appendChild(document.createTextNode('Request for \''+o.val().title + '\' sent to ' + n.val().name))

                            //if the transaction is not accepted yet
                            if(d.val().status == 1){
                                $i('trans').children[2].children[0].insertAdjacentElement('afterbegin',p)
                            }
                            else{
                                //retrieving the successful requests
                                ref.child('notifications').orderByChild('trans').equalTo(d.key).once('value',q=>{
                                    if(q.exists()){
                                        q.forEach(z=>{
                                            if(z.val().status == 'accepted'){
                                                p1.appendChild(document.createTextNode(n.val().name + ' accepted request for ' + o.val().title + ', chat now'))
                                                p1.appendChild(dc('br'))
                                                p1.appendChild(dc('br'))
    
                                                $i('notifs').children[2].children[0].insertAdjacentElement('afterbegin',p1) 
                                                
                                                chatPop_add('requester',d,n,o)
                                            }
                                            if(z.val().status == 'declined'){
                                                p1.appendChild(document.createTextNode(n.val().name + ' declined request for ' + o.val().title))
                                                p1.appendChild(dc('br'))
                                                p1.appendChild(dc('br'))
    
                                                $i('notifs').children[2].children[0].insertAdjacentElement('afterbegin',p1) 
                                            }
                                        })
                                    }
                                })
                            }
                            
                        })
                    })
                // })
            }
             // if(m.exists()) 
             if(d.val().owner == user.id){
                // m.forEach(d=>{
                    var p = dc('p'),
                    button = dc('button'),
                    button1 = dc('button')

                    p.appendChild(dc('br'))

                    ref.child('users/'+d.val().requester).once('value',n=>{
                        ref.child('books/'+d.val().book).once('value',o=>{
                            ref.child('notifications').orderByChild('trans').equalTo(d.key).once('value',q=>{
                                q.forEach(v=>{
                                    if(v.exists()){
                                        cl('chat '+d.key)
                                        cl(v.val().status)
                                        if(v.val().status == 'accepted'){
                                            cl('chat accep')
                                            chatPop_add('owner',d,n,o)
                                        }
                                    }
                                })
                            })

                            p.appendChild(document.createTextNode(n.val().name + ' requested \''+o.val().title + '\' From you '))
                            p.appendChild(button1)
                            button1.innerHTML = 'Decline'
                            button1.onclick = ()=>{
                                ref.child('transactions/'+d.key).update({status:'-1'})
                                ref.child('notifications').push().set({trans:d.key,status:'declined',seen1:0,seen2:0}).then(()=>{
                                    p.remove()
                                })
                            }

                            p.appendChild(button)
                            button.innerHTML = 'Accept'
                            button.onclick = ()=>{
                                ref.child('transactions/'+d.key).update({status:'2'}).then(()=>{
                                    var dat = new Date();
                                    dat = dat.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#")
                                    ref.child('chats/'+d.key).update({seen1:0,seen2:0})
                                    ref.child('chats/'+d.key+'/messages').push({
                                        mess:'',
                                        date:dat,
                                        user:''
                                    })

                                    chatPop_add('owner',d,n,o)
                                })
                                ref.child('notifications').push().set({trans:d.key,status:'accepted',seen1:0,seen2:0}).then(()=>{
                                    p.remove()
                                })
                            }

                            if(d.val().status == "1"){
                                $i('trans').children[2].children[0].insertAdjacentElement('afterbegin',p)
                                $i('trans').children[0].style.display = 'block'
                            }
                        })
                    })
                // })
                }
        })

    }
}


function chatPop_add(t,d,n,o){
    if(t == 'owner'){
        ref.child('chats/'+d.key).once('value',m=>{
            if(m.val().seen1 == 0)
                $i('people').children[0].style.display = 'block'
        })
    }if(t == 'requester'){
        ref.child('chats/'+d.key).once('value',m=>{
            if(m.val().seen2 == 0)
                $i('people').children[0].style.display = 'block'
        })
    }
    var chat_head = dc('div')
    chat_head.setAttribute('data-trans',d.key)
    chat_head.onclick = ()=> {
        chat('open',chat_head)
        $i('location-confirm').innerHTML = 'Area: '+o.val().gov.charAt(0).toUpperCase()+o.val().gov.slice(1)+', '+o.val().area.charAt(0).toUpperCase()+o.val().area.slice(1)
        $i('location-confirm').parentElement.setAttribute('data-key',d.key)
    }
    chat_head.innerHTML = "Chat with "+n.val().name + " about '"+o.val().title + "'<br><br>"
    $i('people').children[2].children[0].insertAdjacentElement('afterbegin',chat_head)
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
        if(n.value.length > 2){
            $i('s-res-title').innerHTML = ''
            $i('s-res-author').innerHTML = ''
            $i('s-res-tags').innerHTML = ''
            searchBy('title',n.value)
            searchBy('title',n.value.charAt(0).toUpperCase()+n.value.slice(1))
            searchBy('author',n.value)
            searchBy('author',n.value.charAt(0).toUpperCase()+n.value.slice(1))
            searchBy('tags',n.value)
            searchBy('tags',n.value.charAt(0).toUpperCase()+n.value.slice(1))
        }
    }
    else {
        var xml = new XMLHttpRequest;
        xml.onreadystatechange = function(){
            if(this.status == 200 && this.readyState == 4)
                if(this.responseText != undefined){
                    setTimeout(()=>{
                        n.parentElement.children[1].children[0] = ''
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
                    },100)
                }
        }
        xml.open('get','https://www.googleapis.com/books/v1/volumes?q='+n.value+'&key=AIzaSyBBPeeNyKzSJaA7uOl0_Emt6gc-hEhuFQY',true);
        xml.send();
    }

  
}

function searchBy(t,v){
    ref.child('books').orderByChild(t).equalTo(v).once('value',m=>{
        //append an absolute select element
        if(m.exists()){
            m.forEach(d=>{
                let v = d.val()
                bookInfo = d;
                if(v.img)
                    var arr = {
                        im:v.img,
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
                else var arr = {
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
        }
        // else $i('s-res-'+t).innerHTML += 'No results found'
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
            var chatPop = dc('div'),
            chatHeader = dc('div'),
            chatCheck = dc('div'),
            tog = dc('button'),
            chatClose = dc('button'),
            chatBody = dc('div'),
            chatFooter = dc('form'),
            chatMess = dc('input'),
            chatSend = dc('input')
            
            chatPop.classList.add('chat-pop')
            chatHeader.classList.add('chat-header')
            chatBody.classList.add('chat-body')
            chatFooter.classList.add('chat-footer')
            chatMess.classList.add('chat-message')
            chatSend.classList.add('chat-send')

            chatMess.setAttribute('data-trans',e.getAttribute('data-trans'))

            // check1.type = 'checkbox'
            // check2.type = 'checkbox'
            chatMess.type = 'text'
            chatSend.type = 'submit'
            tog.innerHTML = '👌'
            tog.setAttribute("onclick","toggleId('gray-back-submit-location')")
            tog.setAttribute("onmouseover",'on=true')
            tog.setAttribute("onmouseleave",'on=false')
            
            chatFooter.onsubmit = ()=>{chat('send',chatMess);return false}

            ref.child('transactions/'+e.getAttribute('data-trans')).once('value',m=>{
                var nameKey;
                if(m.val().owner == user.id){
                    nameKey = m.val().requester
                    chatCheck.appendChild(tog)
                }
                else nameKey = m.val().owner
                ref.child('users/'+nameKey).once('value',n=>{
                    chatHeader.innerHTML += n.val().name
                }).then(()=>{
                    chatHeader.appendChild(chatClose)
                    chatHeader.appendChild(dc('br'))
                    ref.child('books/'+m.val().book).once('value',n=>{
                        chatHeader.innerHTML += 'Book title: \'' + n.val().title +'\''
                    })
                })
            })            

            // tog.onclick = ()=>toggleId('gray-back-submit-location')
            chatHeader.appendChild(chatCheck)
            chatPop.appendChild(chatHeader)
            chatPop.appendChild(chatBody)
            chatFooter.appendChild(chatMess)
            chatFooter.appendChild(chatSend)
            chatPop.appendChild(chatFooter)

            document.body.appendChild(chatPop)

            chatCheck.style.float = 'left'
            chatCheck.style.lineHeight = '7vh'
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
                ref.child('chats/'+e.getAttribute('data-trans')+'/messages').push({
                    mess:mess,
                    date:dat,
                    user:user.id
                })
            }
            break
        }
        case 'init':{
            var trans = e.parentElement.children[2].children[0].getAttribute('data-trans')
            ref.child('chats/'+trans+'/messages').on('child_added',m=>{mess_cache = m;chat('dis-mess',e)})
            // ref.child('chats/'+trans+'messages').on('value',m=>{mess_cache = m;chat('dis-mess',e)})
            break
        }
        case 'dis-mess':{
            var mess = dc('div'),
            p = dc('p'),
            date = dc('p')
            
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

function seenF(e,t){
    switch(t){
        case 'notifs':{
            ref.child('transactions').orderByChild('owner').equalTo(user.id).once('value',m=>{
                m.forEach(d=>{
                    ref.child('notifications').orderByChild('trans').equalTo(d.key).once('value',x=>{
                        x.forEach(g=>{
                            ref.child('notifications/'+g.key).update({seen1:1})
                            e.children[0].style.display = 'none'
                        })
                    })
                })
            })
            ref.child('transactions').orderByChild('requester').equalTo(user.id).once('value',m=>{
                m.forEach(d=>{
                    ref.child('notifications').orderByChild('trans').equalTo(d.key).once('value',x=>{
                        x.forEach(g=>{
                            ref.child('notifications/'+g.key).update({seen2:1})
                            e.children[0].style.display = 'none'
                        })
                    })
                })
            })
            break
        }
        case 'chats':{
            ref.child('transactions').orderByChild('owner').equalTo(user.id).once('value',m=>{
                m.forEach(d=>{
                    ref.child('chats/'+d.key).update({seen1:1})
                    e.children[0].style.display = 'none'
                })
            })
            ref.child('transactions').orderByChild('requester').equalTo(user.id).once('value',m=>{
                m.forEach(d=>{
                    ref.child('chats/'+d.key).update({seen2:1})
                    e.children[0].style.display = 'none'
                })
            })
            break
        }
        case 'trans':{
            ref.child('transactions').orderByChild('owner').equalTo(user.id).once('value',m=>{
                m.forEach(d=>{
                    ref.child('transactions/'+d.key).update({seen:1})
                    e.children[0].style.display = 'none'
                })
            })
            break
        }
        default:break
    }
}

function submitLocation(e){
    event.preventDefault()
    ref.child('transactions/'+e.getAttribute('data-key')).update({
        adress:$i('adress').value,
        day:$i('day').value,
        time:$i('time').value
    }).then(()=>{
        ref.child('chats/'+e.getAttribute('data-key')+'/messages').push({
            user:user.id,
            time:'',
            mess:'Meeting confirmation <br>'+$i('location-confirm').innerHTML+'<br>Adress: '+$i('adress').value+'<br> Day: '+$i('day').value+'<br> Time: '+$i('time').value
        })
    })
}