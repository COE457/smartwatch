window.onload = requestPermissions(); //request permission on load
var heartrate;

//URL paths to send the heartrate, equipment and awake status 
var hearRateHistoryURL = 'http://192.168.137.1:3001/API/heartRateHistory/create';
var equipmentHistoryURL = 'http://192.168.137.1:3001/API/equipmentHistory/create';
var client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'sensors');

var getID = tizen.systeminfo.getCapabilities();
var devID = getID.duid.substring(0,8);

var TimeInterval= 1000*10;


var heartrateJson= {
		"Smartwatch" : devID,
		"date" : "n/a",
		"reading" :  ["n/a", "n/a"]
	};
var equippedJson={
	"Smartwatch" : devID,
	"date" : "n/a",
	"equipped" : "n/a"
};

client.connect({
	onSuccess : onConnect
});

function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	console.log("connected");
	
	client.subscribe("watch2/heartRateHistory");
	client.subscribe("watch2/equipmentHistory");
	
	
	setInterval(function sendJson(){
	var heartRate = new Paho.MQTT.Message(JSON.stringify(heartrateJson));
	heartRate.destinationName = "watch2/heartRateHistory";
	client.send(heartRate);// publish message
	console.log("HR sent");
	
	
	var equipment = new Paho.MQTT.Message(JSON.stringify(equippedJson));
	equipment.destinationName = "watch2/equipmentHistory";
	client.send(equipment);// publish message 
	console.log("equip sent");
	},  TimeInterval);
}
//function that sends the message using ajax through HTTP request
function sendMsg(body, url) {
	$.ajax({
		url : url,
		dataType : "json",
		type : "POST",
		contentType : 'application/json',
		data : JSON.stringify(body),
		processData : false,
		success : function(data, textStatus, jQxhr) {
			console.log(data);
		},
		error : function(jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}

//This function gets the sesnsor API 
function sensorFunc() {
	//calls the success callback if the sesnor is there otherwise calls error callback
	tizen.humanactivitymonitor.getHumanActivityData("HRM",
			successCallbackHeart, errorCallback); //HeartRate API
	//tizen.humanactivitymonitor.getHumanActivityData("PEDOMETER",
	//		successCallbackPedo, errorCallback); 
}

//Call back function to read the heartrate data and the awake status fromm the sensors
function successCallbackHeart(hrminfo) {

	heartrate = hrminfo.heartRate;
	var timestamp = new Date().getTime();//timestamp of when the data was acquired
	//get the Sleep Monitor Api and the sleep status  
	tizen.humanactivitymonitor.getHumanActivityData("SLEEP_MONITOR",
			function successCallbackSleep(slinfo){
		sleepStatus = slinfo.status;
		var timestamp = new Date().getTime();
	
		//create the JSON to send 
		 heartrateJson = {
				"Smartwatch" : devID,
				"date" : timestamp,
				"reading" :  [heartrate.toString(), sleepStatus.toString()]
			};
		
	//	sendMsg(heartrateJson, hearRateHistoryURL); //send the heartrate and awake status as a JSON
		
			

	}, errorCallback);
			

	//if heartrate is being read
	if (heartrate > 0) {
		//Watch is equipped
		
		//send equipped JSON
		equippedJson = {
			"Smartwatch" : devID,
			"date" : timestamp,
			"equipped" : "1"
		};
		// sendMsg(equippedJson, equipmentHistoryURL);

	} else {
		//Watch is not equipped
		//send equipped JSON
		equippedJson = {
			"Smartwatch" : devID,
			"date" : timestamp,
			"equipped" : "0"
		};
		//send equippedJson 
		//sendMsg(equippedJson, equipmentHistoryURL);
	}
}

//Callback error to show error
function errorCallback(error) {
	// console.log('ee');
	switch (error.code) {
	case error.PERMISSION_DENIED:
		console.log("User denied the request for heartrate.");
		break;
	case error.TIMEOUT:
		console.log("The request to get user location timed out.");
		break;
	case error.UNKNOWN_ERROR:
		console.log("An unknown error occurred.");
		break;
	}
}


//Callback function when permissions request is successful
function successCallbackPer() {
	
	//Start the human activity sensors
	
	tizen.humanactivitymonitor.start('HRM');//start the heart rate
	tizen.humanactivitymonitor.start('SLEEP_MONITOR'); // starte the sleep monitor 
//	tizen.humanactivitymonitor.start('PEDOMETER');
	console.log('succes Permision');
	setInterval(sensorFunc, TimeInterval); //call sensorFunction with a time interval 
}

//function to request sensor permission
function requestPermissions() {
	tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo",
			successCallbackPer, errorCallback);
	console.log("request permission");

}
