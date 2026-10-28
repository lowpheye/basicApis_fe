import { getBooks, API_BASE_URL } from "./api/books";

// 1. Find the parts of the page we want to change
const table = document.getElementById("books-table-body")!;
const message = document.getElementById("status-message")!;
const count = document.getElementById("book-count")!;
const refreshButton = document.getElementById("refresh-btn")!;

// 2. Ask the backend for the books and show them in the table
async function loadBooks() {
  message.className = "status-message loading";
  message.textContent = "Loading books...";

  try {
    const books = await getBooks();

    table.innerHTML = "";
    for (const book of books) {
      table.innerHTML += `
        <tr>
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.year}</td>
        </tr>`;
    }

    count.textContent = `Total books: ${books.length}`;
    message.className = "status-message hidden";
  } catch (error) {
    message.className = "status-message error";
    message.textContent = "Could not reach the backend. Is the Flask server running?";
  }
}

// 3. Load the books when the button is clicked, and once when the page opens
// (only on index.html, because aggiungere.html has no table)
if (refreshButton) {
  document.getElementById("backend-url")!.textContent = API_BASE_URL;
  refreshButton.addEventListener("click", loadBooks);
  loadBooks();
}

// 4. Send a new book to the backend with POST /books
async function addBooks() {
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const author = (document.getElementById("author") as HTMLInputElement).value;
  const year = (document.getElementById("year") as HTMLInputElement).value;

  await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, year }),
  });
}

// Make addBooks reachable from onclick="addBooks()" in the HTML
(window as any).addBooks = addBooks;
