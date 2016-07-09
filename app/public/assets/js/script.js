var gameState = {
	go: true,
	words: 0,
	points: 0,
	missedWords: 0
}
var wordBank = [];
var activeBank = [];
var usedBank = [];


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
	gameLoop(3000);

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
	$('button').click(function(){

		// console.log("pushMe");

		// this takes the contents of the input box
		var inputContents = $('.box').val();

		// console.log(inputContents, inputContents.length);

		//contains the new rod lifecycle
		newWordLifeCycle(inputContents);

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
			//
			if(reg.test(text) === true){
				targetCounter++;

				//makes a var that is the part fo the word that matches your word
				var inputHighlight = targetWord.slice(inputSoFar);

				// console.log("Portion to highlight: ", inputHighlight);
				// console.log("My Input: ", myInput);
				
				// DONE 9/27: make the individual letters bold as you type.
				//rewrites the word as "what i've input" + what is left
				$(this).html("<em>" +  myInput + "</em>" + inputHighlight);

				// this marks the completion of a typed word and
				if($SearchField.val() == targetWord){

					//nulls that spot in the activeBank/adds to usedbank
					activeBank[activeBank.indexOf(targetWord)] = null;
					usedBank.push(targetWord);

					$SearchField.val('');
					$(this).closest('.wordTargetDetails').remove();

					gameState.points += targetWord.length;
					$('#score').html(gameState.points*1000);
					$('#words').html(gameState.words);
					$('#missed').html(gameState.missedWords);
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
			if(gameState.go==false){
				clearInterval(gameLoopInterval);
			}else{
				selectWord();
			}	
		}, xxyy);

}
/////////////////////////////////////////////////////////////////////////////
function selectWord(){

		var xxx = Math.floor(Math.random() * wordBank.length);
		newWordLifeCycle(wordBank[xxx].word);
		wordBank.splice(xxx, 1);
}
/////////////////////////////////////////////////////////////////

//this function will contain the new word lifecycle
function newWordLifeCycle(inputContents){
	console.log("inputContents", inputContents);
	//this finds the row that has no word in it currently
	var activeRow;
	var possibleRows = [];
	for(tic = 0;tic<10;tic++){
		if(activeBank[tic]==null){
			possibleRows.push(tic);
		}
	}

	activeRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
	// console.log("possibleRows", possibleRows);
	// console.log("activeRow", activeRow);


	activeBank[activeRow] = inputContents;
	// console.log("newword activebank", typeof activeBank, typeof activeBank[0], activeBank);

	//this line creates the dynamic div that contains the word, and maybe an image
	$('#row' + activeRow).html('<div class="center wordTargetDetails wordTargetAnimate'+inputContents.length +' word-x1 div6 white"><div class="center"><img width="25" height="25" src="static/assets/images/space_invader.png"></div><p class="wordTarget">'+inputContents+'</p></div>');

	explosionTrigger(inputContents.length, activeRow, inputContents);

}

/////////////////////////////////////////////////////////////////

function explosionTrigger(time, row, word){

	setTimeout(function(){

			//this creates the explosion div
			if(activeBank[row] == word){
				$('#row' + row).html('<img class="explosion" src="static/assets/images/explosion.gif">');
				playAudioBoom();
				gameState.missedWords++
				activeBank[row] = null;
			
				if (gameState.missedWords ==10){
					gameState.go=false;
					var youLoseArray = ["Y","O","U","L","O","S","E","", "", ""];
					aliens.pause();
					for(u = 0; u < 10; u++){
						$("#row" + u).html('<h3>'+youLoseArray[u]+'</h3>');
					}
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

		// this sets the timer and the speed relative to the length of the word
	}, time*1000);
}

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
aliens.volume = .1;
zap.volume = .4;
// playAudioBoom();


