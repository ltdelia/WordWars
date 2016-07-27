var currentUser;

firebase.auth().onAuthStateChanged(function(userOnline){
	if(userOnline){
		var user = firebase.auth().currentUser;
		console.log(user);
		var name, email;

		// If user is logged in...
		if(user != null){
			name = user.displayName;
			email = user.email;
			currentUser = user.displayName;
			var userProfileLink = $('<a>');
			userProfileLink.attr('href', 'profile/'+currentUser+'');
			userProfileLink.append('Welcome,'+currentUser+'!');
			userProfileLink.css('color', 'grey')
			userProfileLink.append('</a>');

			$('#currentUser').html(userProfileLink);
			// Display their credentials to the console
			console.log("Name: ", name);
			console.log("Email: ", email);
		}
	}else{
		console.log("No one is signed in.");
	}
})



// Click Event -- Sign Out the User
$('#logOut').on('click', function(){
	firebase.auth().signOut().then(function(){
		alert("Sign out successful.");
	}, function(error){
		//An error occurred
		console.log("An error occurred signing out.");
	})
})