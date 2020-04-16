window.onload = function() {
	// Check if username exists when textbox loses focus
	$('#usernameField').focusout(function() {
		$.post('/register', {
			username: $('#usernameField').val()
		}, function(res) {
			if (res.usernameResult === 'rejected') {
				// Username exists
				usernameRejected(res.usernameErrorMessage);
			} else {
				// Username available
				usernameAccepted();
			}
		});
	});
	
	// Validate password when textbox loses focus
	$('#passwordField').focusout(function() {
		$.post('/register', {
			password: $('#passwordField').val()
		}, function(res) {
			if (res.passwordResult === 'rejected') {
				// Password does not meet requirements
				passwordRejected(res.passwordErrorMessage);
			} else {
				// Password meets requirements
				passwordAccepted();
			}
		});
	});
	
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
	$('#registrationForm').submit(function(event) {
		// Prevent redirect on submit
		event.preventDefault();
		
		$('#registerBtn').addClass('is-loading');
		$('#usernameErrorMessage').text('');
		$('#usernameField').removeClass('is-danger');
		$('#passwordErrorMessage').text('');
		$('#passwordField').removeClass('is-danger');
		
		// Send form data to server for validation
		$.post('/register', {
			username: $('#usernameField').val(),
			password: $('#passwordField').val()
		}, function(res) {
			if (res.usernameResult === 'rejected' || res.passwordResult === 'rejected') {
				// Show username error
				if (res.usernameResult === 'rejected') {
					usernameRejected(res.usernameErrorMessage);
				}
				// Show password error
				if (res.passwordResult === 'rejected') {
					passwordRejected(res.passwordErrorMessage);
				}
			} else if (res.redirect) {
				// Username and password accepted; redirect to homepage
				window.location = res.redirect;
			}
			$('#registerBtn').removeClass('is-loading');
		});
	});
}

function usernameRejected(errorMessage) {
	$('#usernameErrorMessage').text(errorMessage);
	$('#usernameField').addClass('is-danger');
}

function passwordRejected(errorMessage) {
	$('#passwordErrorMessage').text(errorMessage);
	$('#passwordField').addClass('is-danger');
}

function usernameAccepted() {
	$('#usernameErrorMessage').text('');
	$('#usernameField').removeClass('is-danger');
	$('#usernameField').addClass('is-success');
}

function passwordAccepted() {
	$('#passwordErrorMessage').text('');
	$('#passwordField').removeClass('is-danger');
}