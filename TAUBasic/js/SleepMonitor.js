window.onload = successCallbackPer();
var sleepStatus; 
function sleepFunc(){
	//console.log("heartfun");
	tizen.humanactivitymonitor.getHumanActivityData("SLEEP_MONITOR", successCallbackSleep, errorCallback);

}

function successCallbackSleep(slinfo){
	console.log("Heart callback");
	console.log(slinfo);
	sleepStatus = slinfo.status;
	var time = new Date().getTime();
	console.log(time);
	//console.log(heartrate);
	//console.log('OK?')
}


function errorCallback(error) {
//console.log('ee');
	  switch (error.code) {
	    case error.PERMISSION_DENIED:         
	      console.log("User denied the request for heartrate.");
	      break;
	//FIX HERE
	    case error.POSITION_UNAVAILABLE:
	      console.log("Location information is unavailable.");
	      break;
	    case error.TIMEOUT:
	      console.log("The request to get user location timed out.");
	      break;
	    case error.UNKNOWN_ERROR:
	      console.log("An unknown error occurred.");
	      break;
	   }
	}


function successCallbackPer() {
	tizen.humanactivitymonitor.start('SLEEP_MONITOR');
	console.log('succes Permision')
	setInterval(sleepFunc, 1000*1);
}

//function requestPermissions(){
//	tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo",successCallbackPer , errorCallback);
//	console.log("request permission");
//
//}
