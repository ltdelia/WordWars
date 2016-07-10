// Logic for the Menu page
// 1a. Create a Room
// Each room should have the room name, an id(?), the users in it, and a word array
// 1b. Join a Room
// 2. Chat with Users Online

//TO DO
// Fix words array pushing to Firebase Realtime Database

// GLOBAL VARIABLES
// currentUser
var currentUser;
var words = [];
// Firebase Auth 
// Check if a user is logged in with Firebase
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
			// Display their credentials to the console
			console.log("Name: ", name);
			console.log("Email: ", email);
		}
	}else{
		console.log("No one is signed in.");
	}
})

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

// printChat() -- prints out the messages posted by users
function printChat(username, message){
	var text = $('<p>');
	text.append('<strong>'+ username + '</strong>: '+ message);
	text.append('</p>');
	$('#chatLog').append(text);
}

function generateWords(wordArray){
	// URL to Wordnik API
	var URL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&excludePartOfSpeech=proper-noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=1000&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
	// GET request to Wordnik API
	$.ajax({method: 'GET', url: URL})
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
	})
}


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
	var roomID = newRoomRef.key;
	generateWords(words);
	console.log(words);
	newRoomRef.set({'roomID': roomID, 'user1': currentUser, 'user2': null, 'room': room, 'words': words});

	printRooms(room);
	// Clear the value of the input
	$('#roomname').val(null);
});

// Click Event -- Submit the Chat
$('#chatSubmit').on('click', function(){
	var message = $('#message').val();
	var newMessageRef = chatRef.push();
	newMessageRef.set({'username': currentUser, 'message': message});
	printChat(currentUser, message);
	$('#message').val(null);
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
			printRooms(room);
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



