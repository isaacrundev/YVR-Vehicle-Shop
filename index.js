const addToCartBtns = Array.from(document.querySelectorAll(".add-to-cart"));
const productNameElement = document.querySelector(".cart-item-product-name");
const productQtyElement = document.querySelector(".cart-item-qty");
const productPriceElement = document.querySelector(".cart-item-price");
const shoppingCart = document.querySelector("#shopping-cart");
const cartMenuElement = document.querySelector("#cart-menu");
const itemListElement = document.querySelector("#item-list");
const cartItemElement = document.querySelector("#cart-item");
let removeItemBtn = Array.from(document.querySelectorAll(".cart-item-remove"));
const clearCartBtn = document.querySelector("#clear-cart");
const itemDiv = document.querySelector(".item-div");
const amountInTotalElement = document.querySelector("#cart-total");

let productData = [];
let isOpen = false;
let cartQtyTotal = 0;
let cartAmtTotal = 0;

function sendHttpReq(method, url, data) {
  return axios.get(url);
}

function fetchProductProperties() {
  sendHttpReq("GET", "https://jsonblob.com/api/1028730651519762432")
    .then(({ data }) => {
      productData = data.vehicles;
    })
    .catch((err) => console.error(`Error Msg: ${err}`));
}

// cart menu toggle
shoppingCart.addEventListener("click", () => {
  if (isOpen == false && cartQtyTotal > 0) {
    cartMenuElement.style.display = "flex";
    isOpen = true;
    removeItemBtn = Array.from(document.querySelectorAll(".cart-item-remove"));
    removeItem(productData);
  } else {
    cartMenuElement.style.display = "none";
    isOpen = false;
  }
});

// add to cart button
for (let i = 0; i < addToCartBtns.length; i++) {
  addToCartBtns[i].addEventListener("click", () => {
    cartCount(productData[i]);
    totalAmt(productData[i]);
    addToCart();
  });
}

function addToCart() {
  itemListElement.innerHTML = "";
  productData.forEach((i) => {
    itemListElement.innerHTML += `<div class="item-div" id="${i.name}">
  <div class="cart-item-product-name">${i.name}</div>
  <div class="cart-item-qty">${i.qty}</div>
  <div class="cart-item-price">$${i.price * i.qty}</div>
  <button class="cart-item-remove">Remove</button>
  </div>`;
    if (i.qty == 0) {
      document.getElementById(`${i.name}`).style.display = "none";
    }
  });
}

// counting system of shoppingCart
function cartCount(product) {
  cartQtyTotal += 1;
  product.qty += 1;
  shoppingCart.style.fontWeight = "bold";
  shoppingCart.textContent = `Shopping Cart (${cartQtyTotal})`;
}

// total amount of shopping cart
function totalAmt(product) {
  cartAmtTotal += product.price;
  amountInTotalElement.textContent = "$" + cartAmtTotal;
}

// clear cart
clearCartBtn.addEventListener("click", () => {
  if (confirm("Are you sure to clear all items in shopping cart?") == true) {
    if (confirm("Really?🥺") == true) {
      while (itemListElement.hasChildNodes()) {
        itemListElement.removeChild(itemListElement.firstChild);
      }
      for (let i = 0; i < productData.length; i++) {
        productData[i].qty = 0;
      }
      cartQtyTotal = 0;
      cartAmtTotal = 0;
      amountInTotalElement.textContent = "$" + cartAmtTotal;
      shoppingCart.style.fontWeight = "normal";
      shoppingCart.textContent = `Shopping Cart (${cartQtyTotal})`;
      cartMenuElement.style.display = "none";
      isOpen = false;
    }
  }
});

// remove individual item
function removeItem(productData) {
  removeItemBtn.map((i) => {
    i.addEventListener("click", () => {
      if (
        confirm(`Are you sure to remove this item in shopping cart?🥺`) == true
      ) {
        const removeName = i.parentElement.children[0].innerText;
        const searchObj = productData.find((each) => each.name == removeName);
        let removeQty = i.parentElement.children[1].innerText;
        const removePrice = i.parentElement.children[2].innerText;
        cartQtyTotal -= parseInt(removeQty);
        cartAmtTotal -= parseInt(removePrice.substr(1));
        i.parentElement.remove();
        shoppingCart.textContent = `Shopping Cart (${cartQtyTotal})`;

        if (cartQtyTotal == 0 || cartAmtTotal == 0) {
          shoppingCart.style.fontWeight = "normal";
          shoppingCart.textContent = `Shopping Cart (${cartQtyTotal})`;
          cartMenuElement.style.display = "none";
          isOpen = false;
        }
      }
    });
  });
}

window.addEventListener("load", fetchProductProperties);
