// Registering a User
// When the register button is clicked...
$('#register').on('click', function(){
	//Initialize the Modal
	$('#registerModal').modal('show');
});
// When the register button (within the modal) is clicked...
$('#registerUser').on('click', function(){
	// Grab the values given for Email Address, Password, Confirm Password
	var email = $('#regEmail').val();
	var password = $('#regPassword').val();
	var confirmPassword = $('#confirmPassword').val();
	// Declare a text variable. We will build on this later to display error messages to the HTML.
	var text = $('<p>');

	// Check if the password provided matched the confirmed password
	if(password == confirmPassword){
		// Check if the password length is 6 or greater
		if(password.length < 6 ){
			// append the error message to the text variable, display to the HTML
			text.append('Please enter a password with 6 or more characters.');
			text.append('</p>');
			text.css('color', 'red');
			$('#errorMessage').html(text);
		}
		if(password.length >=6){
			// Clear the values, dismiss the modal
			$('#registerUser').attr('data-dismiss', 'modal');
			$('#regEmail').val(null);
			$('#regPassword').val(null);
			$('#confirmPassword').val(null);
		}
		// Create the user in Firebase with the provided credentials
		// If there are any errors, catch them and log to the console
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Here is your error: " + errorCode + " " + errorMessage);
		})
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
	//Initialize the modal
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

	// Check if user is logged in with Firebase
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			console.log("Success! " + user.email + " is logged in!");
			$('#loginUser').attr('data-dismiss', 'modal');
			$('#logEmail').val(null);
			$('#logPassword').val(null);

		}else{
			console.log("No one is signed in.");
		}
	})
})

var user = firebase.auth().currentUser;
var email, uid;
if(user != null){
	email = user.email;
	uid = user.uid;
	console.log("Here are the credentials: " + "Email: " + email + " ID: " + uid );
}
