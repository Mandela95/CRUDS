let cruds = document.getElementById("cruds");
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let search = document.getElementById("search");
let searchTitle = document.getElementById("searchTitle");
let searchCategory = document.getElementById("searchCategory");

let mood = "create";
let assistantVar;

let popupBox = document.createElement("div");
popupBox.style.classList = "popubBox";
let heading = document.createElement("h1");
let text = document.createElement("p");
let closePopupBtn = document.createElement("button");
closePopupBtn.style.classList = "closePopupBtn";

function popUp() {
  heading.textContent = `Attention`;
  text.textContent = "Please Fill All Required Fields **";
  closePopupBtn.textContent = "X";

  popupBox.append(closePopupBtn, heading, text);
  document.body.append(popupBox);

  closePopupBtn.addEventListener("click", function () {
    closePopupBtn.parentElement.remove();
    cruds.style.filter = "blur(0px)";
  });
}

popupBox.style =
  "background-color: #eee; border: 1px solid #ccc; padding: 40px; color: #331107; text-align: center; font-size: 20px; position: absolute; border-radius: 10px ; transition: 0.3s; top: 50%; left: 50%; transform: translate(-50%, -50%)";
closePopupBtn.style =
  "position: absolute; top: -22px; right: -15px; width: 32px; height: 32px; background-color: red; border: none; color: #fff; border-radius: 50%; font-weight: 900; cursor: pointer; transition: 0.3s;";

// 1 => function getTotal()
function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - discount.value;
    total.innerHTML = `${result + " $"}`;
    total.style.backgroundColor = "#0f0";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#f10";
  }
}

// create product
let dataProduct;
if (localStorage.product != null) {
  dataProduct = JSON.parse(localStorage.product);
} else {
  dataProduct = [];
}

// 2 => function create new product
submit.onclick = function () {
  let newProduct = {
    title: title.value.charAt(0).toUpperCase() + title.value.slice(1),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.charAt(0).toUpperCase() + category.value.slice(1),
  };

  if (title.value != "" && price.value != "") {
    if (mood === "create") {
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          dataProduct.push(newProduct);
        }
      } else {
        dataProduct.push(newProduct);
      }
    } else {
      dataProduct[assistantVar] = newProduct;
      mood = "create";
      submit.innerHTML = "Create";
      count.style.display = "block";
    }
    clearData();
  } else {
    popUp();
    cruds.style.filter = "blur(10px)";
  }

  // save local storage
  localStorage.setItem("product", JSON.stringify(dataProduct));

  showData();
};

// clear inputs
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

// read
function showData() {
  getTotal();
  let table = "";
  for (let i = 0; i < dataProduct.length; i++) {
    table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataProduct[i].title}</td>
          <td>${dataProduct[i].price}</td>
          <td>${dataProduct[i].taxes}</td>
          <td>${dataProduct[i].ads}</td>
          <td>${dataProduct[i].discount}</td>
          <td>${dataProduct[i].total}</td>
          <td>${dataProduct[i].category}</td>
          <td><button onclick="updateData(${i})" id="update">Update</button></td>
          <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>`;
  }
  document.getElementById("tbody").innerHTML = table;
  let btnDelete = document.getElementById("deletaAll");
  if (dataProduct.length > 0) {
    btnDelete.innerHTML = `
    <button onclick="deleteAll()">Delete All ( ${dataProduct.length} )</button>
    `;
  } else {
    btnDelete.innerHTML = "";
  }
}
showData();

// delete
function deleteData(i) {
  dataProduct.splice(i, 1);
  localStorage.product = JSON.stringify(dataProduct);
  showData();
}

// delete all
function deleteAll() {
  localStorage.clear();
  dataProduct.splice(0);
  showData();
}

// update
function updateData(i) {
  title.value = dataProduct[i].title;
  price.value = dataProduct[i].price;
  taxes.value = dataProduct[i].taxes;
  ads.value = dataProduct[i].ads;
  discount.value = dataProduct[i].discount;
  getTotal();
  count.style.display = "none";
  category.value = dataProduct[i].category;
  submit.innerHTML = "Update";
  mood = "update";
  assistantVar = i;

  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// search
let searchMood = "title";

function getSearchMood(id) {
  let search = document.getElementById("search");
  if (id == "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.placeholder = "Search By " + searchMood;
  search.focus();
  search.value = "";
  showData();
}

function searchData(value) {
  let table = "";
  for (let i = 0; i < dataProduct.length; i++) {
    if (searchMood == "title") {
      if (dataProduct[i].title.includes(value)) {
        table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataProduct[i].title}</td>
          <td>${dataProduct[i].price}</td>
          <td>${dataProduct[i].taxes}</td>
          <td>${dataProduct[i].ads}</td>
          <td>${dataProduct[i].discount}</td>
          <td>${dataProduct[i].total}</td>
          <td>${dataProduct[i].category}</td>
          <td><button onclick="updateData(${i})" id="update">Update</button></td>
          <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>`;
      }
    } else {
      if (dataProduct[i].category.includes(value)) {
        table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataProduct[i].title}</td>
          <td>${dataProduct[i].price}</td>
          <td>${dataProduct[i].taxes}</td>
          <td>${dataProduct[i].ads}</td>
          <td>${dataProduct[i].discount}</td>
          <td>${dataProduct[i].total}</td>
          <td>${dataProduct[i].category}</td>
          <td><button onclick="updateData(${i})" id="update">Update</button></td>
          <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
        </tr>`;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}
