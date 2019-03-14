
booksJs = 1;

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
			
			ref.child('books').push().set({
                title:$i('title').value,
                author:$i('author').value,
                isbn:$i('isbn').value,
                tags:$i('tags').value,
                from:'custom',
                user:user.id
            }).then(()=>{
            	// $i('title').value = $i('author').value = $i('isbn').value = $i('tags').value = ''
            	// hide('hidable','c')
            })
            cl('success')
        }
}

//dispaly the blob of an uploaded image
function displayImage(e){
	var im = document.createElement('img')
	im.setAttribute('src',URL.createObjectURL(e.files[0]))
	im.style.width = '50px'
	im.setAttribute('id','u-img')
	e.after(im)
}



var key='0';
function bookInit(){
	if(user != null){
		ref.child('books/').once('value',m=>{
			if(m.exists()){
				m.forEach(d=>{
					let v = d.val()
					var arr = {
						im:'',
						title:v.title,
						author:v.author,
						isbn:v.isbn,
						tags:v.tags
					}
					firebase.storage().ref().child('images/'+v.title).getDownloadURL().then(i=>{
						arr.im = i
						book(arr,$i('bcontainer'))
					}).catch(m=>{
						cl(m.message)
						book(arr,$i('bcontainer'))

					})
					key = d.key;
				})

			}
				ref.child('books/').orderByKey().startAt(key+1).on('value',m=>{
					m.forEach(d=>{
						if(d.key != key){
							let v = d.val()
							var arr = {
								im:'',
								title:v.title,
								author:v.author,
								isbn:v.isbn,
								tags:v.tags
							}
							firebase.storage().ref().child('images/'+v.title).getDownloadURL().then(i=>{
								arr.im = i
								book(arr,$i('bcontainer'))
							}).catch(m=>{
								cl(m.message)
								book(arr,$i('bcontainer'))
		
							})
							cl(v.title)
							key = d.key;
							cl('key: '+key)
						}
					})
				})

		})
	}
}