// Logic for the Menu page
// 1a. Create a Room
// Each room has the room name, an id, the users in it, and a word array
// 1b. Join a Room
// When a user joins a room, Firebase runs an update() method to update user2
// 2. Chat with Users Online
// When a user types something in and submits, their username and message will appear in the div

// GLOBAL VARIABLES
// currentUser
var currentUser;
// empty words
var words = [];
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
			currentUser = user.displayName;
			// Display their credentials to the console
			console.log("Name: ", name);
			console.log("Email: ", email);
		}
	}else{
		console.log("No one is signed in.");
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
		// Call Firebase.update(), passing in the userTwo object
		roomRef.update(userTwo);
		// Add the href to the button, triggering redirect to the game page
		$('#'+roomID).attr('href', '/game');
	})
}

// printChat() -- prints out the messages posted by users
function printChat(username, message){
	var text = $('<p>');
	text.append('<strong>'+ username + '</strong>: '+ message);
	text.append('</p>');
	$('#chatLog').append(text);
}

// generateWords() -- calls the Wordnik API, pushes words to an array
function generateWords(wordArray, callback){
	// URL to Wordnik API
	var URL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&excludePartOfSpeech=proper-noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=1000&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
	// GET request to Wordnik API
	$.ajax({method: 'GET', url: URL, async: false})
	.done(function(response){
		// For the length of the response...
		for(var i=0; i<response.length; i++){
			// if the word begins with a capital letter...
			if(response[i].word[0] >='A' && response[i].word[0]<='Z'){
				// don't do anything
			}else{
				// push the remaining words to an array
				wordArray.push(response[i].word);
			}
		}
	callback();
	})
}

function createRoom(){
	// Grab the value of the input
	var room = $('#roomname').val();

	// Get a reference to Firebase, specifically the roomList.
	var newRoomRef = roomListRef.push();
	// The key for the pushed ref to the 'rooms' ref. We will use this as the room ID
	var roomID = newRoomRef.key;

	// Push the roomID, user1, room name, and word array to the 'rooms' ref in Firebase
	newRoomRef.set({'roomID': roomID, 'user1': currentUser, 'user2': "", 'room': room, 'words': words});

	printRooms(room);
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
	generateWords(words, createRoom);
	console.log(words);
});

// Click Event -- Submit the Chat
$('#chatSubmit').on('click', function(){
	var message = $('#message').val();
	var newMessageRef = chatRef.push();
	newMessageRef.set({'username': currentUser, 'message': message});
	printChat(currentUser, message);
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
roomListRef.once('value')
	.then(function(snapshot){
		// .forEach(), loops through our database
		snapshot.forEach(function(childSnapshot){
			// The value of each room
			var roomData = childSnapshot.val();
			var room = roomData.room;
			var roomID = roomData.roomID;
			printRooms(room, roomID);
		})
	})

// Getting the entire chat
chatRef.once('value')
	.then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var chatData = childSnapshot.val();
			var username = chatData.username;
			var message = chatData.message;
			printChat(username, message);
		})
	})
