
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
 

//dispaly the blob of an uploaded image
function displayImage(e){
	var im = document.createElement('img')
	im.setAttribute('src',URL.createObjectURL(e.files[0]))
	im.style.width = '50px'
	im.setAttribute('id','u-img')
	e.after(im)
}


