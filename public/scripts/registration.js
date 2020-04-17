window.onload = function() {
	// Check if username exists when textbox loses focus
	$('#usernameField').focusout(function() {
		$.post('/register', {
			username: $('#usernameField').val()
		}, function(res) {
			if (res.usernameResult === 'accepted') {
				// Username available
				usernameAccepted();
			} else {
				// Username exists
				usernameRejected(res.usernameErrorMessage);
			}
		});
	});
	
	// Validate password when textbox loses focus
	$('#passwordField').focusout(function() {
		$.post('/register', {
			password: $('#passwordField').val()
		}, function(res) {
			if (res.passwordResult === 'accepted') {
				// Password meets requirements
				passwordAccepted();
			} else {
				// Password does not meet requirements
				passwordRejected(res.passwordErrorMessage);
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
	
	// Terms and conditions modal
	$('#termsAndConditionsTrigger').click(function() {
		$('#termsAndConditionsModal').show();
	});
	$('#modalBackground').click(function() {
		$('#termsAndConditionsModal').hide();
	});
	$('#closeTermsAndConditionsModal').click(function() {
		$('#termsAndConditionsModal').hide();
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
		$('#termsAndConditionsErrorMessage').text();
		
		// Send form data to server for validation
		$.post('/register', {
			username: $('#usernameField').val(),
			password: $('#passwordField').val(),
			termsAccepted: $('#termsAndConditionsCheckbox[type=checkbox]').is(':checked')
		}, function(res) {
			if (res.usernameResult === 'rejected' || res.passwordResult === 'rejected' || (typeof res.termsAccepted !== 'undefined' && !res.termsAccepted)) {
				// Show username error
				if (res.usernameResult === 'rejected') {
					usernameRejected(res.usernameErrorMessage);
				}
				// Show password error
				if (res.passwordResult === 'rejected') {
					passwordRejected(res.passwordErrorMessage);
				}
				// Show terms and conditions error
				$('#termsAndConditionsErrorMessage').text(res.termsErrorMessage);
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