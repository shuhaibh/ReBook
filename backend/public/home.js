document.addEventListener("DOMContentLoaded", function () {
  // Dynamically create the custom alert popup
  const popup = document.createElement("div");
  popup.id = "customAlertPopup";
  popup.className = "popup-modal";

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";

  const closeBtn = document.createElement("span");
  closeBtn.className = "close-btn";
  closeBtn.innerHTML = "&times;";

  const popupTitle = document.createElement("h2");
  popupTitle.id = "customAlertTitle";

  const popupMessage = document.createElement("p");
  popupMessage.id = "customAlertMessage";

  const confirmBtn = document.createElement("button");
  confirmBtn.id = "customAlertConfirmBtn";
  confirmBtn.textContent = "OK";

  // Append elements to the popup content
  popupContent.appendChild(closeBtn);
  popupContent.appendChild(popupTitle);
  popupContent.appendChild(popupMessage);
  popupContent.appendChild(confirmBtn);

  // Append the popup content to the popup container
  popup.appendChild(popupContent);

  // Append the popup to the body
  document.body.appendChild(popup);

  // Add CSS for the popup dynamically
  const style = document.createElement("style");
  style.textContent = `
    #customAlertPopup {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }

    #customAlertPopup .popup-content {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 90%;
      text-align: center;
      position: relative;
    }

    #customAlertPopup .close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      color: #888;
    }

    #customAlertPopup .close-btn:hover {
      color: #333;
    }

    #customAlertPopup #customAlertTitle {
      font-size: 24px;
      margin-bottom: 10px;
      color: #333;
    }

    #customAlertPopup #customAlertMessage {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
    }

    #customAlertPopup #customAlertConfirmBtn {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }

    #customAlertPopup #customAlertConfirmBtn:hover {
      background-color: #0056b3;
    }
  `;
  document.head.appendChild(style);

  // Function to show the custom alert popup
  function showCustomAlert(title, message) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popup.style.display = "flex";
  }

  // Function to hide the custom alert popup
  function hideCustomAlert() {
    popup.style.display = "none";
  }

  // Event listeners for closing the popup
  closeBtn.addEventListener("click", hideCustomAlert);
  confirmBtn.addEventListener("click", hideCustomAlert);

  // Close the popup if the user clicks outside the modal
  window.addEventListener("click", (event) => {
    if (event.target === popup) {
      hideCustomAlert();
    }
  });

  // Logout Handler
  const logoutLink = document.getElementById("logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", function () {
      localStorage.clear();
    });
  }

  // Sell Popup Toggle
  const sellLink = document.querySelector('.sell-container');
  const sellPopup = document.getElementById('sell-popup');
  const closeSellPopup = sellPopup.querySelector('.close');

  sellLink.addEventListener('click', function (e) {
    e.preventDefault();
    sellPopup.classList.add('show');
    history.pushState({ popup: true }, '', '#sell-popup');
  });

  closeSellPopup.addEventListener('click', function (e) {
    e.preventDefault();
    sellPopup.classList.remove('show');
    history.replaceState(null, '', window.location.pathname);
  });

  window.addEventListener('popstate', function (e) {
    if (sellPopup.classList.contains('show')) {
      sellPopup.classList.remove('show');
    }
  });

  // Book Fetch & Render Functionality
  let sortOrder = "desc";
  const departmentSelect = document.getElementById("department");
  const semesterSelect = document.getElementById("semester");
  const subjectSelect = document.getElementById("subject");
  const sortToggle = document.getElementById("sortToggle");
  const sortIcon = document.getElementById("sortIcon");
  const container = document.querySelector(".main-container");

  async function fetchBooks() {
    const department = departmentSelect.value;
    const semester = semesterSelect.value;
    const subject = subjectSelect.value;

    const params = new URLSearchParams();
    if (department) params.append("department", department);
    if (semester) params.append("semester", semester);
    if (subject) params.append("subject", subject);
    params.append("sort", "price");
    params.append("order", sortOrder);

    try {
      const response = await fetch(`/api/books?${params.toString()}`);
      const books = await response.json();
      renderBooks(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      container.innerHTML = "<p>Error fetching books. Please try again later.</p>";
    }
  }

  function renderBooks(books) {
    container.innerHTML = "";
    if (books.length === 0) {
      container.innerHTML = "<p>No books found matching the criteria.</p>";
      return;
    }
    books.forEach((book) => {
      const item = document.createElement("div");
      item.className = "item";

      const bookImg = document.createElement("img");
      bookImg.src = book.image;
      bookImg.alt = "Book Image";
      item.appendChild(bookImg);

      const bookName = document.createElement("h3");
      bookName.className = "book-name";
      bookName.textContent = book.name;
      item.appendChild(bookName);

      const authorName = document.createElement("p");
      authorName.className = "author-name";
      authorName.textContent = book.author;
      item.appendChild(authorName);

      const publicationName = document.createElement("p");
      publicationName.className = "publication-name";
      publicationName.textContent = book.publication;
      item.appendChild(publicationName);

      const priceElem = document.createElement("p");
      priceElem.className = "price";
      priceElem.textContent = `Price: ₹${book.price}`;
      item.appendChild(priceElem);

      const buyButton = document.createElement("button");
      buyButton.className = "buy-button";
      buyButton.textContent = "Buy";
      buyButton.addEventListener("click", function () {
        window.open(
          `https://wa.me/${book.sellerWhatsApp}?text=${encodeURIComponent(
            `Hi, I'm interested in your book: ${book.name}.`
          )}`,
          "_blank"
        );
      });
      item.appendChild(buyButton);

      container.appendChild(item);
    });
  }

  departmentSelect.addEventListener("change", fetchBooks);
  semesterSelect.addEventListener("change", fetchBooks);
  subjectSelect.addEventListener("change", fetchBooks);

  sortToggle.addEventListener("click", function () {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    sortIcon.src = sortOrder === "asc" ? "images/asc.png" : "images/desc.png";
    fetchBooks();
  });

  // Initial fetch of books and populate subject filter
  fetchBooks();
  populateSubjectFilter();

  // Dynamically Populate Subject Filter
  async function populateSubjectFilter() {
    try {
      const response = await fetch('/api/books');
      const books = await response.json();
      const subjectsSet = new Set();
      books.forEach(book => {
        if (book.subject) subjectsSet.add(book.subject);
      });
      subjectSelect.innerHTML = '<option value="">All Subjects</option>';
      subjectsSet.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error populating subject filter:", error);
    }
  }

  // File Input Label Handling
  const inputFile = document.getElementById("inputFile");
  const fileLabel = document.querySelector(".file-label");

  inputFile.addEventListener("change", function () {
    if (this.files.length > 0) {
      const fileName = this.files[0].name;
      fileLabel.textContent = fileName;
      fileLabel.style.color = "darkviolet";
      fileLabel.style.fontWeight = "normal";
    } else {
      fileLabel.textContent = "Choose File";
    }
  });

  // Sell Form Submission Handler
  const sellForm = document.querySelector("#sell-popup form");
  sellForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect sell form values
    const department = document.getElementById("sell-department").value;
    const semester = parseInt(document.getElementById("sell-semester").value);
    const subject = document.getElementById("sell-subject").value;
    const name = document.getElementById("book-name").value;
    const author = document.getElementById("author").value;
    const publication = document.getElementById("publication").value;
    const price = parseFloat(document.getElementById("price").value);

    const fileInput = document.getElementById("inputFile");
    if (fileInput.files.length === 0) {
      showCustomAlert("Error", "Please upload an image of the book.");
      return;
    }

    // Get the logged-in user data
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.whatsapp) {
      showCustomAlert("Error", "Please log in to sell a book.");
      return;
    }
    const sellerWhatsApp = `+91${user.whatsapp}`;

    // Create FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("department", department);
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("price", price);
    formData.append("author", author);
    formData.append("publication", publication);
    formData.append("sellerWhatsApp", sellerWhatsApp);
    formData.append("image", fileInput.files[0]); // Append the image file

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        body: formData, // Send FormData instead of JSON
      });
      const result = await response.json();
      if (response.ok) {
        showCustomAlert("Success", "Book listed successfully!");
        sellForm.reset();
        fetchBooks(); // Refresh the book list
      } else {
        showCustomAlert("Error", result.message || "Failed to list book.");
      }
    } catch (error) {
      console.error("Error listing book:", error);
      showCustomAlert("Error", "Error listing book. Please try again later.");
    }
  });
});