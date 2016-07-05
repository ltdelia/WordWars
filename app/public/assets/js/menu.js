// Logic for the Menu page
// 1a. Create a Room
// 1b. Join a Room
// 2. Chat with Users Online

// printRooms() - prints all rooms in Firebase to the HTML
function printRooms(room){
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
		wellButton.attr('href', '/game');
		wellButton.append('Join');
		wellButton.append('</a>');
	// Append the button to the well
		well.append(wellButton);
		well.append('</div>');
	// Append the well to the panel
	$('#currentRooms').append(well);
}

function printChat(message){
	var text = $('<p>');
	text.append(message);
	text.append('</p>');
	$('#chatLog').append(text);
}

// Firebase References
// The reference to our room list on Firebase
var roomListRef = firebase.database().ref('rooms');
// The reference to our chat
var chatRef = firebase.database().ref('chat');

// Getting the values from our room list
roomListRef.once('value')
	.then(function(snapshot){
		// .forEach(), loops through our database
		snapshot.forEach(function(childSnapshot){
			// The value of each room
			var roomData = childSnapshot.val();
			var room = roomData.room;
			console.log(roomData);
			printRooms(room);
		})
	})

// Getting the entire chat
chatRef.once('value')
	.then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var chatData = childSnapshot.val();
			var message = chatData.message;
			printChat(message);
		})
	})




// CLICK EVENTS

// Click Event for "Create a Room" -- opens a modal
$('#createOpen').on('click', function(){
	//Initialize the Modal
	$('#myModal').modal('show');
});

// Click Event for the 'Create' button inside of the modal
$('#createRoom').on('click', function(){
	// Grab the value of the input
	var room = $('#roomname').val();
	// Get a reference to Firebase, specifically the roomList.
	// Push the value from the input
	var newRoomRef = roomListRef.push();
	newRoomRef.set({'room': room});

	printRooms(room);
	// Clear the value of the input
	$('#roomname').val(null);
});

// Click Event -- Submit the Chat
$('#chatSubmit').on('click', function(){
	var message = $('#message').val();
	var newMessageRef = chatRef.push();
	newMessageRef.set({'message': message});
	printChat(message);
	$('#message').val(null);
})

