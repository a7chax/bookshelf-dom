const localStorageKey = {
  'BOOK' : "BOOK",
}
const eventKey = {
  'RENDER_BOOKS' : 'render-books',
  'SAVED_BOOK' : 'saved-book'
}

const actionKey = {
  'DELETE_BOOK' : 'delete-book',
  'ADD_BOOK' : 'add-book',
  'MARK_AS_READ' : 'mark-as-read',
  'MARK_AS_UNREAD' : 'mark-as-unread'
}

const booksData = []

function showSnackbar(message){
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerText = message
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  
}

document.addEventListener(eventKey.RENDER_BOOKS, function(){

  const incompleteBookshelf = document.querySelector('#incompleteBookshelfList');
  incompleteBookshelf.innerHTML = ''

  const completeBookshelf = document.querySelector('#completeBookshelfList');
  completeBookshelf.innerHTML = ''

  console.log(booksData, 'books data')

  for(book of booksData){
    const newBook = makeList(book)
    if(book.isComplete === true){
      completeBookshelf.append(newBook)
    }else{
      incompleteBookshelf.append(newBook)
    }
  }

})

function findBook(bookId){
  for(book of booksData){
    if(book.id === bookId){
      return book
    }
  }
}

function findBookIndex(bookId){
  for(const index in booksData){
    if(booksData[index].id === bookId){
      return index
    }
  }

  return -1
}



function saveData(action, bookObject = {title : ''}){
  if(checkStorage()){
    const parsed = JSON.stringify(booksData)
    localStorage.setItem(localStorageKey.BOOK, parsed)

    if(action === actionKey.ADD_BOOK){
      showSnackbar(`Menambahkan buku ${bookObject.title}`)
    }

    if(action === actionKey.DELETE_BOOK){
      showSnackbar(`Menghapus buku ${bookObject.title}`)
    }

    if(action === actionKey.MARK_AS_READ){
      showSnackbar(`Menandai buku ${bookObject.title} sebagai selesai dibaca`)
    }

    if(action === actionKey.MARK_AS_UNREAD){
      showSnackbar(`Menandai buku ${bookObject.title} sebagai belum selesai dibaca`)
    }

  }
}

function addBook(){
  const inputBookTitle = document.getElementById('inputBookTitle').value
  const inputBookAuthor = document.getElementById('inputBookAuthor').value
  const inputBookYear = document.getElementById('inputBookYear').value
  const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked

  const data = {
    id: +new Date(),
    title: inputBookTitle,
    author: inputBookAuthor,
    year: inputBookYear,
    isComplete: inputBookIsComplete
  }

  booksData.push(data)
  document.dispatchEvent(new Event(eventKey.RENDER_BOOKS))
  saveData(actionKey.ADD_BOOK, data)
}

function removeBook(bookObject = {title : '', id : 0}){
  const index = findBookIndex(bookObject.id)

  if(index === -1){
    return
  }

  booksData.splice(index,1)
  document.dispatchEvent(new Event(eventKey.RENDER_BOOKS))
  saveData(actionKey.DELETE_BOOK, bookObject)
}


function markAsRead(bookObject = {title : '', id : 0}){
  const book = findBook(bookObject.id)
  book.isComplete = true
  document.dispatchEvent(new Event(eventKey.RENDER_BOOKS))
  saveData(actionKey.MARK_AS_READ, bookObject)
}

function markAsUnread(bookObject = {title : '', id : 0}){
  const book = findBook(bookObject.id)
  book.isComplete = false
  document.dispatchEvent(new Event(eventKey.RENDER_BOOKS))
  saveData(actionKey.MARK_AS_UNREAD, bookObject)
}


function checkStorage(){
  if(typeof(Storage) === undefined){
    alert('Browser kamu tidak mendukung local storage')
    return false
  }
  return true
}


function getBooks(){
  if(checkStorage()){
    return JSON.parse(localStorage.getItem(localStorageKey.BOOK)) || []
  }else{
    return []
  }
}

function makeList(bookObject){
  const titleElement = document.createElement('h3')
  titleElement.innerText = bookObject.title

  const authorElement = document.createElement('p')
  authorElement.innerText = bookObject.author  

  const yearElement = document.createElement('p')
  yearElement.innerText = bookObject.year


  const buttonMarking = document.createElement('button')
  buttonMarking.classList.add('green')


  const buttonRemoveBook = document.createElement('button')
  buttonRemoveBook.classList.add('red')
  buttonRemoveBook.innerText = 'Hapus buku'
  buttonRemoveBook.addEventListener('click', function(){
    removeBook(bookObject)
  })


  const containerAction = document.createElement('div')
  containerAction.classList.add('action')
  containerAction.append(buttonMarking, buttonRemoveBook)

  const article = document.createElement('article')
  article.classList.add('book_item')
  article.append(titleElement,authorElement,yearElement,containerAction)


  if(bookObject.isComplete === true){
    buttonMarking.innerText = 'Belum Selesai Dibaca'    
    buttonMarking.addEventListener('click', function(){
      markAsUnread(bookObject)
    })
  }

  if(bookObject.isComplete === false){
    buttonMarking.innerText = 'Selesai dibaca'
    buttonMarking.addEventListener('click', function(){
      markAsRead(bookObject)
    })
  }

  return article
  
}

function loadDataFromStorage(){
  const books = getBooks()

  console.log(books, 'bukunya')

  if(books !== null){
    for(const book of books){
      booksData.push(book)
    }
  }

  document.dispatchEvent(new Event(eventKey.RENDER_BOOKS))
}

document.addEventListener('DOMContentLoaded', function(){

  const submitForm = document.getElementById('inputBook')
  submitForm.addEventListener('submit', function(event){
    event.preventDefault()
    addBook()
  })

  if(checkStorage()){
    loadDataFromStorage()
  }
})