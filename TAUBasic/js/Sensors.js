window.onload = requestPermissions(); // request permission on load
//global vairables
var heartrate;
var heartrateJson = {
	"Smartwatch" : devID,
	"date" : "n/a",
	"reading" : [ "n/a", "n/a" ]
};
var equippedJson = {
	"Smartwatch" : devID,
	"date" : "n/a",
	"equipped" : "n/a"
};
//Get the smartwatch ID
var getID = tizen.systeminfo.getCapabilities();
var devID = getID.duid.substring(0, 8);
//Create a MQTT Client
var clientHR = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'sensors');
//Define onConnectionLost function
clientHR.onConnectionLost = onConnectionLost;
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:" + responseObject.errorMessage);
	}
}
//Connect the client and call onConnect if the connect call was successful
clientHR.connect({
	onSuccess : onConnect
});
//Define the onConnect function
function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	console.log("connected");
	clientHR.subscribe("childMonitor/sensors/"+devID+"/heartRateHistory");
	clientHR.subscribe("childMonitor/sensors/"+devID+"/equipmentHistory");
	//call the sendHR function every 10 secs
	setInterval(sendHR, 10 * 1000);
	//define sendHR to publish the heartrate and equipment JSONs to MQTT
	function sendHR() {
		var heartRate = new Paho.MQTT.Message(JSON.stringify(heartrateJson));
		heartRate.destinationName = "childMonitor/sensors/"+devID+"/heartRateHistory";
		clientHR.send(heartRate);// publish message
		console.log("HR sent");

		var equipment = new Paho.MQTT.Message(JSON.stringify(equippedJson));
		equipment.destinationName = "childMonitor/sensors/"+devID+"/equipmentHistory";
		clientHR.send(equipment);// publish message
		console.log("equip sent");
	}
}
// This function gets the sesnsor API
function sensorFunc() {
	// calls the success callback if the sesnor is there otherwise calls error
	// callback
	tizen.humanactivitymonitor.getHumanActivityData("HRM",
			successCallbackHeart, errorCallback); // HeartRate API
}

// Call back function to read the heartrate data and the awake status fromm the
// sensors
function successCallbackHeart(hrminfo) {
	heartrate = hrminfo.heartRate;//ger the heartRate
	var timestamp = new Date().getTime();// timestamp of when the data was acquired

	// get the Sleep Monitor Api and the sleep status
	tizen.humanactivitymonitor
			.getHumanActivityData("SLEEP_MONITOR",
					function successCallbackSleep(slinfo) {
						sleepStatus = slinfo.status;
						var timestamp = new Date().getTime();

						// create the JSON to send
						heartrateJson = {
							"Smartwatch" : devID,
							"date" : timestamp,
							"reading" : [ heartrate.toString(),
									sleepStatus.toString() ]
						};
					}, errorCallback);

	// if heartrate is being read
	if (heartrate > 0) { // Watch is equipped
		// create equipped JSON
		equippedJson = {
			"Smartwatch" : devID,
			"date" : timestamp,
			"equipped" : "1"
		};
	} else { // Watch is not equipped
		// send equipped JSON
		equippedJson = {
			"Smartwatch" : devID,
			"date" : timestamp,
			"equipped" : "0"
		};
	}
}

// Callback error to show error
function errorCallback(error) {
	switch (error.code) {
	case error.PERMISSION_DENIED:
		console.log("User denied the request for heartrate.");
		break;
	case error.TIMEOUT:
		console.log("The request to get user heartrate timed out.");
		break;
	case error.UNKNOWN_ERROR:
		console.log("An unknown error occurred.");
		break;
	}
}

// Callback function when permissions request is successful
function successCallbackPer() {
	// Start the human activity sensors
	// start the heart rate
	tizen.humanactivitymonitor.start('HRM');
	// start the sleep monitor
	tizen.humanactivitymonitor.start('SLEEP_MONITOR');
	console.log('succes Permision');
	// call sensorFunction with a time interval
	setInterval(sensorFunc, 1000 * 6);
}

// function to request sensor permission
function requestPermissions() {
	tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo",
			successCallbackPer, errorCallback);
	console.log("request permission");

}
