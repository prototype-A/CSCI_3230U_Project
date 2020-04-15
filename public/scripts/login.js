window.onload = function() {
	// Show/hide plaintext password button
	$('#showPasswordBtn').click(function() {
		if ($('#passwordField').attr('type') === 'password') {
			$('#passwordField').attr('type', 'text');
			$('#showPasswordBtn').text('Hide');
		} else {
			$('#passwordField').attr('type', 'password');
			$('#showPasswordBtn').text('Show');
		}
	});
	
	// Submit form
	$('#loginForm').submit(function(event) {
		// Prevent redirect on submit
		event.preventDefault();
		
		$('#loginBtn').addClass('is-loading');
		$('#errorMessage').text('');
		
		// Send form data to server for validation
		$.post('/login', {
			username: $('#usernameField').val(),
			password: $('#passwordField').val()
		}, function(res) {
			console.log(res);
			if (res.errorMessage) {
				// Show login error message
				$('#errorMessage').text(res.errorMessage);
			} else if (res.redirect) {
				// Redirect
				window.location = res.redirect;
			}
			$('#loginBtn').removeClass('is-loading');
		});
	});
}