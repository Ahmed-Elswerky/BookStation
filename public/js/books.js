
booksJs = 1;


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
                        })
                    }
                })
                break;
            }
            case 'home':{
                ref.child('books/').orderByKey().once('value',m=>{
                    if(m.exists()){
                        m.forEach(d=>{
							//displaying the books that the user doesn't own
                            if(d.val().userId != user.id){
								ref.child('transactions').orderByChild('book').equalTo(d.key).once('value',n=>{
									var exis = true
									n.forEach(e=>{
										if(e.exists()){
											exis *= false
										}
									})
									if(exis){
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
										exis = true
									}
								})
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


function submitBook(event){
	event.preventDefault()
    if($i('gray-back-add-book'))cl('asd')
        if(user.id != null){
			cl('aa')
			
			if($i('file').files != null){
	        	var sRef = firebase.storage().ref('images/'+$i('title').value).put($i('file').files[0]).then(m=>{
					cl(m)
				})
				cl(sRef)
			}
			else cl($i('title').files)
			
			var arr = {
				title:$i('title').value,
				author:$i('author').value,
				isbn:$i('isbn').value,
				tags:$i('tags').value
			}

			var boo = ref.child('books').push()
			arr.key = boo.key
			boo.set({
                title:arr.title,
                author:arr.author,
                isbn:arr.isbn,
                tags:arr.tags,
                from:'custom'
            }).then(()=>{
				$i('title').value = $i('author').value = $i('isbn').value = $i('tags').value = ''
				book(arr,$i('bookAdd'))
				// hide('hidable','c')
				slide(2,'slide2')
            })
            cl('success')
        }
}

function submitBookInfo(event){
	event.preventDefault()
	if($i('gray-back-add-book'))cl('asd')
        if(user.id != null){
			ref.child('books/'+$i('bookId').value).update({
                swap:$i('swap').checked,
                swapStars:$i('swap-stars').value,
                lend:$i('lend').checked,
                lendPrice:$i('price-g').value,
                lendPoints:$i('point').value,
				sell:$i('sell').checked,
				sellPrice:$i('price').value,
				userId:user.id,
				gov:$i('gov').value,
				area:$i('area').value
            }).then(()=>{
				hide('hidable','c')
				slide(0,'slide2')
            })
            cl('success')
        }
}

//create the book html element and append it to the parent
function book(arr,i,t=''){
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

        userName.style = '	background: rgb(212, 127, 48);\
						    color: white;\
						    font-weight: bold;\
						    border-radius: 5vw;\
						    padding: 0.1rem 0.45rem;margin:auto'

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
                pc1.innerHTML += 'Borrow (For: ' + arr.lendPrice + ' EGP)'
                div.appendChild(pc1)
            }
            if(arr.swap){
                pc2.innerHTML += 'Swap (With: ' + arr.swapStars + ' Book/s)'
                div.appendChild(pc2)
            }
            if(arr.sell){
                pc3.innerHTML += 'Buy (For: ' + arr.sellPrice + ' EGP)'
                div.appendChild(pc3)
            }
            var bu = document.createElement('button');
            bu.onmouseover=()=>{on=true}
            bu.onmouseout=()=>{on=false}

            bu.innerHTML = 'Request';
            bu.classList.add('btn')
            bu.style = 'border-radius: 15px;border:0;\
            position:absolute;\
            top:35%;right:2%'
            
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
        if(t == 'select'){
            // var opt = document.createElement('option')
            // opt.appendChild(cont)
            userCont.innerHTML = ''
            i.insertAdjacentElement('afterbegin',bElem)
        }
        else 
            i.insertAdjacentElement('afterbegin',bElem)

}
 

//dispaly the blob of an uploaded image
function displayImage(e){
	var im = document.createElement('img')
	im.setAttribute('src',URL.createObjectURL(e.files[0]))
	im.style.width = '50px'
	im.setAttribute('id','u-img')
	e.after(im)
}


