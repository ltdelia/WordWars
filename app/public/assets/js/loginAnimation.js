var varA = false;
var varB = false;
var varC = false;
var varQ = false;

	$('#A').html("<img class='word-x2 wordTargetAnimate3' src='static/assets/images/space_invader1.gif'>");
	$('#B').html("<img class='word-x2 wordTargetAnimate4' src='static/assets/images/space_invader2.gif'>");
	$('#C').html("<img class='word-x2 wordTargetAnimate5' src='static/assets/images/space_invader3.gif'>");
	$('#Q').html("<img class='word-x2 wordTargetAnimate6' src='static/assets/images/saucer.gif'>");

// "<img class='word-x2 wordTargetAnimate3' src='static/assets/images/space_invader1.gif'>"
// "<img class='word-x2 wordTargetAnimate4' src='static/assets/images/space_invader2.gif'>"
// "<img class='word-x2 wordTargetAnimate5' src='static/assets/images/space_invader3.gif'>"

// "<img class='word-x2 wordTargetAnimate3b' src='static/assets/images/space_invader1.gif'>"
// "<img class='word-x2 wordTargetAnimate4b' src='static/assets/images/space_invader2.gif'>"
// "<img class='word-x2 wordTargetAnimate5b' src='static/assets/images/space_invader3.gif'>"

setInterval(function(){
	if(varA == true){
		$('#A').html("<img class='word-x2 wordTargetAnimate3' src='static/assets/images/space_invader1.gif'>"
);
		varA = false
	}else{
		$('#A').html("<img class='word-x2 wordTargetAnimate3b' src='static/assets/images/space_invader1.gif'>"
);
		varA = true
	}


},2000);

setInterval(function(){
	if(varB == true){
		$('#B').html("<img class='word-x2 wordTargetAnimate4' src='static/assets/images/space_invader2.gif'>"
);
		varB = false
	}else{
		$('#B').html("<img class='word-x2 wordTargetAnimate4b' src='static/assets/images/space_invader2.gif'>"
);
		varB = true
	}


},3000);
		
setInterval(function(){
	if(varC == true){
		$('#C').html("<img class='word-x2 wordTargetAnimate5' src='static/assets/images/space_invader3.gif'>"
);
		varC = false
	}else{
		$('#C').html("<img class='word-x2 wordTargetAnimate5b' src='static/assets/images/space_invader3.gif'>"
);
		varC = true
	}


},4000);

setInterval(function(){
	if(varQ == true){
		$('#Q').html("<img class='word-x2 wordTargetAnimate6' src='static/assets/images/saucer.gif'>"
);
		varQ = false
	}else{
		$('#Q').html("<img class='word-x2 wordTargetAnimate6b' src='static/assets/images/saucer.gif'>"
);
		varQ = true
	}


},5000);