

var name,email,id,on = false;

window.onload = function(){
    firebase.auth().onAuthStateChanged(u=>{
        if(u){
            id = u.uid;
            email = u.email;
            pLoad('main');
            hide('out','c');
            $i('user').innerHTML = '<li style=\'font-size:1.4rem;font-weight:500;\'>'+firebase.auth().currentUser.displayName+'<li>'+'<a href=\'#\' style=\'font-size:0.7rem;margin:1vw\' onclick=\'firebase.auth().signOut()\'>Log out</small>';
        }
        else{
            pLoad('register pops','bcontainer');
            hide('in','c');  
        } 
        hide('loading','c');
        document.body.style.overflow = 'auto';
    });

    document.body.addEventListener('click',function(){
        if(!on){
            hide('hidable','c');
            slide(0,'l');
        }
    });
}



function pop(t){
    if($i('gray-back-log') == undefined || $i('gray-back-sign') == undefined){
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
        default:break;
    }
}
var ln=0,
    sld = [true,false,true,true],name=false,c=0,len=false,ti=0;    
function slide(n){
    var sl = $c('slide');
    if(sl[n]){
        Array.from(sl).forEach (s=>{
            if(s.classList.contains('s-show')){
                s.classList.remove('s-show');
                s.classList.add('s-hide');
            }

        });
        if(sl[n].classList.contains('s-hide'))
            sl[n].classList.remove('s-hide');
        sl[n].classList.add('s-show');
        n == 2? sign('up'):1;
    }
    else cl('no');
}

function assign(t,n){
    switch(t){
        case 'sign':{
            n == 1 ? 
                validateEmail($i('sign-mail').value) && $i('sign-name').classList.contains('in-success') ?
                    slide(n)
                :1
            : 1; 
            n == 2 ? 
                $i('sign-pass').value.length > 5 && $i('sign-place').value.length >0  && $i('sign-phone').value.length >0 ?
                    slide(n)
                : 1 
            : 1; 
            cl('asdasdasd')
            break;
        };
        case 'fire-check':{
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
                                firebase.database().ref('users/').orderByChild(n.getAttribute('data-type')).equalTo(n.value).once('value').then(m=>{
                                    if(m.val() != null){
                                        $i(n.getAttribute('data-type')+'-err').innerText = n.getAttribute('data-type')+'is taken';
                                        $i(n.getAttribute('data-type')+'-err').classList.add('danger');
                                        if($i(n.getAttribute('data-type')+'-err').classList.contains('success'))
                                            $i(n.getAttribute('data-type')+'-err').classList.remove('success');
                                    }    
                                    else {
                                        n.classList.add('in-success');
                                    }
                                });
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



function sign(t){
    switch(t){
        case 'up':{
            if($i('form-alert'))
                $i('form-alert').remove();
            cl('up');
            var email = $i('sign-mail').value,
            pass = $i('sign-pass').value,
            name = $i('sign-name').value;
            firebase.auth().createUserWithEmailAndPassword(email,pass).then(()=>{
                firebase.auth().currentUser.updateProfile({
                    displayName:name
                })
            }).catch(function(err){
                cl(err.message)
            });
            break;
        };
        case 'in':{
            cl('in');
            var email = $i('log-mail').value,
            pass = $i('log-pass').value;
            firebase.auth().signInWithEmailAndPassword(email,pass);
            firebase.database().ref('users/'+id).once('value').then(m=>{
                name = m.val().name;
            })
            break;
        };
        default:break;
    }
}
