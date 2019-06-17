
booksJs = 1;
var bookss;
function readTextFile(){
    var xml = new XMLHttpRequest
    xml.onreadystatechange = ()=>{
        if(this.status == 200 && this.readyState == 4){
            bookss = JSON.parse(this.responseText)
        }
    }
    xml.open('get','./books.json',true)
    xml.send()
}

function bookInit(t){
    if(user != null){
        switch(t){
            case 'shelf':{
                ref.child('books/').on('child_added',d=>{
                    if(d.exists()){
                        // m.forEach(d=>{
                            if(d.val().userId == user.id){
                                let v = d.val()
                                if(v.img)
                                    var arr = {
                                        im:'',
                                        title:v.title,
                                        author:v.author,
                                        isbn:v.isbn,
                                        tags:v.tags,
                                        im:v.img,
                                        id:d.key
                                    }
                                else var arr = {
                                    im:'',
                                    title:v.title,
                                    author:v.author,
                                    isbn:v.isbn,
                                    tags:v.tags,
                                    id:d.key
                                }
								book(arr,$i('bcontainer'))
                            }
                        // })
                    }
                })
                break;
            }
            case 'home':{
                ref.child('books/').orderByKey().once('value',m=>{
                    if(m.exists()){
                        m.forEach(d=>{
							//displaying the books that the user doesn't own
                            if(d.val().userId != user.id && d.val().userId != undefined){
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
    ref.child('books').orderByChild('title').equalTo($i('title').value).once('value',m=>{
        if(m.exists())
            $i('add-book-error').innerHTML = 'this book already exists'
        else if(user.id != null){
            $i('add-book-error').innerHTML = ''

			if($i('file').files != null){
	        	firebase.storage().ref('images/'+$i('title').value).put($i('file').files[0])
			}
			
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
        }
    })

}

function submitBookInfo(event){
	event.preventDefault()
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
            })
        }
}

//create the book html element and append it to the parent
function book(arr,i,t=''){
	var img = dc('img'),
	bElem = dc('div'),
	cont = dc('div'),
	p = dc('p'),
	p1 = dc('p'),
	h1 = dc('p'),
	tag = dc('p'),
    userCont = dc('div'),
    userName = dc('h1'),
    gover = dc('p'),
    areaa = dc('p');
	
	bElem.classList.add('book');
	tag.classList.add('b-tag');

    if(arr.im)
        img.src = arr.im
    else
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
    if(i){
        if(i.parentElement.parentElement.getAttribute('data-type') == 'pop' || i.getAttribute('id') == 'bookAdd'){
            let dWrap = dc('div')
            dWrap.style.cursor = 'crosshair'
            dWrap.onclick = ()=>{
                ref.child('books').orderByChild('title').equalTo(arr.title).once('value',m=>{
                    if(m.exists())
                        $i('add-book-error').innerHTML = 'this book already exists'
                    else {
                        $i('add-book-error').innerHTML = ''

                        $i('bookAdd').innerHTML = ''
                        $i('bookAdd').appendChild(bElem.cloneNode(true))
                        var boo = ref.child('books').push()
                        $i('bookId').value = boo.key
                        boo.set({
                            title:arr.title,
                            author:arr.author,
                            isbn:arr.isbn,
                            tags:arr.tags,
                            img:img.src,
                            from:'api'
                        })
                        slide(2,'slide2')
                    }
                })
            }
            dWrap.appendChild(bElem)
            $i('bookId').value = arr.key
            i.insertAdjacentElement('afterbegin',dWrap)
        }
        else if(i.classList.contains('home-p')){
            var pc1 = dc('h1'),
            div = dc('div'),
            pc2 = dc('h1'),
            pc3 = dc('h1'),
            pc = dc('p')
        
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
            var bu = dc('button');
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

                var op = dc('option'),
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
            }
            ///////////////////////////////////////////////////////////////
            i.insertAdjacentElement('afterbegin',bElem)
        }
        else if(t == 'select'){
            // var opt = dc('option')
            // opt.appendChild(cont)
            userCont.innerHTML = ''
            i.insertAdjacentElement('afterbegin',bElem)
        }
        else 
            i.insertAdjacentElement('afterbegin',bElem)
    }
}
 

//dispaly the blob of an uploaded image
function displayImage(e){
	var im = dc('img')
	im.setAttribute('src',URL.createObjectURL(e.files[0]))
	im.style.width = '50px'
	im.setAttribute('id','u-img')
	e.after(im)
}


