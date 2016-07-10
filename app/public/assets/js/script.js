//Basic Game Information
var gameState = {
	go: true,
	victory: false,
	words: 0,
	//points are letters
	points: 0,
	missedWords: 0,
	wave: 0,
	enemies: 0,
	difficulty: 2000
}
var invadertic = 0;
var invaders = [
"http://www.gamingrebellion.com/wp-content/uploads/2014/09/invlarge.gif?9d7bd4",
"static/assets/images/space_invader.png"
]

//Holds api words
var wordBank = [];
//Holds words on screen
var activeBank = [];
//Holds words that have been used
var usedBank = [];
//needed for end game makeships, used in the newwordlifecycle losegame portion
var endGameRows = [0,0,0,0,0,0,0,0,0];
////////////////////////////////////////////////////////////////
//ajax call to begin everything
var URL = "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&excludePartOfSpeech=proper-noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=1000&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"

$.ajax({url: URL, success: function(result){

	for(zzz = 0;zzz < result.length;zzz++){
		if(result[zzz].word[0] >= 'a' && result[zzz].word[0] <= 'z' && result[zzz].word.indexOf('-') == -1 && result[zzz].word.indexOf("'") == -1 ){
		  	wordBank.push(result[zzz]);
		}
	  }

	console.log("Gameloop starts", wordBank);


}});
/////////////////////////////////////////////////////////////////////////////
//sets up the jquery targets
$(document).ready(function(){
	$SearchField = $('#query');		// 	the text field. This is where the game is played.
	$targets = $('.wordTargetDetails');	//	the word targets. Each one will have the class "wordTarget."

	// var debounced_tableFilter = _.debounce(wordGun, 200);
	// var throttle_tableFilter = _.throttle(wordGun, 500);
	$SearchField.keyup(function(){
		wordGun(this);
	

	});

//create new divs button
	$('.makediv').click(function(){

		// console.log("pushMe");

		// this takes the contents of the input box
		var inputContents = $('.box').val();

		// console.log(inputContents, inputContents.length);

		//contains the new rod lifecycle
		newWordLifeCycle(inputContents, null);

	});

});//end document.ready

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// removes words
function wordGun(node){

	$targets = $('.wordTarget');

	// console.log('wordGun called');

	//on keyup, look at the #query id box word
	var myInput = $SearchField.val();

	// console.log('myInput: ', myInput);

	//regex???
	var val = '^(?=.*\\b' + $.trim($(node).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
        reg = RegExp(val, 'i'),
        // search_results = [],		//debugging purposes only, this can be removed since counters are now keeping track of results.
        
        targetCounter = 0,
        text;

		$targets.each(function(){
			//gets the text from the targets
			var targetWord = $(this).text();
			console.log("targetWord", targetWord);
			//look for spaces in the text, if there is a group of them, make them blank???

			var text = $(this).text();//.replace(/\s+/g, ' ');
			
			// checks how many characters were selected?
			var inputSoFar = $SearchField.val().length;
			
			if(reg.test(text) === true){
				targetCounter++;

				//makes a var that is the part fo the word that matches your word
				var inputHighlight = targetWord.slice(inputSoFar);
				
				//rewrites the word as "what i've input" + what is left
				$(this).html("<em>" +  myInput + "</em>" + inputHighlight);

				// this marks the completion of a typed word and
				if($SearchField.val() == targetWord){

					console.log("bang");
					//nulls that spot in the activeBank/adds to usedbank
					activeBank[activeBank.indexOf(targetWord)] = null;
					usedBank.push(targetWord);

					//blanks the word input
					$SearchField.val('');
					//removes the animation div
					$(this).closest('.wordTargetDetails').remove();

					//gamestate bookkeeping
					gameState.points += targetWord.length;
					$('#score').html(gameState.points*1000);
					$('#words').html(gameState.words);
					$('#missed').html(gameState.missedWords);

					console.log('gamestatuscheck');
					console.log('gameState.wave', gameState.wave);

					gameStatusCheck();
					
					playAudioZap();
				}

			} 
		});
	// }
};


$('.noEnterSubmit').keypress(function(e){
    if ( e.which == 13 ) return false;
});

/////////////////////////////////////////////////////////////////////////////

//this starts a recursive function which selects words, checks their lenths, and recalls itself relative to the length of the last word selected
function gameLoop(xxyy){
	//shut down to see if it matters
	playAudioAliens();
		var gameLoopInterval = setInterval(function(){
			//checks of the game is over
			if(gameState.go==false && gameState.victory == false){
				clearInterval(gameLoopInterval);
			}else if(gameState.victory == true && gameState.go ==true){
				clearInterval(gameLoopInterval);
			}else{
				selectWord();
			}	
		}, xxyy);

}
/////////////////////////////////////////////////////////////////////////////
function selectWord(){

		var xxx = Math.floor(Math.random() * wordBank.length);
		newWordLifeCycle(wordBank[xxx].word, null);
		wordBank.splice(xxx, 1);
}
/////////////////////////////////////////////////////////////////

//this function will contain the new word lifecycle
function newWordLifeCycle(inputContents, time){
	console.log("inputContents", inputContents);
	if(time == null){time = inputContents.length;}

	//this finds the row that has no word in it currently
	var activeRow;
	var possibleRows = [];

	//a) game is going, figure out what rows have words b)game is not going, append a div 9 times into each row
	if(gameState.go == true){
		for(tic = 0;tic<9;tic++){
			if(activeBank[tic]==null){
				possibleRows.push(tic);
			}
		}
	}else if (gameState.go == false){
		for(tic = 0;tic<9;tic++){
			if(endGameRows[tic]<9){
				possibleRows.push(tic);
			}
		}
	}


	//randomly selected row
	activeRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
	//drops the word in the corresponding activeBank slot
	activeBank[activeRow] = inputContents;

	//this code randomizes the speed tag on the moving div
	random123 = Math.floor(Math.random() * 5);

	console.log(random123);

	var randomSpeed;

	switch(random123){
		case 1: randomSpeed = 'word-x1';
		break;
		case 2: randomSpeed = 'word-x2';
		break;
		case 3: randomSpeed = 'word-x3';
		break;
		case 4: randomSpeed = 'word-x4';
		break;
		case 5: randomSpeed = 'word-x5';	
		break;
		default: console.log("switch error");
	}

	//end game? append you lose and tick up activerow
	//game? drop word, and activate explosion trigger
	if(inputContents == "You Lose!"){
		endGameRows[activeRow]++;
		$('#row' + activeRow).append('<div class="center wordTargetDetails wordTargetAnimate'+inputContents.length +' '+randomSpeed+' white"><div class="center"><img class="z3" width="35" height="35" src="'+invaders[invadertic]+'"></div><p class="wordTarget">'+inputContents+'</p></div>');
		invaderSwap();
	}else{
		//this line creates the dynamic div that contains the word, and maybe an image
		$('#row' + activeRow).html('<div class="center wordTargetDetails wordTargetAnimate'+inputContents.length +' '+randomSpeed+' white"><div class="center"><img class="z3" width="35" height="35" src="'+invaders[invadertic]+'"></div><p class="wordTarget">'+inputContents+'</p></div>');
		invaderSwap();
		//
		explosionTrigger(time, activeRow, inputContents);
	}



}

/////////////////////////////////////////////////////////////////

function explosionTrigger(time, row, word){

	setTimeout(function(){

			$('#missed').html(gameState.missedWords);
			//this creates the explosion div
			if(activeBank[row] == word){
				$('#row' + row).html('<img class="explosion z3" src="static/assets/images/explosion.gif">');
				playAudioBoom();
				gameState.missedWords++
				activeBank[row] = null;
			
				if (gameState.missedWords ==10){
					gameState.go=false;
					// var youLoseArray = ["Y","O","U","L","O","S","E","", "", ""];
					aliens.pause();
					gameOver();
					// for(u = 0; u < 10; u++){
					// 	$("#row" + u).html('<h3>'+youLoseArray[u]+'</h3>');
					// }
				}else{
					//this ends the explosion div
					setTimeout(function(){

						//blanks the row
						$('#row' + row).html("");

					}, 500);
					//?? not sure about this one
					activeBank[row] = null;
				}
			}

		// this sets the timer and the speed relative to the length of the word, +2
	}, time*1000+2);
}

/////////////////////////////////////////////////////////
//beginning of game countdown, triggered by red modal button
function gameStart(){
	//difficulty level housekeeping
	gameState.wave++;
	$('#waveNum').html(gameState.wave);

	//sets countdown timer
	var x = 4
	var countdown321 = setInterval(function(){
		x --;
		if (x==0){
			//writes the GO!
			$('#row4').html('<h1 class="centerAligning wordTargetAnimate50 word-x2 white">GO!</h1>');	
			//2nd half of animation
			setTimeout(function(){
				$('#row4').html('<h1 class="centerAligning wordTargetAnimate51 word-x2 white">GO!</h1>');
				gameLoop(gameState.difficulty);
			},600);
		}else if (x < 0){
			// blanks the row
			$('#row4').empty();	
			clearInterval(countdown321);

		}else{
			//does the loop countdown
			$('#row4').html('<h1 class="centerAligning wordTargetAnimate50 word-x2 white">'+x+'</h1>');
			//2nd half of animation
			setTimeout(function(){
				$('#row4').html('<h1 class="centerAligning wordTargetAnimate51 word-x2 white">'+x+'</h1>');
			},600);
		}
	}, 1000);
}

function gameStatusCheck(){
	console.log("gameStatusCheck", gameState.go, gameState.words, gameState.missedWords);
	if(gameState.go == true && gameState.words >= 5 && missedWords < 10){
		gameState.victory = true;
		endWave();
	}
}

//makes 81 ships in a grid. most of the logic is in "newwordlifecycle"
function gameOver(){

	clearAllRows();
	var stopMakingShips = 0;
	var makingLoserShips = setInterval(function(){
		stopMakingShips++;
		if(stopMakingShips > 81){clearInterval(makingLoserShips);}
		newWordLifeCycle("You Lose!", null);
	},200);	
}	


function startWave(x){

}

function endWave(){
	clearAllRows();
	activeBank = [];
	usedBank = [];
	var endWaveTicker = 0;

	// $('#row4').append('<div id="victoryTable" class=" white"></div>');


	//loopvictory

	// for(j = 0;j<8;j++){
	// 	setTimeout(function(){
	// 			var completed = "Victory!"
	// 			$('#row4').append('<h1 class="centerAligning wordTargetAnimate50 word-x2 white">'+completed[endWaveTicker]+'</h1>');
	// 			endWaveTicker++;
	// 	}, j*200);
	// }
	
	//nooloop victory
	
	// var endWaveInterval = setInterval(function(){
	// 	var completed = "Victory!"
	// 	$('#row4').append('<h1 class="victory centerAligning wordTargetAnimate50 word-x2 white">'+completed[endWaveTicker]+'</h1>');
	// 	endWaveTicker++;
	// 	if(endWaveTicker >= 8){
	// 		setTimeout(function(){
	// 			modal.style.display = "block";
	// 		},1000)
	// 		clearInterval(endWaveInterval);
	// 	}
	// },200);

	$('.completed').html(" Completed!");

}

endWave();

function gameReset(){
	gameState.go = true;
	gameState.words = 0;
	gameState.points = 0;
	gameState.missedWords = 0;
	gameState.victory = false;
}

//audio code, grabs audio from the .hbs file, assigns functions to play it, and volumn

var boom = document.getElementById("boom");
var aliens = document.getElementById("aliens");
var zap = document.getElementById("zap");

function playAudioBoom() { 
    boom.play(); 
} 
function playAudioAliens() { 
    aliens.play(); 
} 
function playAudioZap() { 
    zap.play(); 
} 
boom.volume = .4;
aliens.volume = .01;
zap.volume = .4;
// playAudioBoom();


function invaderSwap(){
	if(invadertic == 1){
		invadertic--;
	}else if (invadertic == 0){
		invadertic++;
	}
}

function clearAllRows(){
	for(u = 0; u < 10; u++){
		$("#row" + u).html('');
	}
}

