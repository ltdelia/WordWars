// Logic for the Menu page
// 1a. Create a Room
// Each room has the room name, an id, and the users in it
// 1b. Join a Room
// When a user joins a room, Firebase runs an update() method to update user2
// 2. Chat with Users Online
// When a user types something in and submits, their username and message will appear in the div

// We declare a currentUser variable
var currentUser;
var selectedRoomID;

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
			$('#currentUser').html('Welcome, '+currentUser+"! ");
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
function printRooms(room, roomID, userInside){
	// Dynamically create a table row
	var row = $('<tr>');
		// Add the room name as an ID
		row.attr('id', room);
		// Add the room ID as a data-roomid
		row.attr('data-roomid', roomID);
		// Display the room name and user inside in the row
		row.append('<td>'+room+'</td>');
		row.append('<td>'+userInside+'</td>');
		row.append('</tr>');
		$('.table').append(row);

		// When the row with a particular room ID is clicked...
		$('tr[data-roomid='+roomID+']').on('click', function(){
			// Add/remove the class 'active' to the row
			$('tr[data-roomid='+roomID+']').toggleClass('active');
			// Add/remove the class 'disabled' to the 'Join Room' button
			$('#joinButton').toggleClass('disabled');

			// Passing the room-ID to the joinButton
			$('#joinButton').attr('data-roomid', roomID);

			selectedRoomID = roomID;

			console.log("Room ID in the row: ", selectedRoomID);
		});

	// Click Event to Join a Room 
	// Update user2 with the current user
	$('#joinButton').on('click', function(){
		// Declare an object with property user2, value is the currentUser
		var userTwo = {user2: {name: currentUser, wordAttack: ""}};

		// Get the ref to Firebase. 
		// We've structured our schema like so:
		// rooms
		//	roomID
		//		user2
		// To get there, we can't just reference the rooms node
		// We have to reference the EXACT level above the value we want updated
		// hence, 'rooms/roomID'
		var referenceName = "/rooms/"+selectedRoomID+"/";
		console.log(referenceName);
		var roomRef = firebase.database().ref(referenceName);
		// console.log("Room Reference in Firebase: ", roomRef);
		// console.log("Room ID when Join Button clicked: ", selectedRoomID);
		// We need to access the data for that specific room node
		roomRef.once('value')
			.then(function(snapshot){
				// The entire room object
				var roomData = snapshot.val();
				// console.log(roomData);
				// User 1 and user 2 currently in the room node
				var user1 = roomData.user1;
				var user2 = roomData.user2;
				// console.log("User One: ", user1);
				// console.log("User Two: ", user2);
				// If the current user is user 1 in the room...
				if(user1.name == currentUser){
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
				}else if(user1.name !== currentUser){
					// Call Firebase.update(), passing in the userTwo object
					// Update the specific room node with the current user, as user 2
					roomRef.update(userTwo);
				}
			})
	})
}

// printChat() -- prints out the messages posted by users
function printChat(username, message, counter){
	// Dynamically creates a new message
	var text = $('<p>');
	text.attr('id', 'chat-'+counter);
	text.append('<strong>'+ username + '</strong>: '+ message);
	text.append('</p>');
	// Prints the message to the HTML
	$('#chatLog').append(text);
	// Animation causes the auto focus to the latest message
	$('#chatLog').animate({scrollTop: $('#chatLog').prop("scrollHeight")}, 500);
}

function createRoom(){
	// Grab the value of the input
	var room = $('#roomname').val();

	// Get a reference to Firebase, specifically the roomList.
	var newRoomRef = roomListRef.push();
	// The key for the pushed ref to the 'rooms' ref. We will use this as the room ID
	var roomID = newRoomRef.key;

	// Push the roomID, user1, user2, and room name to the 'rooms' ref in Firebase
	newRoomRef.set({'ready': 0, 'room': room, 'roomID': roomID, 'user1': {name: currentUser, wordAttack: ""}, 'user2': {name: "", wordAttack: ""}, 'words': "" });

	// Clear the value of the input
	$('#roomname').val(null);
}

// CLICK EVENTS & KEYUP EVENTS

// Click Event for "Create a Room" -- opens a modal
$('#createOpen').on('click', function(){
	//Initialize the Modal
	$('#myModal').modal('show');
	setTimeout(function(){$('#roomname').focus();
		$("#roomname").keyup(function(event){
			if(event.keyCode==13){
				$('#createRoom').click();
			}
		})
	},500);
});

// Click Event for the 'Create' button inside of the modal
$('#createRoom').on('click', function(){
	createRoom();
	$('#createOpen').remove();
});

// Submitting the Chat -- 2 options for the user
// 1. Users can submit the chat by pressing enter
$('#message').keyup(function(event){
	if(event.keyCode == 13){
		var message = $('#message').val();
		var newMessageRef = chatRef.push();
		newMessageRef.set({'username': currentUser, 'message': message});
		$('#message').val(null);		
	}
});

// 2. Users can submit the chat by clicking 'Submit'
$('#chatSubmit').on('click', function(){
	var message = $('#message').val();
	var newMessageRef = chatRef.push();
	newMessageRef.set({'username': currentUser, 'message': message});
	$('#message').val(null);		
});


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
	var room = roomData.room;
	var roomID = roomData.roomID;
	var user1 = roomData.user1.name;
	var user2 = roomData.user2.name;
	if(user2 == ""){
		printRooms(room, roomID, user1);		
	}
})	

roomListRef.on('child_changed', function(childSnapshot){
	var roomData = childSnapshot.val();
	console.log("Room Updated!");
	console.log("This was changed: ", roomData);
	var room = roomData.room;
	var roomID = roomData.roomID;
	var user1 = roomData.user1.name;
	var user2 = roomData.user2.name;	

	if(user1 == currentUser){
		window.location = "/game"+roomID;
	}

	if(user2 == currentUser){
		window.location = "/game"+roomID;
	}
	
	// If we have a second user, we don't want to print the room
	// We will remove any rooms from the DOM where a second user has joined
	if(user2){
		$('tr[data-roomid='+roomID+']').remove();
	}
})
var chatCounter = 0;
// Getting the entire chat ref, limiting to last ten messages
chatRef.limitToLast(10).on('child_added', function(childSnapshot){
	var chatData = childSnapshot.val();
	chatCounter++;
	var username = chatData.username;
	var message = chatData.message;
	printChat(username, message, chatCounter);
})