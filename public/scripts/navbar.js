let currentCurrency = 'CAD';
let currentRate = 1;

$(document).ready(function() {
	
	// Select CAD
	$('#cadSelector').click(function() {
		$.post('/changeCurrency', {
			currentRate: currentRate,
			currency: 'CAD'
		}, function(res) {
			updatePrices(res.oldRate, res.newRate, 'CAD', '$');
		});
		$('#currentCurrencyText').text('CAD');
		$('#currentCurrencyIcon').removeClass('fa-euro-sign fa-pound-sign fa-yen-sign');
		$('#currentCurrencyIcon').addClass('fa-dollar-sign');
	});
	
	// Select EUR
	$('#eurSelector').click(function() {
		$.post('/changeCurrency', {
			currentRate: currentRate,
			currency: 'EUR'
		}, function(res) {
			updatePrices(res.oldRate, res.newRate, 'EUR', '€');
		});
		$('#currentCurrencyText').text('EUR');
		$('#currentCurrencyIcon').removeClass('fa-dollar-sign fa-pound-sign fa-yen-sign');
		$('#currentCurrencyIcon').addClass('fa-euro-sign');
	});
	
	// Select GBP
	$('#gbpSelector').click(function() {
		$.post('/changeCurrency', {
			currentRate: currentRate,
			currency: 'GBP'
		}, function(res) {
			updatePrices(res.oldRate, res.newRate, 'GBP', '£');
		});
		$('#currentCurrencyText').text('GBP');
		$('#currentCurrencyIcon').removeClass('fa-euro-sign fa-dollar-sign fa-yen-sign');
		$('#currentCurrencyIcon').addClass('fa-pound-sign');
	});
	
	// Select JPY
	$('#jpySelector').click(function() {
		$.post('/changeCurrency', {
			currentRate: currentRate,
			currency: 'JPY'
		}, function(res) {
			updatePrices(res.oldRate, res.newRate, 'JPY', '¥');
		});
		$('#currentCurrencyText').text('JPY');
		$('#currentCurrencyIcon').removeClass('fa-euro-sign fa-pound-sign fa-dollar-sign');
		$('#currentCurrencyIcon').addClass('fa-yen-sign');
	});
	
	// Select USD
	$('#usdSelector').click(function() {
		$.post('/changeCurrency', {
			currentRate: currentRate,
			currency: 'USD'
		}, function(res) {
			updatePrices(res.oldRate, res.newRate, 'USD', '$');
		});
		$('#currentCurrencyText').text('USD');
		$('#currentCurrencyIcon').removeClass('fa-euro-sign fa-pound-sign fa-yen-sign');
		$('#currentCurrencyIcon').addClass('fa-dollar-sign');
	});
});

// Update prices in body
function updatePrices(oldRate, newRate, newCurrency, newCurrencySymbol) {
	if (oldRate != newRate && newCurrency != currentCurrency) {
		if (typeof items !== 'undefined') {
			for (let i = 0; i < items.length; i++) {
				// Price
				items[i].price = items[i].price / oldRate * newRate;
				
				// Shipping cost
				items[i].shippingCost = items[i].shippingCost / oldRate * newRate;
			}
			currentCurrency = newCurrency;
			currentRate = newRate;
			
			// In other script
			currencySymbol = newCurrencySymbol;
			repopulateItems(items);
		}
	}
}