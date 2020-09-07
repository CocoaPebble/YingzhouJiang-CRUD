let tbody = document.querySelector('tbody');
let ul = document.querySelector('ul');
let data = [];
let favList = [];
let currentPage = 1;

async function getData() {
    const URL = 'https://api.themoviedb.org/3/movie/top_rated?api_key=0c6bd38e0aba55d55ef8b5865703b872';
    try {
        const response = await fetch(URL);
        const json = await response.json();
        extractName(json);
    } catch (e) {
        console.log("loading data error");
    }
    return createLimitTable();;
}

function extractName(json) {
    for (const elem of json.results) {
        data.push(elem.title);
    }
}

function createLimitTable() {
    tbody.innerHTML = '';
    let startRow = (currentPage - 1) * 10 + 1;
    let endRow = currentPage < Math.ceil(data.length / 10) ? startRow + 9 : data.length;

    for (let i = startRow, n = endRow; i <= n; i++) {
        createRow(data[i - 1], i);
    }

    pagination();
}

function createRow(name, id) {
    let tr = document.createElement('tr');
    let tdID = document.createElement('td');
    let tdMovieName = document.createElement('td');
    let tdButtonGroup = document.createElement('td');

    tdID.textContent = id;
    tdMovieName.textContent = name;

    tr.append(tdID);
    tr.append(tdMovieName);
    tdButtonGroup.append(addSaveButton());
    tdButtonGroup.append(addEditButton());
    tdButtonGroup.append(addDeleteButton());
    tr.append(tdButtonGroup);
    tbody.append(tr);
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
    let name = e.target.parentNode.parentNode.children[1].textContent;
    let id = e.target.parentNode.parentNode.children[0].textContent;

    if (e.target.textContent === 'save') {
        localStorage.setItem(id, name);
        favList.push({ id, name });
        updateFav();

        e.target.className = "btn btn-sm btn-warning mr-2";
        e.target.textContent = "saved";
    }
    else {
        index = favList.find(item => item.name === name);
        favList.splice(index, 1);
        updateFav();
        e.target.className = "btn btn-sm btn-outline-warning mr-2";
        e.target.textContent = "save";
    }
}

function updateFav() {
    document.getElementById('modal-body').innerHTML = '';
    for (let i = 0, n = favList.length; i < n; i++) {
        createFavRow(favList[i].name);
    }
}

function createFavRow(name) {
    let favTable = document.getElementById('modal-body');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.textContent = name;
    tr.append(td);
    favTable.append(tr);
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
    let name = e.target.parentNode.parentNode.children[1].textContent;
    let id = e.target.parentNode.parentNode.children[0].textContent;

    let editInput = document.getElementById('editMovie');
    let editButton = document.getElementById('editButton');

    editInput.select();
    editInput.value = name;
    editButton.addEventListener('click', event => {
        data[id - 1] = editInput.value;
        createLimitTable();

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

function deleteButtonEvent(e) {
    let name = e.target.parentNode.parentNode.children[1].textContent;
    let id = e.target.parentNode.parentNode.children[0].textContent;

    data.splice(id - 1, 1);
    createLimitTable();
}

function pushData() {
    let newMovie = document.getElementById('newMovie');
    let newButton = document.getElementById('submitButton');

    newButton.addEventListener('click', e => {
        let name = newMovie.value;
        data.push(name);
        createLimitTable();
        newMovie.value = '';
    })
}

function reorder() {
    let order = document.getElementById('order');

    order.addEventListener('click', e => {
        if (order.innerText === 'order' || order.innerText === 'order up') {
            data.sort((a, b) => a.localeCompare(b));
            createLimitTable();
            order.innerText = "order down";
        }
        else {
            data.sort((a, b) => b.localeCompare(a));
            createLimitTable();
            order.innerText = "order up";
        }
    })
}

function pagination() {

    createPagi();

    let prev = document.getElementById('prev');
    let next = document.getElementById('next');
    
    prev.addEventListener('click', e => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
        }
        createLimitTable();
    })

    next.addEventListener('click', e => {
        e.preventDefault();
        if (currentPage < Math.ceil(data.length / 10)) {
            currentPage++;
        }
        createLimitTable();
    })
}

function createPagi() {
    ul.innerHTML = '';
    let pageNumber = Math.ceil(data.length / 10);
    console.log("data length : ", data.length);
    console.log("pageNumber : ", pageNumber);

    for (let i = 0, n = pageNumber; i <= n + 1; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');

        li.className = "page-item";
        a.className = "page-link";
        a.href = "#";

        if (i === 0) {
            a.textContent = "Previous";
            li.id = 'prev';
        }
        else if (i === pageNumber + 1) {
            a.textContent = "Next";
            li.id = "next";
        }
        else a.textContent = i;

        li.append(a);
        ul.append(li);
    }
}

getData();
pushData();
reorder();