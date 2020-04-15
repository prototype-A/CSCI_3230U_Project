window.onload = function() {
	// Delete user
	$('#deleteUserBtn').click(function() {
		if ($('#passwordConfirmation').is(':hidden')) {
			// Show confirmation
			$('#passwordConfirmation').show();
		} else {
			// Check entered password
			$('#passwordField').removeClass('is-danger');
			$('#errorMessage').text('');
			$('#deleteUserBtn').addClass('is-loading');
			$.post('/deleteUser', {
				password: $('#passwordField').val()
			}, function(res) {
				if (res.message) {
					// Failed to delete user
					$('#passwordField').addClass('is-danger');
					$('#errorMessage').text(res.message);
				} else if (res.redirect) {
					// Redirect
					window.location = res.redirect;
				}
				$('#deleteUserBtn').removeClass('is-loading');
			});
		}
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
}