const addToCartBtns = document.querySelectorAll(".add-to-cart");
const shoppingCart = document.querySelector("#shopping-cart");
const cartMenu = document.querySelector("#cart-menu");
const itemList = document.querySelector("#item-list");
const cartItem = document.querySelector("#cart-item");
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
shoppingCart.addEventListener("click", function (e) {
  e.preventDefault();
  if (isOpen == false && cartQtyTotal > 0) {
    cartMenu.style.display = "flex";
    isOpen = true;
  } else {
    cartMenu.style.display = "none";
    isOpen = false;
  }
});

// add to cart button
for (let i = 0; i < addToCartBtns.length; i++) {
  let cartBtn = addToCartBtns[i];
  cartBtn.addEventListener("click", function (e) {
    e.preventDefault();
    productData[i].qty += 1;
    cartQtyTotal += 1;
    cartAmtTotal += productData[i].price;
    amountInTotal.innerHTML = "$" + cartAmtTotal;
    const cartItemClone = document.importNode(cartItem.content, true);
    cartItemClone.querySelector(".cart-item-product-name").textContent =
      productData[i].name;
    cartItemClone.querySelector(".cart-item-qty").textContent =
      productData[i].qty;
    cartItemClone.querySelector(".cart-item-price").textContent =
      productData[i].price;
    itemList.appendChild(cartItemClone);

    // change cart button numbers and fonts bold
    if (cartQtyTotal > 0) {
      shoppingCart.style.fontWeight = "bold";
      shoppingCart.textContent = `Shopping Cart (${cartQtyTotal})`;
    }
  });
}

// clear cart
clearCartBtn.addEventListener("click", function (e) {
  e.preventDefault();
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
