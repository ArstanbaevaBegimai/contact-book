const API = "http://localhost:8000/contacts";
let searchValue = "";

let inpName = $(".inp-name");
let inpSurname = $(".inp-surname");
let inpNumber = $(".inp-number");
let btn = $(".inp-btn");
let form = $(".form-main");
let body = $("tbody");

// ! Create
form.on("submit", async (e) => {
  e.preventDefault();
  let name = inpName.val().trim();
  let surname = inpSurname.val().trim();
  let number = inpNumber.val().trim();
  let newContact = {
    name: name,
    surname: surname,
    number: number,
  };
  for (let contact in newContact) {
    if (!newContact[contact]) {
      alert("Enter all inputs");
      return;
    }
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });
  inpName.val("");
  inpSurname.val("");
  inpNumber.val("");

  Toastify({
    text: "Contact is added",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "green",
    },
  }).showToast();
  render();
});

// ! Read

// ! Live search
async function render() {
  const response = await fetch(`${API}?q=${searchValue}`);
  const data = await response.json();

  // ! Pagination start

  let first = currentPage * contactsPerPage - contactsPerPage;
  let last = currentPage * contactsPerPage;
  const currentContacts = data.slice(first, last);
  lastPage = Math.ceil(data.length / contactsPerPage);

  // ! Making buttons disabled
  if (currentPage === 1) {
    prevBtn.addClass("disabled");
  } else {
    prevBtn.removeClass("disabled");
  }
  if (currentPage === lastPage) {
    nextBtn.addClass("disabled");
  } else {
    nextBtn.removeClass("disabled");
  }

  // ! Pagination end

  body.html("");
  currentContacts.forEach((item, index) => {
    body.append(`
      <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.surname}</td>
      <td>${item.number}</td>
      <td>
      <button id = "${item.id}" class = 'btn-delete'>
      <img class = 'img' src="https://cdn-icons.flaticon.com/png/512/3687/premium/3687412.png?token=exp=1648144435~hmac=b5be812744010d7e2816dccbd7ec6723">
      </button>
      <button id = "${
        item.id
      }" class = 'btn-edit' data-bs-toggle="modal" data-bs-target="#exampleModal"> 
      <img class = 'img' src="https://cdn-icons-png.flaticon.com/512/2919/2919592.png">
      </button>
      </td>
      </tr>
      `);
  });
}
render();

// ! Delete
$(document).on("click", ".btn-delete", async (e) => {
  let id = e.currentTarget.id;
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  Toastify({
    text: "Contact is deleted",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "green",
    },
  }).showToast();
  render();
});

// ! Update
let editInpName = $(".edit-inp-name");
let editInpSurname = $(".edit-inp-surname");
let editInpNumber = $(".edit-inp-number");
let editForm = $(".edit-form");
let editModal = $(".modal");

$(document).on("click", ".btn-edit", async (e) => {
  let id = e.currentTarget.id;
  editForm.attr("id", id);
  const response = await fetch(`${API}/${id}`);
  const data = await response.json();
  editInpName.val(data.name);
  editInpSurname.val(data.surname);
  editInpNumber.val(data.number);
  editForm.on("submit", async (e) => {
    e.preventDefault();
    let id = e.currentTarget.id;
    let name = editInpName.val().trim();
    let surname = editInpSurname.val().trim();
    let number = editInpNumber.val().trim();
    let editedContact = {
      name: name,
      surname: surname,
      number: number,
    };
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedContact),
    });
    render();
    editModal.modal("hide");
    Toastify({
      text: "Contact is changed",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "green",
      },
    }).showToast();
  });
});

// ! Pagination
let prevBtn = $(".prev-btn");
let nextBtn = $(".next-btn");

let contactsPerPage = 10;
let currentPage = 1;
let lastPage = 1;

nextBtn.on("click", () => {
  if (currentPage === lastPage) {
    return;
  }
  currentPage++;
  render();
});
prevBtn.on("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  render();
});

// ! Live search
let searchInp = $(".inp-search");

searchInp.on("input", (e) => {
  searchValue = e.target.value;
  currentPage = 1;
  render();
});
