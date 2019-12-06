window.onload = requestPermissions();//request permission on load

//URL paths to send the heartrate, equipment and awake status 
var locationHistoryURL ="http://192.168.137.1:3001/API/locationHistory/create";

var TimeInterval= 1000*10;

var client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'sensors');
var getID = tizen.systeminfo.getCapability();
var devID = getID.duid.substring(0,5);
var locationJson={
		"Smartwatch":devID,
		"location":["n/a","n/a"],
		"date":"n/a",
		"currentlyThere":true};

client.connect({
	onSuccess : onConnect
});

function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	console.log("connected");
	client.subscribe("watch2/locationHistory");	
	setInterval(function sendJson(){
	var location = new Paho.MQTT.Message(JSON.stringify(locationJson));
	location.destinationName = "watch2/locationHistory";
	client.send(location);// publish message
	console.log("location sent");
	}, TimeInterval);
}


//function that sends the message using ajax through HTTP request
function sendMsg(body, url)
{
	console.log(body);
	$.ajax({
		url:url ,
		dataType: "json",
		type: "POST",
		contentType: 'application/json',
		data: JSON.stringify(body),
		processData: false,
		success: function( data, textStatus, jQxhr ){
		},
		error: function( jqXhr, textStatus, errorThrown ){
			console.log(errorThrown);
		}
	});
}

//Call back function to read the postion longitude and latitude data 
function successCallback(position) {
    //console.log(position);
    var timestamp=position.timestamp;
	var longitude=position.coords.longitude; 
	var latitude= position.coords.latitude;
	  console.log(longitude);
	  console.log(latitude);  
	//  console.log(timestamp);  
	//  GetLocation(longitude, latitude);
	  locationJson={"Smartwatch":devID, "location":[latitude,longitude],"date":timestamp, "currentlyThere":true};
		//sendMsg(locationJson, locationHistoryURL);

	}


//Callback function when permissions request is successful
function successCallbackPer() {
	setInterval(watchFunc,TimeInterval);//call watchFunc with a time interval 
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
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    console.log("Geolocation is not supported.");
  }
}


//function to request location permission
function requestPermissions(){
tizen.ppm.requestPermission("http://tizen.org/privilege/location",successCallbackPer, errorCallback);
}

