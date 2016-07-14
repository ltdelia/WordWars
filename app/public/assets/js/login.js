// TO DO
//// Handle redirect to menu

// Registering a User
// Declaring variable for username. Will be used later.
var username;
console.log(username);

// Check if user is logged in with Firebase
firebase.auth().onAuthStateChanged(function(userOnline){
	// If someone is logged in, log the userOnline, and their email
	if(userOnline){
		console.log(userOnline);
		console.log("Success! " + userOnline.displayName + " is logged in!");
		window.location = "/menu";
		// When a user registers an account, they will input a username
		// Username will be grabbed when a user clicks Register in the Register Modal
		// If there is a username value, the user profile will be updated
		if(username == userOnline.displayName){
			// Do nothing
			console.log('User already exists as: ', username);
		}else if(username !== userOnline.displayName && username !== undefined){
			userOnline.updateProfile({
				displayName: username
			}).then(function(){
				console.log("Username is updated! Current username: " + username);

				window.location = "/menu";
			}, function(error){
				console.log("An error occurred. Username not updated.");
			})

		}
	// Otherwise, no one is signed in.
	}else{
		console.log("No one is signed in.");
	}
})	

// When the register button is clicked...
$('#register').on('click', function(){
	//Initialize the Register Modal
	$('#registerModal').modal('show');
});
// When the register button (within the register modal) is clicked...
$('#registerUser').on('click', function(){
	// Grab the values given for Username, Email Address, Password, Confirm Password
	username = $('#regName').val();
	var email = $('#regEmail').val();
	var password = $('#regPassword').val();
	var confirmPassword = $('#confirmPassword').val();
	// Declare a text variable. We will build on this later to display error messages to the HTML.
	var text = $('<p>');

	// Check if the password provided matched the confirmed password
	if(password == confirmPassword){
		// Check if the password length is 6 or greater. 
		// Firebase immediately throws an error if the password length is less than 6 characters.
		if(password.length < 6 ){
			// append the error message to the text variable, display to the HTML
			text.append('Please enter a password with 6 or more characters.');
			text.append('</p>');
			text.css('color', 'red');
			$('#errorMessage').html(text);
		}
		if(password.length >=6){
			// Create the user in Firebase with the provided credentials
			// If there are any errors, catch them and log to the console
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Here is your error: " + errorCode + " " + errorMessage);
			})
			// Clear the values, dismiss the modal
			$('#registerUser').attr('data-dismiss', 'modal');
			// $('#registerUser').attr('href', '/menu');
			$('#regName').val(null);
			$('#regEmail').val(null);
			$('#regPassword').val(null);
			$('#confirmPassword').val(null);
		}
	}else{
			// Display this error to the HTML if the passwords provided do not match.
			text.append('Your passwords do not match. Please try again.');
			text.append('</p>');
			text.css('color', 'red');
			$('#errorMessage').html(text);
	} 
})

// Log In an Existing User
// When the Log In button is clicked...
$('#login').on('click', function(){
	//Initialize the Log In modal
	$('#loginModal').modal('show');
})
// When the user logs in...
$('#loginUser').on('click', function(){
	// Grab the values given for Email Address and Password
	var email = $('#logEmail').val();
	var password = $('#logPassword').val();
	var text = $('<p>');
	// Authenticate with Firebase, catch any errors, display to the HTML
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Here is your error: " + errorCode + " " + errorMessage);

			text.append(errorMessage);
			text.append('</p>');
			text.css('color', 'red');
			$('#loginError').html(text);
	})
	$('#loginUser').attr('data-dismiss', 'modal');
	$('#logEmail').val(null);
	$('#logPassword').val(null);
})