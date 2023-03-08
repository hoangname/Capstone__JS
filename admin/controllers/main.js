//Hàm gửi yêu cầu lấy danh sách sản phẩm từ API
async function getProducts(searchValue) {
  apiGetProducts(searchValue)
    .then((response) => {
      //Call API thành công
      const products = response.data.map((product) => {
        return new Product(
          product.id,
          product.name,
          product.price,
          product.screen,
          product.backCamera,
          product.frontCamera,
          product.img,
          product.description,
          product.type
        );
      });
      renderProducts(products);
      console.log(response.data);
      // console.log(response.data[2].name);
    })
    .catch((error) => {
      //callAPI thất bại
      alert("API get products error");
    });
}

//Hàm thêm sản phẩm : DOM và gửi yêu cầu thêm sản phẩm tới API
async function createProduct() {
  const product = {
    name: getElement("#name").value,
    price: getElement("#price").value,
    screen: getElement("#screen").value,
    backCamera: getElement("#backCamera").value,
    frontCamera: getElement("#frontCamera").value,
    img: getElement("#image").value,
    description: getElement("#description").value,
    type: getElement("#type").value,
  };
  //validate
  let products = apiGetProducts()
    .then((respone) => {
      return respone.data;
    })
    .catch((error) => {
      //callAPI thất bại
      // alert("API get products error");
    });
  let isValid = await validate(products);
  if (!isValid) {
    return;
  }

  await apiCreateProduct(product)
    .then((respone) => {
      getProducts();
      resetTB();
      showAlert("Add phone successfully");
      closePopUp();
    })
    .catch((error) => {
      alert("Thêm sản phẩm thất bại");
    });
}

//Hàm xóa sản phẩm
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then((respone) => {
      getProducts();
      resetTB();
      showAlertDel("Delete phone successfully");
      closePopUpDel();
    })
    .catch((error) => {
      alert("Xóa sản phẩm thất bại");
    });
}

//Hàm lấy chi tiết của 1 sản phẩm và hiển thị ra modal
function selectProduct(productId) {
  apiGetProductById(productId)
    .then((respone) => {
      const product = respone.data;
      getElement("#name").value = product.name;
      getElement("#price").value = product.price;
      getElement("#screen").value = product.screen;
      getElement("#backCamera").value = product.backCamera;
      getElement("#frontCamera").value = product.frontCamera;
      getElement("#image").value = product.img;
      getElement("#description").value = product.description;
      getElement("#type").value = product.type;

      //Mở và cập nhật  lại giao diện cho modal
      getElement(".modal-footer").innerHTML = `
    <button class="btn btn-warning" onclick="updateProduct('${product.id}')">Update Phone</button>
    <button class="btn btn-secondary" data-dismiss="modal">Close</button>
    `;
      $("#myModal").modal("show");
    })
    .catch((error) => {
      alert("Lấy chi tiết sản phẩm thất bại");
    });
}

//Hàm cập nhật sản phẩm
async function updateProduct(productId) {
  const product = {
    name: getElement("#name").value,
    price: getElement("#price").value,
    screen: getElement("#screen").value,
    backCamera: getElement("#backCamera").value,
    frontCamera: getElement("#frontCamera").value,
    img: getElement("#image").value,
    description: getElement("#description").value,
    type: getElement("#type").value,
  };

  //validate
  let products = await apiGetProducts()
    .then((respone) => {
      return respone.data;
    })
    .catch((error) => {
      //callAPI thất bại
      // alert("API get products error");
    });
  let isValid = await validate(products, productId);
  if (!isValid) {
    return;
  }

  console.log(productId);

  apiUpdateProduct(productId, product)
    .then((respone) => {
      // debugger;
      getProducts();
      resetTB();
      showAlert("Update phone successfully");
      closePopUp();
    })
    .catch((error) => {
      alert("Cập nhật sản phẩm thất bại");
    });
}

//Hàm hiển thị danh sách sản phẩm ra table
function renderProducts(products) {
  let html = products.reduce((result, product, index) => {
    return (
      result +
      `
      <tr>
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td style="text-align: center">
      <img src="${product.img}" width="79" height="79">
      </td>
      <td>${product.description}</td>
      <td>
      <button class="btn btn-primary" onclick="selectProduct('${
        product.id
      }')">Edit<i class="fa fa-edit"></i></button>
      <button class="btn btn-danger" onclick="deleteProduct('${
        product.id
      }')">Delete</button>
      </td>
      </tr>
    `
    );
  }, "");
  document.getElementById("tblDanhSachSP").innerHTML = html;
}

// Validate

async function validate(products, productId) {
  let isValid = true;

  //Validate name
  let name = getElement("#name").value;
  // await products.then(function (result) {
  //   for (let i = 0; i < result.length; i++) {
  //     // console.log(result[i].name);
  //     if (result[i].name.trim() == name.trim()) {
  //       getElement("#tbName").innerHTML = "(*)This phone already exist";
  //       return false;
  //     }
  //   }
  // });
  // let tbName = getElement("#tbName").innerHTML;
  // console.log(tbName);
  // if (tbName == "(*)This phone already exist" || tbName.trim() == "") {
  //   isValid = false;
  // }
  // console.log(isValid);
  const arrProducts = await products;
  // console.log();
  console.log(productId);
  for (let i = 0; i < arrProducts.length; i++) {
    if (arrProducts[i].name.toLowerCase() == name.toLowerCase()) {
      if (arrProducts[i].id == productId) {
        getElement("#tbName").innerHTML = "&zwj;";
      } else {
        isValid = false;
        // console.log(name);
        getElement("#tbName").innerHTML = "(*)This phone already exist";
      }
    }
  }
  let tbName = getElement("#tbName").innerHTML;
  // console.log(tbName);
  if (tbName != "(*)This phone already exist") {
    if (!name.trim()) {
      isValid = false;
      getElement("#tbName").innerHTML = "(*)This field can't be empty";
    } else {
      getElement("#tbName").innerHTML = "&zwj;";
    }
  }

  // // if(!isValid){

  // // }

  // console.log(isValid);
  // // console.log(name);
  // if (!name.trim()) {
  //   isValid = false;
  //   getElement("#tbName").innerHTML = "(*)This field can't be empty";
  // } else {
  //   getElement("#tbName").innerHTML = "&zwj;";
  // }

  //Validate price
  let price = getElement("#price").value;
  if (!price.trim()) {
    isValid = false;
    getElement("#tbPrice").innerHTML = "(*)This field can't be empty";
  } else if (!/^[0-9]*$/.test(price)) {
    isValid = false;
    getElement("#tbPrice").innerHTML = "(*)Price must be a number";
  } else {
    getElement("#tbPrice").innerHTML = "&zwj;";
  }

  //Validate screen
  let screen = getElement("#screen").value;
  if (!screen.trim()) {
    isValid = false;
    getElement("#tbScreen").innerHTML = "(*)This field can't be empty";
  } else {
    getElement("#tbScreen").innerHTML = "&zwj;";
  }

  //Validate backCamera
  let backCamera = getElement("#backCamera").value;
  if (!backCamera.trim()) {
    isValid = false;
    getElement("#tbBackCamera").innerHTML = "(*)This field can't be empty";
  } else {
    getElement("#tbBackCamera").innerHTML = "&zwj;";
  }

  //Validate frontCamera
  let frontCamera = getElement("#frontCamera").value;
  if (!frontCamera.trim()) {
    isValid = false;
    getElement("#tbFrontCamera").innerHTML = "(*)This field can't be empty";
  } else {
    getElement("#tbFrontCamera").innerHTML = "&zwj;";
  }

  //Validate image
  let image = getElement("#image").value;
  if (!image.trim()) {
    isValid = false;
    getElement("#tbImage").innerHTML = "(*)This field can't be empty";
  } else {
    getElement("#tbImage").innerHTML = "&zwj;";
  }

  //Validate description
  let description = getElement("#description").value;
  if (!description.trim()) {
    isValid = false;
    getElement("#tbDescription").innerHTML = "(*)This field can't be empty";
  } else {
    getElement("#tbDescription").innerHTML = "&zwj;";
  }

  //Validate type
  let type = getElement("#type").value;
  if (type == "type") {
    isValid = false;
    getElement("#tbType").innerHTML = "(*)Please select one option";
  } else {
    getElement("#tbType").innerHTML = "&zwj;";
  }

  return isValid;
}

//Hàm reset giá trị input
function resetTB() {
  getElement("#tbName").innerHTML = "&zwj;";
  getElement("#tbPrice").innerHTML = "&zwj;";
  getElement("#tbScreen").innerHTML = "&zwj;";
  getElement("#tbBackCamera").innerHTML = "&zwj;";
  getElement("#tbFrontCamera").innerHTML = "&zwj;";
  getElement("#tbImage").innerHTML = "&zwj;";
  getElement("#tbDescription").innerHTML = "&zwj;";
  getElement("#tbType").innerHTML = "&zwj;";
  getElement("#name").value = "";
  getElement("#price").value = "";
  getElement("#screen").value = "";
  getElement("#backCamera").value = "";
  getElement("#frontCamera").value = "";
  getElement("#image").value = "";
  getElement("#description").value = "";
  getElement("#type").value = "type";
}

//Alert
function showAlert(content) {
  let html = `
  <div class="my-popup-custom" >
	<span>${content}</span>
</div>
  `;
  getElement(".modal-content-popup").innerHTML = html;
  // getElement(".adminPage").innerHTML = html;
}
function showAlertDel(content) {
  let html = `
  <div class="my-popup-custom" >
	<span>${content}</span>
</div>
  `;
  // getElement(".modal-content").innerHTML += html;
  getElement(".adminPage").innerHTML = html;
}

//Close popup
function closePopUp() {
  getElement(".modal-content-popup .my-popup-custom").style.display = "block";
  setTimeout(() => {
    return (getElement(".modal-content-popup .my-popup-custom").style.display =
      "none");
  }, 1000);
}
function closePopUpDel() {
  getElement(".adminPage .my-popup-custom").style.display = "block";
  setTimeout(() => {
    return (getElement(".adminPage .my-popup-custom").style.display = "none");
  }, 1000);
}

getProducts();

//==========DOM=========
getElement("#btnThemSP").addEventListener("click", () => {
  getElement(".modal-footer").innerHTML = `
  <button class="btn btn-primary" onclick="createProduct()">Add Phone</button>
  <button class="btn btn-warning" data-dismiss="modal">Close</button> 
  `;
});

getElement("#txtSearch").addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  const searchValue = event.target.value;
  getProducts(searchValue);
});

//=========Helpers==========
function getElement(selector) {
  return document.querySelector(selector);
}
function getElement2(selector) {
  return document.querySelectorAll(selector);
}
