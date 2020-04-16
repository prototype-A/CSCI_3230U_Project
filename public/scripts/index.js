let numItems = 20;
let allItemsRegex = '.*';
let items;

$(document).ready(function() {
	// Get items from server
	queryItems(numItems, allItemsRegex);
	
	// Search button
	$('#searchBtn').click(function() {
		search({ code: 'Enter' });
	});
	
	// Close item modal
	$('#closeItemModal').click(function() {
		closeModal($('#itemModal'));
	});
	$('#itemModalBackground').click(function() {
		closeModal($('#itemModal'));
	});
	
	// Item modal quantity input
	$('#itemModalQuantityInput').on('input', function() {
		let maxAmount = items[$(this).attr('item')].stockCount;
		if ($('#itemModalQuantityInput').val() > maxAmount) {
			$('#itemModalQuantityInput').val(maxAmount);
		}
		if ($('#itemModalQuantityInput').val() < 1) {
			$('#itemModalQuantityInput').val(1);
		}
	});
	
	// 'Add to cart' button
	$('#addToCartBtn').click(function() {
		//TODO: Add item to cart
		closeModal($('#itemModal'));
	});
	
	// Sort items by name alphabetically
	$('#sortByNameAscending').click(function() {
		if ($('#sortByNameAscending[name="sortByName"]').val()) {
			// Sort A-Z
			sortByName(items, true);
			repopulateItems(items);
		}
	});
	$('#sortByNameDescending').click(function() {
		if ($('#sortByNameDescending[name="sortByName"]').val()) {
			// Sort Z-A
			sortByName(items, false);
			repopulateItems(items);
		}
	});
});

// Search bar search function
function search(e) {
	if ((e.code === 'Enter' || e.code === 'NumpadEnter')) {
		if ($('#searchBar').val() !== '') {
			// Search for specific items
			queryItems(numItems, `.*${$('#searchBar').val().toLowerCase()}*`)
		} else {
			// Empty search; get every item
			queryItems(numItems, allItemsRegex)
		}
	}
}

// Closes item modal
function closeModal(modal) {
	modal.removeClass('is-active');
}

// Get items from server
function queryItems(numItemsToGet, searchTerm) {
	// Remove all current items
	$('#items').empty();
	
	// Get items
	$.post('/getItems', {
		amount: numItemsToGet,
		keyword: searchTerm
	}, function(res) {
		items = res;
		sortByName(items, true);
		populateItems(items);
	});
}

// Sorting
function sortByName(items, ascending) {
	items.sort(function(item1, item2) {
		return sortItemsByString(item1.name, item2.name, ascending);
	});
}
function sortItemsByString(item1, item2, ascending) {
	let a = item1;
	let b = item2;
	
	if (ascending) {
		return (a < b) ? -1 : (a > b) ? 1 : 0;
	}
	
	return (a < b) ? 1 : (a > b) ? -1 : 0;
}

// Create items on screen
function populateItems(items) {
	for (let i = 0; i < items.length; i++) {
		// Shipping cost text
		let itemShippingCost = (items[i].shippingPrice == 0) ? 'Free' : `$${items[i].shippingPrice.toFixed(2)}`;
		
		// Create a card for each item
		$('#items')
		.append($('<a>')
			.attr('id', `${i}`)
			.addClass('column')
			.addClass('is-3')
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
						.attr('id', `item${i}`)
						.addClass('content')
						.addClass('has-text-centered')
						.append($('<div>')
							// Item name
							.addClass('title')
							.text(items[i].name)
						)
						.append($('<div>')
							// Item in stock
							.addClass('item-stock')
							.text((items[i].stockCount > 0) ? 'In Stock' : 'Out of Stock')
						)
						.append($('<span>')
							// Item price
							.addClass('price')
							.text(`$${items[i].price.toFixed(2)}`)
						)
					)
				)
			).click(function() {
				// Show item info (modal)
				let item = items[parseInt($(this).attr('id'), 10)];
				$('#itemModal').addClass('is-active');
				$('#itemModalItemName').text(item.name);
				$('#itemModalItemDesc').text(item.description);
				$('#itemModalItemCondition').text(`Condition: ${item.itemCondition}`);
				$('#itemModalItemStock').text((item.stockCount > 0) ? 'In Stock' : 'Out of Stock');
				$('#itemModalQuantityLeftIndicator').text(`/ ${item.stockCount}`);
				$('#itemModalQuantityInput').attr('item', $(this).attr('id'));
				$('#itemModalQuantityInput').val(1);
				
				 // Item out of stock
				if (item.stockCount == 0) {
					// Disable 'Add to cart' button
					$('#addToCartBtn').attr('disabled', true);
					
					// Hide item quantity input
					$('#itemModalQuantity').hide();
				} else {
					// Enable 'Add to cart' button
					$('#addToCartBtn').removeAttr('disabled');
					
					// Show item quantity input
					$('#itemModalQuantity').show();
				}
			})
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
function repopulateItems(items) {
	$('#items').empty();
	populateItems(items);
}