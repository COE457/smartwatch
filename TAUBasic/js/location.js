window.onload = requestPermissions();

function successCallback(position) {
    //console.log(position);
    var timestamp=position.timestamp;
	var longitude=position.coords.longitude; 
	var latitude= position.coords.latitude;
	  console.log(longitude);
	  console.log(latitude);  
	  console.log(timestamp);  
	  GetLocation(longitude, latitude);
	}

function GetLocation(longitude, latitude){
	  var xmlhttp, xmlDoc, dataItem;
	  xmlhttp = new XMLHttpRequest();
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
function successCallbackPer() {
	setInterval(watchFunc, 1000*1);
}

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

function requestPermissions(){
	console.log("I was called");
tizen.ppm.requestPermission("http://tizen.org/privilege/location",successCallbackPer, errorCallback);
}

