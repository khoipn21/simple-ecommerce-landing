function addToCart(productId, quantity) {
	let cart = JSON.parse(localStorage.getItem("cart") || "[]");
	let existingProduct = cart.find((p) => p.bookId === productId);

	existingProduct.quantity = quantity;
	existingProduct.total = existingProduct.quantity * existingProduct.price;
	localStorage.setItem("cart", JSON.stringify(cart));
}

function updateQuantityAndTotal(productId, newQuantity) {
	let cart = JSON.parse(localStorage.getItem("cart") || "[]");
	let productIndex = cart.findIndex((p) => p.bookId === productId);
	if (productIndex !== -1) {
		if (newQuantity < 1) {
			cart.splice(productIndex, 1);
		} else {
			cart[productIndex].quantity = newQuantity;
			cart[productIndex].total =
				cart[productIndex].quantity * cart[productIndex].price;
		}
		localStorage.setItem("cart", JSON.stringify(cart));
		updateCartUI();
	}
}

function updateCartUI() {
	let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
	const countCart = document.querySelector(".count.count-cart");
	let totalCart = 0;
	cartItems.forEach((item) => (totalCart = totalCart + item.quantity));
	countCart.innerHTML = totalCart;
	let updatedCartMain = `
      <div class="cart-screen">
    <ul class="cart-list">
      ${cartItems.map((item) => {
				return `
        <li>
          <div class="cart-item">
              <div class="remove-button">
                <i class="fa-solid fa-x"></i>
              </div>

              <div class="cart-image">
                <img src=${item.images} alt=${item.name} height="120px"/>
              </div>

              <div class="cart-id">
                  <h6>ID</h6>
                  <h5>${item.bookId}</h5>
              </div>

                <div class="cart-text">
                  <h6>TÊN SẢN PHẨM</h6>
                  <h5>${item.name}</h5>
              </div>

              <div class="cart-qty">
                <h6>SỐ LƯỢNG</h6>
                <input
                  type="number"
                  placeholder="Type here"
                  class="item-quantity"
                  id="product_qty"
                  required
                  max=${item.stock}
                  value=${item.quantity}
                />
              </div>
              <div class="cart-price">
                <h6>GIÁ</h6>
                <h5 class="item-total" id="item-total-${item.bookId}">
                  $${(item.quantity * item.price).toFixed(2)}
                </h5>
              </div>
          </div>
        </li>`;
			})}
    </ul>
    <div class="right-side">
        <div class=total>
          <span class="sub">Tổng tiền:&nbsp;</span>
          <span id="total-price">
              $${cartItems
								.reduce((total, item) => total + item.total, 0)
								.toFixed(2)}
          </span>
        </div>
        <div class="button-wrapper">
          <a href="index.html" class="btn btn-primary">Tiếp tục mua hàng</a>
          <a href="#" class="btn btn-primary">Thanh toán</a>
        </div>
    </div>
  </div>
  `;
	const cartWrapper = document.querySelector(".cart-wrapper");
	cartWrapper.innerHTML = updatedCartMain;
	addEventListeners();
}

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let cartMain = `
  <div class="cart-screen">
    <ul class="cart-list">
      ${cartItems.map((item) => {
				return `
        <li>
          <div class="cart-item">
              <div class="remove-button">
                <i class="fa-solid fa-x"></i>
              </div>

              <div class="cart-image">
                <img src=${item.images} alt=${item.name} height="120px"/>
              </div>

              <div class="cart-id">
                  <h6>ID</h6>
                  <h5>${item.bookId}</h5>
              </div>

                <div class="cart-text">
                  <h6>TÊN SẢN PHẨM</h6>
                  <h5>${item.name}</h5>
              </div>

              <div class="cart-qty">
                <h6>SỐ LƯỢNG</h6>
                <input
                  type="number"
                  placeholder="Type here"
                  class="item-quantity"
                  id="product_qty"
                  required
                  max=${item.stock}
                  value=${item.quantity}
                />
              </div>
              <div class="cart-price">
                <h6>GIÁ</h6>
                <h5 class="item-total" id="item-total-${item.bookId}">
                 $${(item.quantity * item.price).toFixed(2)}
                </h5>
              </div>
          </div>
        </li>`;
			})}
    </ul>
    <div class="right-side">
        <div class=total>
          <span class="sub">Tổng tiền:&nbsp;</span>
          <span id="total-price">
              $${cartItems
								.reduce((total, item) => total + item.total, 0)
								.toFixed(2)}
          </span>
        </div>
        <div class="button-wrapper">
          <a href="index.html" class="btn btn-primary">Tiếp tục mua hàng</a>
          <a href="#" class="btn btn-primary">Thanh toán</a>
        </div>
    </div>
  </div>
`;
const cartWrapper = document.querySelector(".cart-wrapper");
cartWrapper.innerHTML = cartMain;

function addEventListeners() {
	document.querySelectorAll(".item-quantity").forEach((input) => {
		input.addEventListener("change", function () {
			const productId =
				this.closest(".cart-item").querySelector(".cart-id h5").textContent;
			const newQuantity = parseInt(this.value);
			updateQuantityAndTotal(productId, newQuantity);
		});
	});

	document.querySelectorAll(".remove-button").forEach((button) => {
		button.addEventListener("click", function () {
			const productId =
				this.closest(".cart-item").querySelector(".cart-id h5").textContent;
			updateQuantityAndTotal(productId, 0); // Set quantity to 0 to remove the item
		});
	});
}

addEventListeners();
