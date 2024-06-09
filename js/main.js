"use strict";

// modal
const modal = document.querySelector("[data-modal]");
const modalCloseBtn = document.querySelector("[data-modal-close]");
const modalCloseOverlay = document.querySelector("[data-modal-overlay]");
const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const loginBtn = document.querySelector(".login-btn");
const cart = JSON.parse(localStorage.getItem("cart") || "[]");
const countCart = document.querySelector(".count.count-cart");
let totalCart = 0;
cart.forEach((item) => (totalCart = totalCart + item.quantity));
countCart.innerHTML = totalCart;

const modalClose = () => {
	modal.classList.add("closed");
};

modalCloseOverlay.addEventListener("click", modalClose);
modalCloseBtn.addEventListener("click", modalClose);
loginBtn.addEventListener("click", loginHandler);
window.addEventListener("load", logoutHandler);

// Sidebar menu
fetch("./data/categories.json")
	.then((response) => response.json())
	.then((categories) => {
		const categoryList = document.querySelector(".sidebar-menu-category-list");

		categories.categories.forEach((category) => {
			const listItem = document.createElement("li");
			listItem.classList.add("sidebar-menu-category");

			listItem.innerHTML = `
        <button class="sidebar-accordion-menu" data-accordion-btn>
          <div class="menu-title-flex">
            <img src="${category.icon}" alt="${category.name}" class="menu-title-img" width="20"
			height="20">
            <p class="menu-title">${category.name}</p>
          </div>
          <div>
            <ion-icon name="add-outline" class="add-icon"></ion-icon>
            <ion-icon name="remove-outline" class="remove-icon"></ion-icon>
          </div>
        </button>
        <ul class="sidebar-submenu-category-list" data-accordion></ul>
      `;

			// Add subcategories to the nested list
			const subcategoryList = listItem.querySelector(
				".sidebar-submenu-category-list",
			);
			category.subcategories.forEach((subcategory) => {
				const subItem = document.createElement("li");
				subItem.classList.add("sidebar-submenu-category");
				subItem.innerHTML = `
          <a href="#" class="sidebar-submenu-title">
            <p class="product-name">${subcategory.name}</p>
            <data value="${subcategory.stock}" class="stock">${subcategory.stock}</data>
          </a>
        `;
				subcategoryList.appendChild(subItem);
			});

			categoryList.appendChild(listItem);
		});

		const accordionBtn = document.querySelectorAll("[data-accordion-btn]");
		const accordion = document.querySelectorAll("[data-accordion]");

		for (let i = 0; i < accordionBtn.length; i++) {
			accordionBtn[i].addEventListener("click", function () {
				const clickedBtn = this.nextElementSibling.classList.contains("active");

				for (let i = 0; i < accordion.length; i++) {
					if (clickedBtn) break;

					if (accordion[i].classList.contains("active")) {
						accordion[i].classList.remove("active");
						accordionBtn[i].classList.remove("active");
					}
				}

				this.nextElementSibling.classList.toggle("active");
				this.classList.toggle("active");
			});
		}
	});

//Product related data
const productShowcases = [
	{
		title: "Most Endorsed",
		products: [],
	},
	{
		title: "Best Sellers",
		products: [],
	},
	{
		title: "Staff Picks",
		products: [],
	},
];

const featuredProducts = [
	{
		title: "Deals of the day",
		products: [],
	},
];

const mainProducts = [
	{
		title: "New Books",
		products: [],
	},
];
fetch("../data/books.json")
	.then((response) => response.json())
	.then((products) => {
		const sortedBySold = [...products.books].sort((a, b) => b.sold - a.sold);
		console.log(sortedBySold);
		const sortedByRating = [...products.books].sort(
			(a, b) => b.rating - a.rating,
		);
		const sortedByStock = [...products.books].sort((a, b) => a.stock - b.stock);

		const bestSellers = sortedBySold.slice(0, 5);
		const mostEndorsed = sortedByRating.slice(0, 5);
		const featuredFilter = sortedByStock.slice(0, 3);

		const staffPicks = [];
		for (let i = 0; i < 5; i++) {
			const randomIndex = Math.floor(Math.random() * products.books.length);
			staffPicks.push(products.books[randomIndex]);
		}

		productShowcases[0].products = mostEndorsed;
		productShowcases[1].products = bestSellers;
		productShowcases[2].products = staffPicks;
		featuredProducts[0].products = [...featuredFilter];
		const productFeatured = document.querySelector(".product-featured");

		const featuredElement = createFeaturedElement(featuredProducts);
		const featuredTitle = document.createElement("h2");
		featuredTitle.classList.add("title");
		featuredTitle.textContent = featuredProducts[0].title;
		productFeatured.appendChild(featuredTitle);
		productFeatured.appendChild(featuredElement);

		const productMinimal = document.querySelector(".product-minimal");
		productShowcases.forEach((showcase) => {
			const showcaseElement = createShowcaseElement(showcase);
			productMinimal.appendChild(showcaseElement);
		});

		const productSide = document.querySelector(".sidebar");
		const sideElement = createShowcaseElement(productShowcases[1]);
		productSide.appendChild(sideElement);
	});

fetch("../data/books.json")
	.then((response) => response.json())
	.then((products) => {
		mainProducts[0].products = [...products.books];
		const productMain = document.querySelector(".product-main");
		const productTile = document.createElement("h2");
		productTile.classList.add("title");
		productTile.textContent = mainProducts[0].title;
		productMain.appendChild(productTile);
		const mainElement = createMainElement(mainProducts[0].products, 1, 8);
		productMain.appendChild(mainElement);
		const pagination = createPagination(mainProducts[0].products.length, 8);
		productMain.appendChild(pagination);
		let totalPages = Math.ceil(mainProducts[0].products.length / 8);
		const firstBtn = document.createElement("button");
		firstBtn.classList.add("pagination-button");
		const secondBtn = document.createElement("button");
		secondBtn.classList.add("pagination-button");
		const goToWrapper = document.createElement("div");
		goToWrapper.classList.add("goTo-wrapper");
		const goToBtn = document.createElement("button");
		goToBtn.classList.add("goTo-button");
		goToBtn.textContent = "...";
		const goToPage = document.createElement("input");
		goToPage.setAttribute("type", "number");
		goToPage.setAttribute("min", "1");
		goToPage.setAttribute("max", totalPages);
		goToPage.classList.add("pagination-input");
		// productMain.insertBefore(goToPage, pagination);
		if (totalPages >= 5) {
			firstBtn.textContent = 1;
			secondBtn.textContent = 2;
			firstBtn.dataset.page = 1;
			secondBtn.dataset.page = 2;
			pagination.insertBefore(firstBtn, pagination.firstChild);
			pagination.insertBefore(secondBtn, pagination.childNodes[1]);
			pagination.insertBefore(goToWrapper, pagination.childNodes[2]);
			goToWrapper.appendChild(goToBtn);
			goToWrapper.appendChild(goToPage);
			//goToPage.style.display = "none";
			pagination.firstChild.classList.add("active");
		} else pagination.firstChild.classList.add("active");

		let currentPage = parseInt(
			document.querySelector(".pagination-button.active").dataset.page,
		);

		const nextPage = document.createElement("button");
		nextPage.classList.add("pagination-button", "next");
		nextPage.textContent = "Next";
		nextPage.dataset.page = currentPage + 1;

		const prevPage = document.createElement("button");
		prevPage.classList.add("pagination-button", "prev");
		prevPage.dataset.page = currentPage - 1;
		prevPage.textContent = "Prev";

		pagination.appendChild(nextPage);
		pagination.insertBefore(prevPage, pagination.firstChild);

		if (currentPage >= Math.ceil(mainProducts[0].products.length / 8)) {
			nextPage.disabled = true;
		}

		if (currentPage <= 1) {
			prevPage.disabled = true;
		}

		if (totalPages >= 5) {
			document
				.querySelector(".goTo-button")
				.addEventListener("click", (event) => {
					event.preventDefault();
					if (!goToPage.classList.contains("active")) {
						goToPage.classList.add("active");
					} else {
						goToPage.classList.remove("active");
					}
				});
			document
				.querySelector(".pagination-input")
				.addEventListener("keypress", (event) => {
					if (event.key == "Enter") {
						event.preventDefault();
						const page = parseInt(event.target.value);
						if (page > totalPages || page < 1) {
							return;
						}
						const productMain = document.querySelector(".product-main");
						productMain.removeChild(productMain.querySelector(".product-grid"));
						const mainElement = createMainElement(
							mainProducts[0].products,
							page,
							8,
						);
						if (page < totalPages - 2) {
							firstBtn.dataset.page = page;
							secondBtn.dataset.page = page + 1;
							firstBtn.textContent = page;
							secondBtn.textContent = page + 1;
						} else if (page < totalPages - 1 && page > 1) {
							firstBtn.dataset.page = page - 1;
							secondBtn.dataset.page = page;
							firstBtn.textContent = page - 1;
							secondBtn.textContent = page;
						}

						if (
							pagination.querySelector(".pagination-button.active").dataset
								.page != page
						) {
							pagination
								.querySelector(".pagination-button.active")
								.classList.remove("active");
							pagination
								.querySelector(
									`.pagination-button[data-page="${page}"]:not(.next):not(.prev)`,
								)
								.classList.add("active");
						}
						nextPage.dataset.page = page + 1;
						prevPage.dataset.page = page - 1;

						if (
							nextPage.dataset.page >
							Math.ceil(mainProducts[0].products.length / 8)
						) {
							nextPage.disabled = true;
						} else nextPage.disabled = false;

						if (prevPage.dataset.page <= 0) {
							prevPage.disabled = true;
						} else prevPage.disabled = false;

						productMain.insertBefore(
							mainElement,
							document.querySelector(".pagination-wrapper"),
						);
					}
				});
		}

		document.querySelectorAll(".pagination-button").forEach((button) => {
			button.addEventListener("click", (event) => {
				event.preventDefault();
				const page = parseInt(event.target.dataset.page);
				const productMain = document.querySelector(".product-main");
				productMain.removeChild(productMain.querySelector(".product-grid"));
				const mainElement = createMainElement(
					mainProducts[0].products,
					page,
					8,
				);

				if (page < totalPages - 2) {
					firstBtn.dataset.page = page;
					secondBtn.dataset.page = page + 1;
					firstBtn.textContent = page;
					secondBtn.textContent = page + 1;
				} else if (page < totalPages - 1 && page > 1) {
					firstBtn.dataset.page = page - 1;
					secondBtn.dataset.page = page;
					firstBtn.textContent = page - 1;
					secondBtn.textContent = page;
				}

				if (
					pagination.querySelector(".pagination-button.active").dataset.page !=
					page
				) {
					pagination
						.querySelector(".pagination-button.active")
						.classList.remove("active");
					pagination
						.querySelector(
							`.pagination-button[data-page="${page}"]:not(.next):not(.prev)`,
						)
						.classList.add("active");
				}
				nextPage.dataset.page = page + 1;
				prevPage.dataset.page = page - 1;

				if (
					nextPage.dataset.page > Math.ceil(mainProducts[0].products.length / 8)
				) {
					nextPage.disabled = true;
				} else nextPage.disabled = false;

				if (prevPage.dataset.page <= 0) {
					prevPage.disabled = true;
				} else prevPage.disabled = false;

				productMain.insertBefore(
					mainElement,
					document.querySelector(".pagination-wrapper"),
				);
			});
		});
	});

// Create showcase element
function createShowcaseElement(showcase) {
	const showcaseDiv = document.createElement("div");
	showcaseDiv.classList.add("product-showcase");

	const title = document.createElement("h2");
	title.classList.add("showcase-heading");
	title.textContent = showcase.title;

	const wrapper = document.createElement("div");
	wrapper.classList.add("showcase-wrapper");

	const showcaseContainer = document.createElement("div");
	showcaseContainer.classList.add("showcase-container");
	showcase.products.forEach((product) => {
		const showcaseItem = document.createElement("div");
		showcaseItem.classList.add("showcase", "has-scrollbar");

		showcaseItem.innerHTML = `
      <a href="#" class="showcase-img-box">
        <img src="${product.image}" alt="${
			product.name
		}" class="showcase-img" width="80" height="120">
      </a>
      <div class="showcase-content">
        <a href="#">
          <h4 class="showcase-title">${product.name}</h4>
        </a>
        <a href="#" class="showcase-category">${product.category}</a>
        <div class="price-box">
          <p class="price">$${product.price.toFixed(2)}</p>
          <del>$${product.originalPrice.toFixed(2)}</del>
        </div>

		<div class="sold-box">
			<p class="sold">${product.sold} sold</p>
		</div>

		<div class="rating-box">
			<div class="rating">
				<i data-star="${product.rating}"></i>
			</div>
		</div>


      </div>
    `;

		showcaseContainer.appendChild(showcaseItem);
	});
	wrapper.appendChild(showcaseContainer);

	showcaseDiv.appendChild(title);
	showcaseDiv.appendChild(wrapper);

	return showcaseDiv;
}

//Deal of the day
function createFeaturedElement(products) {
	const wrapper = document.createElement("div");
	wrapper.classList.add("showcase-wrapper", "has-scrollbar");
	products[0].products.forEach((product) => {
		const featuredContainer = document.createElement("div");
		featuredContainer.classList.add("showcase-container");

		featuredContainer.innerHTML = `
		<div class = "showcase">
			<div class="showcase-banner">
                <img src= "${product.image}" 
					alt="${product.name}" 
					class="showcase-img"
					width="30px"
					height="40px">
            </div>

			<div class="showcase-content">
				<div class="rating-box">
					<div class="rating">
						<i data-star="${product.rating}"></i>
					</div>
				</div>

				<h3 class = "showcase-title">
					<a href="#" class = "showcase-title">
						${product.name}
					</a>
				</h3>

				<p class = "showcase-desc">
					Lorem ipsum dolor sit amet consectetur Lorem ipsum
					dolor dolor sit amet consectetur Lorem ipsum dolor
				</p>

				<div class="price-box">
					<p class="price">$${product.price.toFixed(2)}</p>
					<del>$${product.originalPrice.toFixed(2)}</del>
				</div>

				<button class="add-cart-btn">add to cart</button>

				<div class="showcase-status">
                    <div class="wrapper">
                    	<p> already sold: <b>${product.sold}</b> </p>
						<p> available: <b>${product.stock}</b> </p>
                    </div>

                    <div class="showcase-status-bar"></div>

                </div>

				<div class="countdown-box">

                    <p class="countdown-desc">
                        Hurry Up! Offer ends in:
                    </p>

                    <div class="countdown">
                    	<div class="countdown-content">
                        	<p class="display-number day"></p>
                          	<p class="display-text">Days</p>
                        </div>

                        <div class="countdown-content">
                          <p class="display-number hour"></p>
                          <p class="display-text">Hours</p>
                        </div>

                        <div class="countdown-content">
                          <p class="display-number min"></p>
                          <p class="display-text">Min</p>
                        </div>

                        <div class="countdown-content">
                          <p class="display-number sec"></p>
                          <p class="display-text">Sec</p>
                        </div>
                    </div>

                </div>
			</div>
		</div>`;
		wrapper.appendChild(featuredContainer);
	});
	let endSale = new Date("June 27, 2024 23:59:59").getTime();
	console.log(endSale);
	let x = setInterval(function () {
		let now = new Date().getTime();
		let dif = endSale - now;
		let days = Math.floor(dif / (1000 * 60 * 60 * 24));
		let hours = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((dif % (1000 * 60)) / 1000);
		document
			.querySelectorAll(".day")
			.forEach((item) => (item.innerHTML = days));
		document
			.querySelectorAll(".hour")
			.forEach((item) => (item.innerHTML = hours));
		document
			.querySelectorAll(".min")
			.forEach((item) => (item.innerHTML = minutes));
		document
			.querySelectorAll(".sec")
			.forEach((item) => (item.innerHTML = seconds));
		if (dif < 0) {
			clearInterval(x);
			const countdownBox = document.querySelectorAll(".countdown-box");
			countdownBox.forEach((box) => {
				const countdown = box.querySelector(".countdown");
				countdown.style.display = "none";
				const expired = document.createElement("h3");
				expired.classList.add("expired");
				expired.innerHTML = "Offer Expired";
				box.appendChild(expired);
			});
		}
	}, 1000);
	return wrapper;
}

// Create main element
function createMainElement(products, currentPage, itemsPerPage) {
	const start = (currentPage - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	const paginatedProducts = products.slice(start, end);
	console.log(paginatedProducts);
	const productGrid = document.createElement("div");
	productGrid.classList.add("product-grid");
	paginatedProducts.forEach((product) => {
		const productItem = document.createElement("div");
		productItem.classList.add("showcase");

		productItem.innerHTML = `
		<div class="showcase-banner">
			<img src= "${product.image}" 
				alt="${product.name}" 
				class="showcase-img"
				width="300"
				>
			<p class = "showcase-badge angle">-${(
				100 -
				(product.price / product.originalPrice) * 100
			).toFixed(0)}%</p>
			<div class="showcase-actions">

				<button class="btn-action">
					<ion-icon name="heart-outline"></ion-icon>
				</button>

				<button class="btn-action">
					<ion-icon name="eye-outline"></ion-icon>
				</button>

				<button class="btn-action">
					<ion-icon name="repeat-outline"></ion-icon>
				</button>

				<button class="btn-action">
					<ion-icon name="bag-add-outline"></ion-icon>
				</button>

		  	</div>
        </div>

		<div class="showcase-content">

			<a href="#" class="showcase-category">${product.category}</a>
			<a href="#">
				<h3 class="showcase-title">${product.name}</h3>
			</a>
			<div class="rating-box">
				<div class="rating">
					<i data-star="${product.rating}"></i>
				</div>
			</div>

			<div class="price-box">
				<p class="price">$${product.price.toFixed(2)}</p>
				<del>$${product.originalPrice.toFixed(2)}</del>
			</div>
			<button class="btn-cart">Add to cart</button>
		<div>
		`;
		productGrid.appendChild(productItem);
		const cartBtn = productItem.querySelector(".btn-cart");
		cartBtn.addEventListener("click", (event) => {
			addToCart(product);
		});
	});
	return productGrid;
}

function addToCart(product) {
	if (product.stock === 0) {
		window.alert("Product is out of stock");
		return;
	}
	const cart = JSON.parse(localStorage.getItem("cart") || "[]");
	const existingProduct = cart.find((p) => p.bookId === product.bookId);
	if (existingProduct) {
		existingProduct.quantity++;
		existingProduct.total = existingProduct.quantity * existingProduct.price;
		existingProduct.stock--;
	} else {
		cart.push({
			bookId: product.bookId,
			name: product.name,
			images: product.image,
			price: product.price,
			stock: product.stock - 1,
			quantity: 1,
			total: product.price,
		});
	}
	localStorage.setItem("cart", JSON.stringify(cart));
	window.alert("Product added to cart");
	const countCart = document.querySelector(".count.count-cart");
	console.log(cart.length);
	let totalCart = 0;
	cart.forEach((item) => (totalCart = totalCart + item.quantity));
	countCart.innerHTML = totalCart;
}

// Login Handler
function loginHandler() {
	const loginModal = document.createElement("div");
	loginModal.classList.add("modal");
	loginModal.innerHTML = `
	<div class="modal-close-overlay" data-modal-overlay></div>
	<div class="modal-content">
		<button class="modal-close-btn" data-modal-close>
			<ion-icon name="close-outline"></ion-icon>
		</button>
		<div class="login-img">
			<img src="images/login.png" alt="logo" width="400" height="400"/>
		</div>
		<div class="login">
			<form action="#">
				
				<div class="login-header">
					<h3 class="login-title">Login</h3>
				</div>
				<input type="email" class="email-field" pattern="${emailPattern}" placeholder="Enter your email" required>
				<input type="password" class="password-field" placeholder="Enter your password" required>
				<div class = "btn-wrapper">
					<button type="submit" class="btn-login">Login</button>
					<button type="button" class="btn-reg">Register</button>
				</div>
			</form>
		</div>
	</div>
`;
	document.body.appendChild(loginModal);

	// Add event listener to close button
	const modalCloseBtn = loginModal.querySelector("[data-modal-close]");
	const modalCloseOverlay = loginModal.querySelector("[data-modal-overlay]");
	modalCloseBtn.addEventListener("click", () => {
		document.body.removeChild(loginModal);
	});
	modalCloseOverlay.addEventListener("click", () => {
		document.body.removeChild(loginModal);
	});

	// Add event listener to form submit
	const form = loginModal.querySelector("form");
	form.addEventListener("submit", (event) => {
		const email = form.querySelector(".email-field").value;
		const password = form.querySelector(".password-field").value;

		fetch("../data/users.json")
			.then((response) => response.json())
			.then((users) => {
				const user = users.users.find(
					(user) => user.email === email && user.password === password,
				);

				if (user) {
					localStorage.setItem("email", email);
					localStorage.setItem("password", password);
					document.body.removeChild(loginModal);
					window.location.reload();
				} else {
					if (!form.querySelector(".warning")) {
						event.preventDefault();
						const warning = document.createElement("p");
						warning.classList.add("warning");
						warning.textContent = "Invalid email or password";
						form.insertBefore(warning, form.querySelector(".email-field"));
					}
				}
			});
	});
	const regBtn = document.querySelector(".btn-reg");
	regBtn.addEventListener("click", () => {
		document.body.removeChild(loginModal);
	});
	regBtn.addEventListener("click", registerHandler);
}

// Logout Handler
function logoutHandler(event) {
	const loginBtnCheck = document.querySelector(".action-btn.login-btn");
	const email = localStorage.getItem("email");
	const password = localStorage.getItem("password");

	if (email && password) {
		loginBtnCheck.removeEventListener("click", loginHandler);
		loginBtnCheck.classList.remove("login-btn");
		loginBtnCheck.classList.add("logout-btn");
		const logoutButton = document.querySelector(".action-btn.logout-btn");
		logoutButton.innerHTML = `
		<p>Hi, ${email.split("@")[0]}</p>
		<ion-icon name="log-in-outline"></ion-icon>
		`;
		logoutButton.addEventListener("click", () => {
			// Clear local storage
			localStorage.clear();

			// Revert the button back to login button
			logoutButton.classList.remove("logout-btn");
			logoutButton.classList.add("login-btn");
			logoutButton.innerHTML = `
			<ion-icon name="person-circle-outline"></ion-icon>
            `;
			loginBtn.addEventListener("click", loginHandler);
		});
	}
}

// Register Handler
function registerHandler() {
	const registerModal = document.createElement("div");
	registerModal.classList.add("modal");
	registerModal.innerHTML = `
	<div class="modal-close-overlay" data-modal-overlay></div>
	<div class="modal-content">
		<button class="modal-close-btn" data-modal-close>
			<ion-icon name="close-outline"></ion-icon>
		</button>
		
		<div class="register">
			<form action="#">
				
				<div class="register-header">
					<h3 class="register-title">Register</h3>
				</div>
				<input type="email" class="email-field" pattern="${emailPattern}" placeholder="Enter your email" required>
				<input type="password" class="password-field" placeholder="Enter your password" required>
				<input type="password" class="password-field confirm-password-field" placeholder="Confirm password" required>
				<div class = "btn-wrapper">
					<button type="submit" class="btn-reg">Register</button>
					<button type="button" class="btn-login">Login</button>
				</div>
			</form>
		</div>

		<div class="register-img">
			<img src="images/register.png" alt="logo" width="400" height="400"/>
		</div>
	</div>
`;
	document.body.appendChild(registerModal);

	// Add event listener to close button
	const modalCloseBtn = registerModal.querySelector("[data-modal-close]");
	const modalCloseOverlay = registerModal.querySelector("[data-modal-overlay]");
	modalCloseBtn.addEventListener("click", () => {
		document.body.removeChild(registerModal);
	});
	modalCloseOverlay.addEventListener("click", () => {
		document.body.removeChild(registerModal);
	});

	const logBtn = document.querySelector(".btn-login");
	logBtn.addEventListener("click", () => {
		document.body.removeChild(registerModal);
	});
	logBtn.addEventListener("click", loginHandler);

	const form = registerModal.querySelector("form");
	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const email = form.querySelector(".email-field").value;
		const password = form.querySelector(".password-field").value;
		const confirmPassword = form.querySelector(".confirm-password-field").value;
		if (
			password !== confirmPassword ||
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
		) {
			event.preventDefault();
			if (form.querySelector(".warning")) {
				form.removeChild(form.querySelector(".warning"));
			}
			const warning = document.createElement("p");
			warning.classList.add("warning");
			if (password !== confirmPassword)
				warning.textContent = "Passwords do not match";
			if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password))
				warning.textContent =
					"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number";
			form.insertBefore(warning, form.querySelector(".email-field"));
		} else {
			localStorage.setItem("email", email);
			localStorage.setItem("password", password);
			document.body.removeChild(registerModal);
			window.location.reload();
		}
	});
}

function createPagination(totalItems, itemsPerPage) {
	const paginationWrapper = document.createElement("div");
	paginationWrapper.classList.add("pagination-wrapper");
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	let paginationHTML = "";

	if (totalPages < 5) {
		for (let i = 1; i <= totalPages; i++) {
			paginationHTML += `<button class="pagination-button"  data-page="${i}">${i}</button>`;
		}
	} else {
		for (let i = totalPages - 1; i <= totalPages; i++) {
			paginationHTML += `<button class="pagination-button"  data-page="${i}">${i}</button>`;
		}
	}
	// paginationHTML += `
	// <button class="pagination-button next" data-page="${
	// 	currentPage + 1
	// }">Next</button>
	// <button class="pagination-button prev" data-page="${
	// 	currentPage - 1
	// }">Previous</button>
	// `;
	paginationWrapper.innerHTML = paginationHTML;
	return paginationWrapper;
}
