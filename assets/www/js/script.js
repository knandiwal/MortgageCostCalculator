
document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(onDeviceReady);
var readyCounter = 0;
function onDeviceReady (){	
	readyCounter++;
	if( readyCounter == 1 ){
		run();
	}	
}


function run(){
	
	var $controller = new Controller();
	
	$controller.init();
	
}