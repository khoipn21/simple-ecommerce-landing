fetch("../data/books.json")
	.then((response) => response.json())
	.then((products) => {
		const sortedBySold = [...products].sort((a, b) => b.sold - a.sold);
		console.log(sortedBySold);
		const sortedByRating = [...products].sort((a, b) => b.rating - a.rating);

		const bestSellers = sortedBySold.slice(0, 5);
		const mostEndorsed = sortedByRating.slice(0, 5);

		const staffPicks = [];
		for (let i = 0; i < 5; i++) {
			const randomIndex = Math.floor(Math.random() * products.length);
			staffPicks.push(products[randomIndex]);
		}

		return fetch("../data/productsShowcase.json")
			.then((response) => response.json())
			.then((showcase) => {
				showcase[0].products = mostEndorsed;
				showcase[1].products = bestSellers;
				showcase[2].products = staffPicks;
				console.log(showcase);
			})
			.catch((error) => console.error("Error:", error));
	});
