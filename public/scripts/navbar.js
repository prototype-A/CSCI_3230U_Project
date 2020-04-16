$(document).ready(function() {
	// Select CAD
	$('#cadSelector').click(function() {
		$.post('/changeCurrency', {
			currency: 'CAD'
		});
		$('#currentCurrencyText').text('CAD');
		$('#currentCurrencyIcon').removeClass('fa-euro-sign fa-pound-sign');
		$('#currentCurrencyIcon').addClass('fa-dollar-sign');
	});
	
	// Select USD
	$('#usdSelector').click(function() {
		$.post('/changeCurrency', {
			currency: 'USD'
		});
		$('#currentCurrencyText').text('USD');
		$('#currentCurrencyIcon').removeClass('fa-euro-sign fa-pound-sign');
		$('#currentCurrencyIcon').addClass('fa-dollar-sign');
	});
	
	// Select EUR
	$('#eurSelector').click(function() {
		$.post('/changeCurrency', {
			currency: 'EUR'
		});
		$('#currentCurrencyText').text('EUR');
		$('#currentCurrencyIcon').removeClass('fa-dollar-sign fa-pound-sign');
		$('#currentCurrencyIcon').addClass('fa-euro-sign');
	});
	
	// Select GBP
	$('#gbpSelector').click(function() {
		$.post('/changeCurrency', {
			currency: 'GBP'
		});
		$('#currentCurrencyText').text('GBP');
		$('#currentCurrencyIcon').removeClass('fa-euro-sign fa-dollar-sign');
		$('#currentCurrencyIcon').addClass('fa-pound-sign');
	});
});