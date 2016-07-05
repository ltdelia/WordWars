// Logic for the Menu page
// 1a. Create a Room
// Each room should have the room name, an id(?), the users in it, and a word array
// 1b. Join a Room
// 2. Chat with Users Online

//TO DO
// Handle submitting data -- Firebase pushes the words to the database after the SECOND submit

// Wordnik API and URL
var URL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&excludePartOfSpeech=proper-noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=1000&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
var words = [];

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
function printChat(message){
	var text = $('<p>');
	text.append(message);
	text.append('</p>');
	$('#chatLog').append(text);
}

function generateWords(){
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
				words.push(response[i].word);				
			}
		}
		console.log(words);
	})
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

	generateWords();
	console.log(words);
	// Get a reference to Firebase, specifically the roomList.
	// Push the value from the input
	var newRoomRef = roomListRef.push();
	newRoomRef.set({'room': room, 'words': words});

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

