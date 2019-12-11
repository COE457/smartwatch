window.onload = requestPermissions();//request permission on load
//Get the smartwatch ID
var getID = tizen.systeminfo.getCapabilities();
var devID = getID.duid.substring(0, 8);
//define global variables
var longitude;
var latitude;
var locationJson = {
	"Smartwatch" : devID,
	"location" : [ "n/a", "n/a" ],
	"date" : "n/a",
};
//Create a MQTT Client
var clientLoc = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'location');
//Define onConnectionLost function
clientLoc.onConnectionLost = onConnectionLost;
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:" + responseObject.errorMessage);
	}
}
//Connect the client and call onConnect if the connect call was successful
clientLoc.connect({
	onSuccess : onConnect
});
//Define the onConnect function
function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	console.log("connected");
	clientLoc.subscribe("childMonitor/sensors/"+devID+"/panicHistory");
	clientLoc.subscribe("childMonitor/sensors/"+devID+"/locationHistory");
	//call the sendLocation function every 10 secs
	setInterval(sendLocation, 1000 * 6);
	//define sendLocation to publish the heartrate and equipment JSONs to MQTT
	function sendLocation() {
		var location = new Paho.MQTT.Message(JSON.stringify(locationJson));
		location.destinationName = "childMonitor/sensors/"+devID+"/locationHistory";
		clientLoc.send(location);// publish message
		console.log("location sent");
	}
}

//Call back function to read the postion longitude and latitude data 
function successCallback(position) {
	var timestamp = position.timestamp;
	longitude = position.coords.longitude;
	latitude = position.coords.latitude;
	locationJson = {
		"Smartwatch" : devID,
		"location" : [ latitude, longitude ],
		"date" : timestamp
	};
}

//Callback function when permissions request is successful
function successCallbackPer() {
	setInterval(watchFunc, 1000 * 6);//call watchFunc with a time interval 
}

//Callback error to show error
function errorCallback(error) {
	switch (error.code) {
	case error.PERMISSION_DENIED:
		console.log("User denied the request for Geolocation.");
		break;
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

//get the location and current positions from the watch GPS  API
function watchFunc() {
	if (navigator.geolocation) {
		navigator.geolocation
				.getCurrentPosition(successCallback, errorCallback);
	} else {
		console.log("Geolocation is not supported.");
	}
}

//function to request location permission
function requestPermissions() {
	tizen.ppm.requestPermission("http://tizen.org/privilege/location",
			successCallbackPer, errorCallback);
}

//Add a onClick function to the button with the SOS id
$("#SOS").on("click", function sendSOSAlert() {
	// Send to parents and alert
	var timestamp = new Date().getTime();
	var panicJson = {
		"Smartwatch" : devID,
		"date" : timestamp,
		"dismissed" : "0",
		"location" : [ latitude, longitude ]
	};
	// send SOS message to MQTT 
	var sos = new Paho.MQTT.Message(JSON.stringify(panicJson));
	sos.destinationName = "childMonitor/sensors/"+devID+"/panicHistory";
	clientLoc.send(sos);// publish message
	console.log("sos sent");
});
