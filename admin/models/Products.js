//Định nghĩa Product constructor

function Product(
  id,
  name,
  price,
  screen,
  backCamera,
  frontCamera,
  img,
  description,
  type
) {
  //Khai báo các thuộc tính
  this.id = id;
  this.name = name;
  this.price = price;
  this.screen = screen;
  this.backCamera = backCamera;
  this.frontCamera = frontCamera;
  this.img = img;
  this.description = description;
  this.type = type;
}

//Khai báo các phương thức (method)
