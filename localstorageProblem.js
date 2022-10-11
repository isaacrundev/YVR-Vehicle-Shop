const addToCartBtns = Array.from(document.querySelectorAll(".add-to-cart"));
const productName = document.querySelector(".cart-item-product-name");
const productQty = document.querySelector(".cart-item-qty");
const productPrice = document.querySelector(".cart-item-price");
const shoppingCart = document.querySelector("#shopping-cart");
const cartMenu = document.querySelector("#cart-menu");
const itemList = document.querySelector("#item-list");
const cartItemElement = document.querySelector("#cart-item");
const clearCartBtn = document.querySelector("#clear-cart");
const itemDiv = document.querySelector(".item-div");
const removeItemBtn = document.querySelector(".cart-item-remove");
const amountInTotal = document.querySelector("#cart-total");

let isOpen = false;
let productData = [];
let cartQtyTotal = 0;
let cartAmtTotal = 0;

function sendHttpReq(method, url, data) {
  return axios.get(url);
}

function fetchProductProperties() {
  sendHttpReq("GET", "https://jsonblob.com/api/1027702040876564480")
    .then(({ data }) => {
      productData = data.vehicles;
    })
    .catch((err) => console.error(`Error Msg: ${err}`));
}

// cart menu toggle
shoppingCart.addEventListener("click", () => {
  let productCount = localStorage.getItem("cartCount");
  productCount = parseInt(productCount);
  if (isOpen == false && productCount) {
    cartMenu.style.display = "flex";
    isOpen = true;
  } else {
    cartMenu.style.display = "none";
    isOpen = false;
  }
});

// add to cart button
for (let i = 0; i < addToCartBtns.length; i++) {
  addToCartBtns[i].addEventListener("click", () => {
    cartCount(productData[i]);
    totalAmt(productData[i]);
    addElementsToCart();
    // cartQtyTotal += 1;
    // shoppingCart.style.fontWeight = "bold";
    // shoppingCart.textContent = `Shopping Cart (${cartQtyTotal})`;
    // cartAmtTotal += productData[i].price;
    // amountInTotal.innerHTML = "$" + cartAmtTotal;
    // productData[i].qty += 1;
    // const cartItemClone = document.importNode(cartItem.content, true);
    // cartItemClone.productName.textContent = productData[i].name;
    // cartItemClone.productQty.textContent = productData[i].qty;
    // cartItemClone.productPrice.textContent = productData[i].price;
    // itemList.appendChild(cartItemClone);
  });
}

function addElementsToCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  console.log(cartItems);
  if (cartItems) {
    Object.values(cartItems).map((item) => {
      const cartItemClone = document.importNode(cartItemElement.content, true);
      cartItemClone.productName.textContent = item.name;
      cartItemClone.productQty.textContent = item.qty;
      cartItemClone.productPrice.textContent = item.price;
      itemList.appendChild(cartItemClone);
    });
  }
}

// counting system of shoppingCart
function cartCount(product) {
  let productCount = localStorage.getItem("cartCount");
  productCount = parseInt(productCount);
  if (productCount) {
    localStorage.setItem("cartCount", productCount + 1);
    shoppingCart.textContent = `Shopping Cart (${productCount + 1})`;
  } else {
    localStorage.setItem("cartCount", 1);
    shoppingCart.style.fontWeight = "bold";
    shoppingCart.textContent = `Shopping Cart (1)`;
  }
  addItem(product);
}

// adding and showing a speified item in shopping cart
function addItem(product) {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  if (cartItems != null) {
    if (cartItems[product.name] == undefined) {
      cartItems = { ...cartItems, [product.name]: product };
    }
    cartItems[product.name].qty += 1;
  } else {
    product.qty = 1;
    cartItems = { [product.name]: product };
  }
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

// check local storage for the cart count whenever the page loads
function CartOnLoad() {
  let productCount = localStorage.getItem("cartCount");
  if (productCount) {
    shoppingCart.textContent = `Shopping Cart (${productCount})`;
  }
}

// total amount of shopping cart
function totalAmt(product) {
  let cartTotalAmt = localStorage.getItem("totalAmount");

  if (cartTotalAmt != null) {
    cartTotalAmt = parseInt(cartTotalAmt);
    localStorage.setItem("totalAmount", cartTotalAmt + product.price);
  } else {
    localStorage.setItem("totalAmount", product.price);
  }
}

// clear cart
clearCartBtn.addEventListener("click", () => {
  if (confirm("Are you sure to clear all items in shopping cart?") == true) {
    if (confirm("Really? 🥺") == true) {
      while (itemList.hasChildNodes()) {
        itemList.removeChild(itemList.firstChild);
      }
      for (let i = 0; i < productData.length; i++) {
        productData[i].qty = 0;
      }
      cartQtyTotal = 0;
      cartAmtTotal = 0;
      amountInTotal.innerHTML = "$" + cartAmtTotal;
      shoppingCart.style.fontWeight = "normal";
      shoppingCart.textContent = `Shopping Cart (${cartQtyTotal})`;
      cartMenu.style.display = "none";
      isOpen = false;
    }
  }
});

// remove individual item

window.addEventListener("load", fetchProductProperties);
CartOnLoad();
addElementsToCart();
