// Login Page
// The login page handles the following situations:
// - Registering a user
// - Logging in a User
// - Catching any errors and displaying them to the HTML for both cases
// - Redirecting to the menu page ('/menu')

// Registering a User
// Declaring variable for username. Will be set when a user is registered, and updated when logged in.
var username;
console.log(username);

// firebase.auth().onAuthStateChanged()
// This method is executed whenever the user successfully registers their account, or logs in.
// The method checks if a user is logged in with Firebase
firebase.auth().onAuthStateChanged(function(userOnline){
	// If someone is logged in, log the userOnline
	if(userOnline){
		console.log(userOnline);
		console.log("Success! " + userOnline.displayName + " is logged in!");
		// So long as a user has a username...
		if(userOnline.displayName !== null){
			// Redirect to the menu page
			window.location = "/menu";			
		}
		// When a user registers an account, they will input a username
		// Username will be grabbed when a user clicks Register in the Register Modal
		// If there is a username value, the user profile will be updated
		if(username == userOnline.displayName){
			// Do nothing
			console.log('User already exists as: ', username);
		}else if(username !== userOnline.displayName && username !== undefined){
			// Run the updateProfile() method, updating the user's displayName
			userOnline.updateProfile({
				displayName: username
			}).then(function(){
				// Log the update to the console
				console.log("Username is updated! Current username: " + username);
				// Redirect to the menu page
				window.location = "/menu";
			}, function(error){
				// Log the message below to the console
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

//somehow managed to already do all this elsewhere in the code --zintis :(
// $(document).keyup(function(event){
// 	console.log('start');
// 	console.log(event.keycode);
// 	if(event.keycode == 13){
// 		console.log('pushed enter');
// 		if($('#registerModal').data('bs.modal') == null){
// 			console.log("closed!")
// 		}else if($('#loginModal').data('bs.modal') == null){
// 			console.log("closed!2")
// 		}
// 	}
// });

// When the register button (within the register modal) is clicked...
$('#registerUser').on('click', function(){
	// Grab the values given for Username, Email Address, Password, Confirm Password
	username = $('#regName').val();
	var email = $('#regEmail').val();
	var password = $('#regPassword').val();
	var confirmPassword = $('#confirmPassword').val();
	console.log(username, email, password, confirmPassword);

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
		// Check if the user has entered a username
		if(password.length >=6 && username){
			// Create the user in Firebase with the provided credentials
			// If there are any unspecified errors, catch them and log to the console
			// Common error seen: E-mail not entered/badly formatted
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
				// If there are any other unspecified errors...
				if(error){
					// Find the error code and error message given by Firebase
					var errorCode = error.code;
					var errorMessage = error.message;
					// console.log("Here is your error: " + errorCode + " " + errorMessage);
					// Display the error to the HTML inside of the register modal
					text.append(errorMessage);
					text.append('</p>');
					text.css('color', 'red');
					$('#errorMessage').html(text);						
				}else{
					// Dismiss the modal
					$('#registerUser').attr('data-dismiss', 'modal');
				}
			})
			// Clear the values of the modal
			$('#regName').val(null);
			$('#regEmail').val(null);
			$('#regPassword').val(null);
			$('#confirmPassword').val(null);
		}else{
			// Display this error to the HTML if there is no username provided.
			text.append('Please enter a username for your account.');
			text.append('</p>');
			text.css('color', 'red');
			$('#errorMessage').html(text);
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
		// If there is an error...
		if(error){
			// Grab the error code and message provided from Firebase
			// Display it to the HTML
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Here is your error: " + errorCode + " " + errorMessage);

			text.append(errorMessage);
			text.append('</p>');
			text.css('color', 'red');
			$('#loginError').html(text);				
		}else{
			// Dismiss the modal
			$('#loginUser').attr('data-dismiss', 'modal');
		}
	})
	// Clear the values
	$('#logEmail').val(null);
	$('#logPassword').val(null);
})

//////////////////////////////////////////////////////////////////////////
//this section can be rewritten using a function prototype I think, and then get called many times with different parameters instead of being rewritten over and over
//sample:

	// function enterKey(a, b, c, d, e){
	// 	$("#" + a).keyup(function(event){
	// 		console.log('enter1');
	// 	    if(event.keyCode == 13 && $("#" + b).val() != "" && $("#" + c).val() != ""){
	// 	    	$("#"+d).click();
	// 	    	console.log('click');
	// 	    }
	// 	});
	// }

$("#logEmail").keyup(function(event){
	console.log('enter1');
    if(event.keyCode == 13 && $("#logEmail").val() != "" && $("#logPassword").val() != ""){
    	$("#loginUser").click();
    	console.log('click');
    }
});

$("#logPassword").keyup(function(event){
	console.log('enter1');
    if(event.keyCode == 13 && $("#logEmail").val() != "" && $("#logPassword").val() != ""){
    	$("#loginUser").click();
    	console.log('click');
    }
});

$("#regName").keyup(function(event){
	console.log('enter1');
    if(event.keyCode == 13 && $("#regName").val() != "" && $("#regEmail").val() != "" && $("#regPassword").val() != "" && $("#confirmPassword").val() != ""){
    	$("#registerUser").click();
    	console.log('click');
    }
});

$("#regEmail").keyup(function(event){
	console.log('enter1');
    if(event.keyCode == 13 && $("#regName").val() != "" && $("#regEmail").val() != "" && $("#regPassword").val() != "" && $("#confirmPassword").val() != ""){
    	$("#registerUser").click();
    	console.log('click');
    }
});

$("#regPassword").keyup(function(event){
	console.log('enter1');
    if(event.keyCode == 13 && $("#regName").val() != "" && $("#regEmail").val() != "" && $("#regPassword").val() != "" && $("#confirmPassword").val() != ""){
    	$("#registerUser").click();
    	console.log('click');
    }
});

$("#confirmPassword").keyup(function(event){
	console.log('enter1');
    if(event.keyCode == 13 && $("#regName").val() != "" && $("#regEmail").val() != "" && $("#regPassword").val() != "" && $("#confirmPassword").val() != ""){
    	$("#registerUser").click();
    	console.log('click');
    }
});