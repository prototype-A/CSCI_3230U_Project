let numItems = 20;

$(document).ready(function() {
	// Search button
	$('#searchBtn').click(function() {
		search({ code: 'Enter' });
	});
	
	// Get items from server
	queryItems(numItems, '');
});

// Search bar search function
function search(e) {
	if ((e.code === 'Enter' || e.code === 'NumpadEnter')) {
		console.log('Searching for ' + $('#searchBar').val());
		if ($('#searchBar').val() !== '') {
			// Search for specific items
			queryItems(numItems, $('#searchBar').val())
		} else {
			// Empty search; get every item
			queryItems(numItems, '')
		}
	}
}

// Get items from server
function queryItems(numItemsToGet, searchTerm) {
	// Remove all current items
	$('#items').empty();
	
	// Get items
	$.post('/getItems', {
		amount: numItemsToGet,
		search: searchTerm
	}, function(res) {
		populateItems(res);
	});
}

// Create items on screen
function populateItems(items) {
	for (let i = 0; i < items.length; i++) {
		// Shipping cost text
		let itemShippingCost = (items[i].shippingPrice == 0) ? 'Free' : `$${items[i].shippingPrice.toFixed(2)}`;

		// Create a card for each item
		$('#items')
		.append($('<a>')
			.addClass('column')
			.addClass('is-one-fifth')
			.addClass('card')
			.append($('<div>')
				// Item image
				.addClass('card-image')
				.append($('<figure>')
					.addClass('image')
					.addClass('is-2by3')
					.append($('<img>')
						.attr('src', 'https://bulma.io/images/placeholders/320x480.png')
					)
				)
				.append($('<div>')
					.addClass('card-content')
					.append($('<div>')
						.addClass('content')
						.addClass('has-text-centered')
						.attr('id', `item${i}`)
						.append($('<div>')
							// Item name
							.addClass('title')
							.text(items[i].name)
						)
						.append($('<div>')
							// Item condition
							.addClass('item-condition')
							.text(`Condition: ${items[i].itemCondition}`)
						)
						.append($('<span>')
							// Item price
							.addClass('price')
							.text(`$${items[i].price.toFixed(2)}`)
						)
					)
				)
			)
		);
		if (!items[i].taxIncluded) {
			// Tax not included in item price
			$(`#item${i}`)
			.append($('<span>')
				// "plus tax"
				.addClass('tax')
				.text('+ tax')
			)
		}
		$(`#item${i}`)
		.append($('<div>')
			// Shipping price
			.addClass('price-small')
			.text(`${itemShippingCost} Shipping`)
		)
	}
}