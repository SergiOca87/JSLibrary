//Materialize Input Fields
document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

//TODOS:
//Add a sort method by name and or rating with Array.sort, that's where BookStorage comes in handy

class Library {
  constructor(bookStorage, bookDisplay, bookSearch, submitBook, sortLibrary) {
    this.bookStorage = bookStorage;
    this.bookDisplay = bookDisplay;
    this.bookSearch = bookSearch;
    this.submitBook = submitBook;
    this.sortLibrary = sortLibrary;

    //Delete Books from the Library or toggle read or unread status using Event Delegation
    this.bookDisplay.addEventListener("click", this.libraryMethods);

    //Search for Books
    this.bookSearch.addEventListener("keyup", this.searchBook);

    //Submit a Book
    this.submitBook.addEventListener("click", this.createBook);

    //Sort the bookStorage and render with the chosen option and render the new Books in said order
    this.sortLibrary.addEventListener('change', this.sortStorage);
  }

  storeBook = book => this.bookStorage.push(book);

  renderBook = (book, index) => {
    const readOrUnread = book.read === "Yes" ? "Read" : "Unread";

    //Destructuring the values inside of book.
    //Rating 0 will be treated as if there's no rating assigned, but later used for the book sorting by rating
    const { title, author, numberOfPages, rating = 0, read } = book;

    const createRatingStars = () => {
      let starsString = '';
      if( rating > 0 ) {
        for(let i = 0; i < rating; i++) {
          starsString += `<i class="small material-icons">star</i>`
        }
      } else {
        starsString = 'Not Rated';
      }
      return starsString;
    };

    const listItem = `
			<div class="col l6 m12 s12 book" data-index="${index}">
				<div class="card blue-grey darken-1">
					<div class="card-content white-text">
						<i class="small material-icons card-close">close</i>
						<span class="card-title">${title}</span>
						<p><strong>Author</strong>: ${author}</p>
						<p><strong>Pages</strong>: ${numberOfPages}</p>
						<hr>
						<div class="card-footer">
              <span>Rating:</span>
              <div class="card-footer-flex">
                  <div class="card-rating">
                  ${createRatingStars()}
                  </div>
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

    console.log(bookCollection)
    
    for (const book of bookCollection) {
      if( !book.querySelector('.card-title').textContent.toLowerCase().includes( searchValue.toLowerCase() ) ) {
        book.style.display = 'none';
      } else {
        book.style.display = 'block';
      }
    }
  };

  createBook = (e) => {
    event.preventDefault();

    const title = document.querySelector("#book-title").value;
    const name = document.querySelector("#book-name").value;
    const number = document.querySelector("#book-number").value;
    const read = document.querySelector("#book-read").value;
    const rating = document.querySelector("#book-rating").value;
  
    const formSelectors = [title, name, read];
  
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
      library.renderBook(book, bookIndex);
    } else {
      const toastHTML = " <p>Please fill in all of the form fields</p>";
      M.toast({ html: toastHTML, classes: "centeredToast" });
    }
  };

  sortStorage = () => {

    let sortBy = this.sortLibrary.value

    if( sortBy === "asc" ) {
      this.bookStorage.sort((a, b) => a.title.localeCompare(b.title));
    } else if( sortBy === "desc" ) {
      this.bookStorage.sort((a, b) => b.title.localeCompare(a.title));
    }
    // } else if( sortBy === "rating" ) {
    //   this.bookStorage.sort((a, b) => b.title.localeCompare(a.title));
    // }

    //After the sorting, render the library again to see the changes
    this.renderDisplay();
  };

  renderDisplay = () => {
    
    //First, empty the display
    this.bookDisplay.innerHTML = '';

    //Render the Storage
    this.bookStorage.map((book) => {
      this.renderBook( book )
    })
  }
};

//The Book class is a blueprint to create different books
class Book {
  constructor(title, author, numberOfPages, read, rating) {
    (this.title = title),
      (this.author = author),
      (this.numberOfPages = numberOfPages),
      (this.read = read),
      (this.rating = rating);
  }
};

//DOM selectors and empty Array to initiate the Library
const libraryComponents = [
  [],
  document.querySelector(".display .row"),
  document.querySelector('#book_search'),
  document.querySelector(".book-submit"),
  document.querySelector("#book-sort")
]

const library = new Library( ...libraryComponents );

//Add two hardcoded books to the library so that the user does not need to ad books to test the App
const book1 = new Book(
  "Sapiens",
  "Yuval Noah Harari",
  "571",
  "Yes",
  "5"
)

const book2 = new Book(
  "Code",
  "Charles Petzold",
  "400",
  "No",
  ""
)

library.bookStorage = [book1, book2];

