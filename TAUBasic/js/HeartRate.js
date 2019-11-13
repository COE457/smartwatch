window.onload = requestPermissions();
var heartrate; 
function heartFunc(){
	//console.log("heartfun");
	tizen.humanactivitymonitor.getHumanActivityData("HRM", successCallbackHeart, errorCallback);
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

function successCallbackHeart(hrminfo){
	//console.log("Heart callback");
	//console.log(hrminfo);
	heartrate = hrminfo.heartRate;
	//var time = new Date().getTime();
	//console.log(time);
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
	tizen.humanactivitymonitor.start('HRM');
	tizen.humanactivitymonitor.start('SLEEP_MONITOR');

	console.log('succes Permision')
	setInterval(heartFunc, 1000*1);
}

function requestPermissions(){
	tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo",successCallbackPer , errorCallback);
	console.log("request permission");

}


//heartrate
//
//
//function onSuccess() {
//	var myCallbackInterval = 1000;
//	var mySampleInterval = 1000;
//	
//  function onchangedCB(hrmInfo) {
//  	console.log('this callback is called every ' + myCallbackInterval + ' milliseconds');
//      console.log('heart rate:' + hrmInfo.heartRate);
//     // tizen.humanactivitymonitor.stop('HRM');
//      
//  }
//  function onerrorCB(error) {
//      console.log('Error occurred. Name:' + error.name + ', message: ' + error.message);
//  }
//  
//  var option = {
//  	    'callbackInterval': myCallbackInterval,
//  	    'sampleInterval': mySampleInterval
//  	};
//
//  tizen.humanactivitymonitor.start('HRM', onchangedCB, onerrorCB,option);
//    
//  function onchangedCB(sleepInfo) {
//      console.log('Sleep status: ' + sleepInfo.status);
//      console.log('Timestamp: ' + sleepInfo.timestamp + ' milliseconds');
// 
//  }
//
//  tizen.humanactivitymonitor.start('SLEEP_MONITOR', onchangedCBSleep, onerrorCB,option);
//}
//
//function onError(e) {
//  
//	console.log("error " + JSON.stringify(e));
//}
//
//
//tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo",onSuccess, onError);
//
//



//
//window.onload = requestPermissions();
//
//var accSensor;	
//var htrt;
//var slp;
//var tim;
//var x,y,z;
//var obj;
//
////var webSocketUrl = "ws://192.168.0.159:8080";
////var webSocket; 
////
//function main() {
//	console.log("heh1");
//	accSensor = tizen.sensorservice.getDefaultSensor('ACCELERATION');
//	console.log(accSensor);
//	console.log("heh2");
//	accSensor.start(accst);
//	console.log("heh3");
//  
//  datarec();
//  console.log("heh");
//
//}
//
//function datarec(){
//	console.log("reached");
//	tizen.humanactivitymonitor.getHumanActivityData('HRM', onsuccessHT);
//	tizen.humanactivitymonitor.getHumanActivityData('SLEEP_MONITOR', onsuccessSL);
//	accSensor.getAccelerationSensorData(onsuccessAcc);
//	
//	prepmsg();
//	
//	setTimeout(datarec, 1000);
//}
//
//function prepmsg(){
//	
//	obj = {
//			"heartrate"		:	htrt,
//			"sleepstatus"	:	slp,
//			"time"			:	tim,
//			"accelerometer"	:	{
//				"x"	:	x,
//				"y"	:	y,
//				"z"	:	z
//			}
//	};
//	
//	console.log(obj);
//sendMessage(obj);
//}
////
////function sendMessage(msg) {
//////  if (webSocket.readyState === 1) {
//////      webSocket.send(msg);
//////  }
//////}
////
//function onsuccessAcc(accinfo){
//	x = accinfo.x;
//	y = accinfo.y;
//	z = accinfo.z;
//}
////
//function onsuccessHT(hrminfo){
//	console.log("hehe");
//	htrt = hrminfo.heartRate;
//}
//
//function onsuccessSL(slinfo){
//	slp = slinfo.status;
//	tim = slinfo.timestamp;
//}
//
//
//function onErrorPermission(){
//  console.log('No permission to access health info');
//  main();
//}
//
//function onsuccessPermission(){
//  console.log('HRM permission succeeded');
//  tizen.humanactivitymonitor.start('HRM');
//  tizen.humanactivitymonitor.start('SLEEP_MONITOR');
//  //webSocket = new WebSocket(webSocketUrl,'sensor');
//  console.log("sock");
//  main();
//}
//
//function accst(){
//	console.log('Accelerometer started');
//}
//
//function requestPermissions(){
//	tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", onsuccessPermission, onErrorPermission);
//	
//}


//heartrate

