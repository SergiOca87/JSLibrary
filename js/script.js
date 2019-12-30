//Materialize
document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

//TODOS:
//Add a sort method by name and or rating with Array.sort, that's where BookStorage comes in handy

class Library {
  constructor(bookStorage, bookDisplay, bookSearch) {
    this.bookStorage = bookStorage;
    this.bookDisplay = bookDisplay;
    this.bookSearch = bookSearch;

    //Delete Books from the Library using Event Delegation
    this.bookDisplay.addEventListener("click", this.libraryMethods);

    //Search for Books
    this.bookSearch.addEventListener("keyup", this.searchBook);
  }

  storeBook = book => this.bookStorage.push(book);

  renderDisplay = (book, index) => {
    const readOrUnread = book.read === "Yes" ? "Read" : "Unread";

    //Destructuring the values inside of book.
    const { title, author, numberOfPages, rating, read } = book;

    const listItem = `
			<div class="col s12 m6" book data-index="${index}">
				<div class="card blue-grey darken-1">
					<div class="card-content white-text">
						<i class="small material-icons card-close">close</i>
						<span class="card-title">${title}</span>
						<p><strong>Author</strong>: ${author}</p>
						<p><strong>Pages</strong>: ${numberOfPages}</p>
						<hr>
						<div class="card-footer">
							<div>
								<p><span>${rating}</span></p>
							</div>
							<div>
								<div class="book-read book-read-${read} btn">${readOrUnread}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

    this.bookDisplay.insertAdjacentHTML("beforeend", listItem);
  };

  libraryMethods = (e) => {
    //Change book read status
    if (e.target.classList.contains("book-read-Yes")) {
      e.target.classList.toggle("book-read-Yes");
      e.target.classList.toggle("book-read-No");
      e.target.textContent = "Unread";
    } else if(e.target.classList.contains("book-read-No") ){
      e.target.classList.toggle("book-read-No");
      e.target.classList.toggle("book-read-Yes");
      e.target.textContent = "Read";
    }

    //Delete a Book
    if (e.target.classList.contains("card-close")) {
      const parent = e.target.parentElement.parentElement.parentElement;
      const clickedIndex = parent.dataset.index;

      //Remove from the storage Array
      this.bookStorage.splice(clickedIndex, 1);

      //Remove from the DOM
      parent.remove();
    }
  };

  searchBook = () => {
    let searchValue = this.bookSearch.value;

    //Create a DOM collection of Books:
    const bookCollection = document.querySelectorAll('.book');
    
    for (const book of bookCollection) {
      if( !book.querySelector('.card-title').textContent.toLowerCase().includes( searchValue.toLowerCase() ) ) {
        book.style.display = 'none';
      } else {
        book.style.display = 'block';
      }
    }
  }
}

//The Book class is a blueprint to create different books
class Book {
  constructor(title, author, numberOfPages, read, rating) {
    (this.title = title),
      (this.author = author),
      (this.numberOfPages = numberOfPages),
      (this.read = read),
      (this.rating = rating);
  }
}

const createBook = event => {
  event.preventDefault();

  const title = document.querySelector("#book-title").value;
  const name = document.querySelector("#book-name").value;
  const number = document.querySelector("#book-number").value;
  const read = document.querySelector("#book-read").value;
  const rating = document.querySelector("#book-rating").value;

  const formSelectors = [title, name, number, read, rating];

  //Simple checker function to see if the fields are filled.
  const inputFilled = currentValue => currentValue.length > 0;

  //If all of the fields are filled...
  if (formSelectors.every(inputFilled)) {
    //Create a new instance of the Book Class
    const book = new Book(title, name, number, read, rating);

    //Create an index for the book
    const bookIndex = library.bookDisplay.length;

    //Add Book to the Library Storage
    library.bookStorage.push(book);

    //Display the Book
    library.renderDisplay(book, bookIndex);
  } else {
    const toastHTML = " <p>Please fill in all of the form fields</p>";
    M.toast({ html: toastHTML, classes: "centeredToast" });
  }
};
// const book = new Book(title, name, number, read, rating);

document.querySelector(".book-submit").addEventListener("click", createBook);

const library = new Library( [], document.querySelector(".display .row"), document.querySelector('#book_search') );
