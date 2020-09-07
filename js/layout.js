let tbody = document.querySelector('tbody');
let table = document.querySelector('table');
let nav = document.querySelector('nav');
let ul = document.querySelector('ul');
let data;
let list = [];
let index = 0;
let currentPage = 1;
let pageSize = 10;



async function getMovieData() {
  const URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=0c6bd38e0aba55d55ef8b5865703b872';
  try {
    const response = await fetch(URL);
    data = await response.json();
  } catch (e) {
    console.log("Error: loading data error");
  }
  return generateTable(data.results);
}

function generateTable(elem) {
  elem.forEach(e => {
    index++;
    createMovie(e.title, index);
    list.push(e.title);
  });

  showPagination();
  submitNewMovie();
  reorder();
}

function updatePage() {
  let totalPageNumber = Math.ceil(index / pageSize);
  let pages = ul.children.length;

  if (totalPageNumber > pages - 2) { // add 
    const li = document.createElement('li');
    const a = document.createElement('a');

    li.className = "page-item";
    a.className = "page-link";
    a.href = "#";
    a.textContent = Number(ul.children[pages - 2].textContent) + 1

    let next = ul.lastChild;
    li.append(a);
    next.before(li);
  }
  if (totalPageNumber < pages - 2) { // del
    ul.children[pages - 2].remove();
  }
}

function showPagination() {
  let totalPageNumber = Math.ceil(index / pageSize);
  generatePagination(totalPageNumber);
  pageValidCheck(currentPage);
  dataCheck();

  ul.children[0].addEventListener('click', e => { // click prev
    totalPageNumber = Math.ceil(index / pageSize);

    currentPage--;
    // console.log(currentPage);
    if (currentPage === 0) {
      currentPage++;
      return;
    }
    pageValidCheck(currentPage);
    dataCheck();
  })
  
  ul.children[totalPageNumber + 1].addEventListener('click', e => { //click next
    totalPageNumber = Math.ceil(index / pageSize);

    currentPage++;
    if (currentPage >= totalPageNumber + 1) {
      currentPage--;
      return;
    }
    pageValidCheck(currentPage);
    dataCheck();
  })
}

function pageValidCheck() {
  let n = ul.children.length;
  let disabled = "page-item disabled";
  let abled = "page-item";

  ul.children[0].className = abled;
  ul.children[n - 1].className = abled;

  if (currentPage === 1) {
    ul.children[0].className = disabled;
  }

  if (currentPage === n - 2) {
    ul.children[n - 1].className = disabled;
  }
}

function dataCheck() { //show specific data in current page
  for (let i = 0; i < index; i++) {
    if (i <= (currentPage - 1) * pageSize - 1 || i > currentPage * pageSize - 1) {
      tbody.children[i].style.display = 'none';
    }
    else {
      tbody.children[i].style.display = '';
    }
  }
}

function generatePagination(pageN) {
  for (let i = 0; i <= pageN + 1; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    li.className = "page-item";
    a.className = "page-link";
    a.href = "#";

    if (i === 0) {
      a.textContent = "Previous";
    }
    else if (i === pageN + 1) {
      a.textContent = "Next";
    }
    else {
      a.textContent = i;
    }

    li.append(a);
    ul.append(li);
  }
}

function submitNewMovie() {
  let newMovie = document.getElementById('newMovie');
  let newButton = document.getElementById('submitButton');

  newButton.addEventListener('click', e => {
    index++;
    createMovie(newMovie.value, index);
    list.push(newMovie.value);
    dataCheck();
    updatePage();
    pageValidCheck(currentPage);
    newMovie.value = "";
  })
}

function createMovie(movieName, num) {
  let tr = document.createElement('tr');
  let tdNum = document.createElement('td');
  let tdMovie = document.createElement('td');
  let tdButton = document.createElement('td');

  tdNum.textContent = num;
  tdMovie.textContent = movieName;

  tr.id = num;
  tr.appendChild(tdNum);
  tr.appendChild(tdMovie);
  tdButton.appendChild(addSaveButton());
  tdButton.appendChild(addEditButton());
  tdButton.appendChild(addDeleteButton());
  tr.appendChild(tdButton);
  tbody.appendChild(tr);
}

addSaveButton = () => {
  let saveButton = document.createElement('button');
  saveButton.className = "btn btn-sm btn-outline-warning mr-2";
  saveButton.textContent = "save";
  saveButton.type = "submit";
  saveButton.addEventListener("click", e => {
    saveButtonEvent(e);
  })
  return saveButton;
}

function saveButtonEvent(e) {
  let favMovie = e.target.parentNode.parentNode.children[1].textContent;
  let favTable = document.getElementById('modal-body');
  let tr = document.createElement('tr');
  let td = document.createElement('td');

  if (e.target.textContent === 'save') {
    td.textContent = favMovie;
    tr.append(td);
    favTable.append(tr);

    e.target.className = "btn btn-sm btn-warning mr-2";
    e.target.textContent = "saved";
  }
  else {
    for (let i = 0; i < favTable.children.length; i++) {
      if (favTable.children[i].textContent === favMovie) {
        favTable.children[i].remove();
      }
    }

    e.target.className = "btn btn-sm btn-outline-warning mr-2";
    e.target.textContent = "save";
  }
}

addEditButton = () => {
  let editButton = document.createElement('button');
  editButton.textContent = "edit";
  editButton.className = "btn btn-sm btn-outline-secondary mr-2";
  editButton.addEventListener("click", e => {
    editButtonEvent(e);
  })
  return editButton;
}

function editButtonEvent(e) {
  let editMovie = e.target.parentNode.parentNode.children[1].textContent;
  let editInput = document.getElementById('editMovie');
  let editButton = document.getElementById('editButton');
  editInput.select();
  editInput.value = editMovie;
  editButton.addEventListener('click', event => {
    if (editInput.value === "") {
      alert('cannot edit empty name');
      return;
    }
    event.preventDefault();
    e.target.parentNode.parentNode.children[1].textContent = editInput.value;
    editInput.value = "";
  }, { once: true });
}

addDeleteButton = () => {
  let deleteButton = document.createElement('button');
  deleteButton.className = "btn btn-sm btn-outline-danger";
  deleteButton.textContent = "delete";
  deleteButton.addEventListener("click", e => {
    deleteButtonEvent(e);
  })
  return deleteButton;
}

function deleteButtonEvent(m) {
  m.target.parentNode.parentNode.remove(m);
  let id = Number(m.target.parentNode.parentNode.childNodes[0].textContent);
  delete data.results[id - 1];
  list.splice(id - 1, 1);
  data.results.length -= 1;
  index--;
  refreshIndex();
  dataCheck();
  pageValidCheck(currentPage);
  updatePage();
}

function refreshIndex() {
  let i = 1;
  for (const elem of tbody.children) {
    elem.children[0].textContent = i;
    i++;
  }
}

function reorder() {
  let orderButton = document.getElementById('order');

  orderButton.addEventListener('click', e => {
    if(orderButton.className === "btn btn-outline-secondary") {
      list.sort((a, b) => a.localeCompare(b));
       
    }
    else {

    }
  })
}

getMovieData();