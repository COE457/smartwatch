window.onload = requestPermissions();//request permission on load

//URL paths to send the heartrate, equipment and awake status 
var locationHistoryURL ="http://192.168.137.1:3001/API/locationHistory/create";

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
	  GetLocation(longitude, latitude);
	  var locationJson={"Smartwatch":"16e331e82ea91fee7b03f0be9016d3ef", "location":[latitude,longitude],"date":timestamp, "currentlyThere":true};
		sendMsg(locationJson, locationHistoryURL);

	}

//Get the location from an online API through http
function GetLocation(longitude, latitude){
	  var xmlhttp, xmlDoc, dataItem;
	  xmlhttp = new XMLHttpRequest();
	  //API URL
	  var URL ='https://api.opencagedata.com/geocode/v1/json?q='+latitude+','+longitude+'&pretty=1&key=32ebbd8dfcf2487983263e43187d97de';
	  xmlhttp.open("GET",URL , false);
	  xmlhttp.onreadystatechange = function() {
	      if (xmlhttp.readyState === 4) {
	          if (xmlhttp.status === 200) {
	              //xmlDoc = xmlhttp.responseXML;
	              var data = JSON.parse(xmlhttp.responseText);
	              console.log(data.results[0].formatted);
	          }
	          else if (xmlhttp.status <= 500){ 
	              // We reached our target server, but it returned an error                               
	              console.log("unable to geocode! Response code: " + xmlhttp.status);
	              var data = JSON.parse(xmlhttp.responseText);
	              console.log(data.status.message);
	            } else {
	              console.log("server error");
	            }
	      }
	  };
	  xmlhttp.send();
}

//Callback function when permissions request is successful
function successCallbackPer() {
	setInterval(watchFunc, 1000*6);//call watchFunc with a time interval 
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

function stopWatchFunc() {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  } else {
    console.log("Geolocation is not supported.");
  }
}

//function to request location permission
function requestPermissions(){
tizen.ppm.requestPermission("http://tizen.org/privilege/location",successCallbackPer, errorCallback);
}

