// Ok basic idea:

// You get some words, put them in an array. 
//show a game menu, 1: start game 2: high scores 3: exit
// 1:
// Game begins 
// user prompt starts so user can enter words, when they do they are moved out of a temporary array. 
// interval starts so that words are automatically randomly pulled from source array and into temporary array. a corresponding "time" array holds a counter for the word in the same position.
//every second the game ticks down every word that is still there, if one gets to 0, you lose a point. when you lose 5 points, game exits

// there are 2 known bugs, let me know if they end up hindering you 

/////////////////////////////////////////////////////////////////////////////

//normal requires
var prompt = require('prompt');
prompt.start();
var fs = require('fs');

//these hold the words being drawn randomly from. The "huge string" is used when reading from a txt file"
var wordsArray = [];
var hugeString = "";

//words are the active words you are using, they correllate to the "time" array. So words[0] is made when time[0] is made. They can probably be in a single object instead, so game = [{word:bob,time:5}, etc...]
var words = [];
var time = [];

//points are added when you type a word
var points = 0;

//losegame determines when you lose (when it hits 5), and triggers if a word's "time" is at 0 when the timer goes off 
var loseGame = 0;

//this is the scores object, for local purposes. it'll be phased out when we implement firebase
var highScores = [{name: "Zintis",score: 100}];

var playInstance = 0;


//start the game - makes some words and calls up the starting functions.
fs.readFile('./string.txt', "utf-8", (err, data) => {

    if (err) throw err;
    //grabs the string.txt data
    hugeString = data;
    //makes it an array
	stringTextBreaker(hugeString);
	//plucks a word from array (unnecessary)
	newWord();
	//unnecessary
	console.log(wordsArray.length);
	console.log(words);
	console.log(time);

	//starts the game cycle
	beginGame();
});

// takes a string of words and spaces and turns it into an array
function stringTextBreaker(x){

	var tempwordholder = "";

	for (z = 0; z < x.length;z++){

		if(x[z] >= 'a' && x[z] <= 'z'){

			tempwordholder += x[z];


		}else if (x[z] == ' '){

			wordsArray.push(tempwordholder);

		    tempwordholder = "";
		}
	}
}

// this is the menu function
function beginGame(){
	playInstance ++;
	points = 0;
	logger();
	console.log("Welcome to NodeType");
	logger();
	console.log("Choose from the following menu:")
	console.log("1: Play!");
	console.log("2: See High Scores!");
	console.log("3: Exit");
	
	prompt.get(['userInput'],function(err, result){
		
		switch(result.userInput){

			case '1':
				console.log('gamebegins');
				//reset the game
				loseGame = 0;
				points = 0;

				//it starts the player prompt; they can now enter words
				wordEntry(playInstance);
				//I think this line is meant to clear a bug where the previous userInput value is stored between uses.
				result.userInput = 0;
				//this is the loop. it has a problem. if you set the loop anonymously, it will run forever. If you declare it as a variable with a name, you can do a "clearInterval('name')" and make it stop running. The game has a bug that when you lose and the game tries to restart it just keeps running. I think it is because the interval function is out of scope with the clear interval function. Let us know if you have problems with this 
				var iterate = setInterval(function(){ 

					//grabs a new word
					newWord();
					//ticks the words' time value down
					countDown();
					//console logs the gamestate
					gameStateLog();	

					if (loseGame >= 5){
						clearInterval(iterate);
						console.log("game over");
						console.log("Enter your Name");

						prompt.get(['userName'], function(er, result){

							highScores.push({name: result.userName, score: points});

							beginGame();
							resetGame();
						})
					}

				}, 2000);
				break;

			case '2':
				result.userInput = 0;
				logger();		
				for (x=0;x<highScores.length;x++){

					console.log(highScores[x].name, ": ", highScores[x].score);
				}
				beginGame();
				break;

			case '3':
				result.userInput = 0;
				logger();
				console.log("thanks for playing!");
				logger();			
				process.exit();
				break;
			default:
				console.log("invalid input, try again.");beginGame();
				break;
		}
	});
}


//randomly plucks word from wordlist, adds to the appropriate arrays
function newWord(){
	var randomTargetWord = Math.floor(Math.random() * wordsArray.length);
	words.push(wordsArray[randomTargetWord]);
	time.push(4);
}

//prints out the gamestate for the player in the console
function gameStateLog(){
	logger();
	for (x=5;x>=0;x--){
		if (words[x]){
			console.log(words[x], time[x]);
		}else{
			console.log("//////////////////////////////");
		}
	}
	logger();
}

//this is a recursive function which checks if your word is in an array, deletes it if it is, and starts itself anew
function wordEntry(currentGame){

	if(currentGame == playInstance){

		prompt.get(['userWord'],function(err, result){

			var whereIsWord = words.indexOf(result.userWord);
			
			if (whereIsWord>=0){
				console.log(words[whereIsWord]);
				points+=words[whereIsWord].length;
				spliceTimeWord(whereIsWord);
			}

			console.log('currentGame', currentGame);
			console.log('playInstance', playInstance);

			
			wordEntry(currentGame);
		
		});
	}
}

// every x seconds it ticks down the timer array and deletes words that have 0 seconds on the timer
function countDown(){

	for(x=0;x<(time.length-1);x++){

		time[x] = time[x]-1;

		if (time[x] == 0){

			loseGame += 1;
			spliceTimeWord(x);


			if (loseGame >= 5) {

				// clearInterval(iterate);


			// 	logger();
			// 	console.log("YOU LOSE, YOU HAD ", points, " POINTS!");
			// 	logger();

			// 	console.log("Enter your Name");
			// 	prompt.get(['userName'],function(err, result){

			// 		highScores.push({name: result.userName ,score: points});
			// 		resetGame();
			// 	});
			// 	// beginGame();
			}

		}
	}
}

//just combining two functions into one, cuts out entries from the array
function spliceTimeWord(x){
	time.splice(x, 1);
	words.splice(x, 1);

}

// resets all base values
function resetGame(){
	time = [];
	words = [];
	points = 0;
	loseGame = 0;
}

//just makes the console easier to read
function logger(){
	console.log("==============================");
}