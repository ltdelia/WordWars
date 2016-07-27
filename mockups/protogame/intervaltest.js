var tick = 0;
var bob = setInterval(function(){
	console.log(tick);
	tick ++;
	if (tick >= 3){
		clearInterval(bob);
	}
}, 1000);


