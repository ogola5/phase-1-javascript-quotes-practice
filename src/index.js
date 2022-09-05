document.addEventListener('DOMContentLoaded', renderQuotes)


function renderQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then((resp) => resp.json())
    .then((quotes) => {
      const quoteList = document.getElementById('quote-list')
      for (const quote of quotes) {
        const quoteDiv = document.createElement('div')
        const quoteId = quote['id']
        quoteDiv.innerHTML = `
            <li id=${quoteId} class="quote-card">
                <blockquote class="blockquote">
                    <p class="mb-0">${quote['quote']}</p>
                    <footer class="blockquote-footer">${quote['author']}</footer>
                    <br>
                    <button class="btn-success">Likes: <span>${quote['likes'].length}</span></button>
                    <button class="btn-danger">Delete</button>
                    <button class="btn-edit">Edit</button>
                </blockquote>
            </li>
            `
        quoteList.append(quoteDiv)
      }
      const deleteBtns = document.getElementsByClassName('btn-danger')
      for (const btn of deleteBtns) {
        btn.addEventListener('click', deleteQuote)
      }
      const likeBtns = document.getElementsByClassName('btn-success')
      for (const btn of likeBtns) {
        btn.addEventListener('click', likeQuote)
      }
      const editBtns = document.getElementsByClassName('btn-edit')
      for (const btn of editBtns) {
        btn.addEventListener('click', editQuote)
      }
    })
}

// editing  quotes:

function editQuote(e) {
  console.log('time to edit')
}

// liking quote:

function likeQuote(e) {
  let likedId = e.target.parentElement.parentElement.id
  fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      quoteId: parseInt(likedId),
    }),
  }).then(() => {
    let totalLikesString = e.target.querySelector('span')
    let totalLikesInt = parseInt(totalLikesString.textContent)
    totalLikesInt++
    totalLikesString.textContent = totalLikesInt.toString()
  })
}

// Adding Quote to Page 

const newQuoteForm = document.getElementById('new-quote-form')
const newQuote = document.getElementById('new-quote')
const author = document.getElementById('author')

newQuoteForm.addEventListener('submit', addQuote)

function addQuote(e) {
  e.preventDefault()
  let newQuoteObj = {
    quote: newQuote.value,
    author: author.value,
  }
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(newQuoteObj),
  })
    .then((resp) => resp.json())
    .then((returnedObj) => {
      const quoteList = document.getElementById('quote-list')
      let quoteEntry = document.createElement('div')
      quoteEntry.innerHTML = `
            <li id=${returnedObj['id']} class="quote-card">
                <blockquote class="blockquote">
                    <p class="mb-0">${returnedObj['quote']}</p>
                    <footer class="blockquote-footer">${returnedObj['author']}</footer>
                    <br>
                    <button class="btn-success">Likes: <span>0</span></button>
                    <button class="btn-danger">Delete</button>
                    <button class="btn-edit">Edit</button>
                </blockquote>
            </li>
            `
      quoteList.append(quoteEntry)
      let btn = quoteEntry.querySelector('button.btn-danger')
      btn.addEventListener('click', function (e) {
        let selectItem = e.target.parentElement.parentElement
        let selectId = e.target.parentElement.parentElement.id
        fetch(`http://localhost:3000/quotes/${selectId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }).then(() => selectItem.remove())
      })
      newQuoteForm.reset()
    })
}

// Deleting quote:

function deleteQuote(e) {
  let selectItem = e.target.parentElement.parentElement
  let selectId = e.target.parentElement.parentElement.id
  fetch(`http://localhost:3000/quotes/${selectId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(() => selectItem.remove())
}