
booksJs = 1;

function submitBook(event){
	event.preventDefault()
    if($i('gray-back-add-book'))cl('asd')
        if(user.id != null){cl('aa')
        	if($i('title').files != null){
	        	var sRef = firebase.storage();
	        		sRef.ref('images/'+$i('title').value).put($i('file').files[0])
        	}
            ref.child('books').push().set({
                title:$i('title').value,
                author:$i('author').value,
                isbn:$i('isbn').value,
                tags:$i('tags').value,
                from:'custom',
                user:user.id
            }).then(()=>{
            	$i('title').value = $i('author').value = $i('isbn').value = $i('tags').value = ''
            	hide('hidable','c')
            })
            cl('success')
        }
}

function displayImage(e){
	var im = document.createElement('img')
	im.setAttribute('src',URL.createObjectURL(e.files[0]))
	im.style.width = '50px'
	e.after(im)
	cl('image')
}


function book(title,author,isbn,tags){
	var bElem = document.createElement('div'),
	cont = document.createElement('div'),
	p = document.createElement('p'),
	p1 = document.createElement('p'),
	h1 = document.createElement('p'),
	tag = document.createElement('p');
	
	bElem.classList.add('book');
	tag.classList.add('b-tag');

	p1.innerHTML = isbn
	h1.innerHTML = title
	p.innerHTML = author
	tag.innerHTML = tags

	cont.appendChild(p1)
	cont.appendChild(h1)
	cont.appendChild(p)
	cont.appendChild(tag)

	bElem.appendChild(cont)

	if($i('bcontainer'))
		$i('booksContain').insertAdjacentElement('afterbegin',bElem)

}


var key;
function bookInit(){
	if(user != null){
		ref.child('books/').once('value',m=>{
			if(m.exists()){
				m.forEach(d=>{
					let v = d.val()
					book(v.title,v.author,v.isbn,v.tags)
					key = d.key;
				})

				ref.child('books/').orderByKey().startAt(key+1).on('value',m=>{
					m.forEach(d=>{
						let v = d.val()
						book(v.title,v.author,v.isbn,v.tags)
						key = d.key;
					})
				})
			}

		})
	}
}