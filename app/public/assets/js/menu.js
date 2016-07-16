// Logic for the Menu page
// 1a. Create a Room
// Each room has the room name, an id, and the users in it
// 1b. Join a Room
// When a user joins a room, Firebase runs an update() method to update user2
// 2. Chat with Users Online
// When a user types something in and submits, their username and message will appear in the div

// We declare a currentUser variable
var currentUser;

// Firebase Auth
// Check if a user is logged in with Firebase
firebase.auth().onAuthStateChanged(function(userOnline){
	if(userOnline){
		var user = firebase.auth().currentUser;
		console.log("User Online: ", user);
		var name, email;

		// If user is logged in...
		if(user != null){
			name = user.displayName;
			email = user.email;
			// Set currentUser to match the displayName stored in the logged in profile
			currentUser = user.displayName;
			// Display their credentials to the console
			console.log("Name: ", name);
			console.log("Email: ", email);
		}
	}else{
		console.log("No one is signed in.");
		// Redirect to the login page
		window.location = "/";
	}
})

// printRooms() - prints all rooms in Firebase to the HTML
function printRooms(room, roomID){
	// Dynamically create a well
	var well = $('<div>');
		well.attr('id, room');
		well.attr('class', 'well clearfix');
		well.append('<p>');
		well.append(room);
		well.append('</p>');
	// Create a Join button, dynamically, append it to the well
	var wellButton = $('<a>');
		wellButton.attr('class', 'btn btn-default pull-right');
		// Give the button the respective roomID from Firebase as its ID
		wellButton.attr('id', roomID);
		wellButton.append('Join');
		wellButton.append('</a>');
	// Append the button to the well
		well.append(wellButton);
		well.append('</div>');
	// Append the well to the panel
	$('#currentRooms').append(well);
	// Click Event to Join a Room -- using the roomID as the ID selector
	// Update user2 with the current user
	$('#'+roomID).on('click', function(){
		// Declare an object with property user2, value is the currentUser
		var userTwo = {user2: currentUser};
		// Get the ref to Firebase. 
		// We've structured our schema like so:
		// rooms
		//	roomID
		//		user2
		// To get there, we can't just reference the rooms node
		// We have to reference the EXACT level above the value we want updated
		// hence, 'rooms/roomID'
		var roomRef = firebase.database().ref('rooms/'+roomID);

		// We need to access the data for that specific room node
		roomRef.once('value')
			.then(function(snapshot){
				// The entire room object
				var roomData = snapshot.val();
				console.log(roomData);
				// User 1 and user 2 currently in the room node
				var user1 = roomData.user1;
				var user2 = roomData.user2;
				console.log("User One: ", user1);
				console.log("User Two: ", user2);
				// If the current user is user 1 in the room...
				if(user1 == currentUser){
					// Log the following error to the console.
					console.log('Error. You can\'t join a room you\'ve already joined.');
					// Display the error to the HTML in a modal.
					var text = $('<p>');
					text.append('You can\'t join a room you\'ve created. Please try joining another room.');
					text.append('</p>');
					text.css('color', 'red');
					text.addClass('text-center');
					$('#errorMessage').html(text);
					$('#errorModal').modal('show');
				// Otherwise, if the current user isn't already in the room...
				}else if(user1 !== currentUser){
					// Call Firebase.update(), passing in the userTwo object
					// Update the specific room node with the current user, as user 2
					roomRef.update(userTwo);
					console.log("Room Updated!");
					// Redirect to the game page
					// window.location = "/game";
				}
			})
	})
}

// printChat() -- prints out the messages posted by users
function printChat(username, message){
	var text = $('<p>');
	text.append('<strong>'+ username + '</strong>: '+ message);
	text.append('</p>');
	$('#chatLog').append(text);
}

function createRoom(){
	// Grab the value of the input
	var room = $('#roomname').val();

	// Get a reference to Firebase, specifically the roomList.
	var newRoomRef = roomListRef.push();
	// The key for the pushed ref to the 'rooms' ref. We will use this as the room ID
	var roomID = newRoomRef.key;

	// Push the roomID, user1, user2, and room name to the 'rooms' ref in Firebase
	newRoomRef.set({'roomID': roomID, 'user1': currentUser, 'user2': "", 'room': room});

	// Clear the value of the input
	$('#roomname').val(null);
}

// CLICK EVENTS

// Click Event for "Create a Room" -- opens a modal
$('#createOpen').on('click', function(){
	//Initialize the Modal
	$('#myModal').modal('show');
});

// Click Event for the 'Create' button inside of the modal
$('#createRoom').on('click', function(){
	createRoom();
});

// Click Event -- Submit the Chat
$('#chatSubmit').on('click', function(){
	var message = $('#message').val();
	var newMessageRef = chatRef.push();
	newMessageRef.set({'username': currentUser, 'message': message});
	$('#message').val(null);
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


// Firebase Realtime Database References
// The reference to our room list on Firebase
var roomListRef = firebase.database().ref('rooms');
// The reference to our chat
var chatRef = firebase.database().ref('chat');

// Getting the values from our room list
roomListRef.on('child_added', function(childSnapshot){
	var roomData = childSnapshot.val();
	// console.log(roomData);
	var room = roomData.room;
	var roomID = roomData.roomID;
	var user1 = roomData.user1;
	var user2 = roomData.user2;
	if(user2 == ""){
		printRooms(room, roomID);		
	}
})

roomListRef.on('child_changed', function(childSnapshot){
	var roomData = childSnapshot.val();
	console.log("This was changed: ", roomData);
	
})

// Getting the entire chat
chatRef.on('child_added', function(childSnapshot){
	var chatData = childSnapshot.val();
	var username = chatData.username;
	var message = chatData.message;
	printChat(username, message);
})