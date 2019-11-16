//window.onload = startSensor();
//
//var lightSensorHistoryURL= 'http://192.168.137.1:3001/API/lightSensorHistory/create';
//function sendMsg(body, url) {
//	$.ajax({
//		url : url,
//		dataType : "json",
//		type : "POST",
//		contentType : 'application/json',
//		data : JSON.stringify(body),
//		processData : false,
//		success : function(data, textStatus, jQxhr) {
//			console.log(data);
//		},
//		error : function(jqXhr, textStatus, errorThrown) {
//			console.log(errorThrown);
//		}
//	});
//}
//function startSensor(){
//	var lightSensor  = tizen.sensorservice.getDefaultSensor("LIGHT");
//	console.log('succes Permision');
//	lightSensor.start();
//	
//	 //lightSensor.getLightSensorData(onGetSuccessCB);
//    console.log('ugggh');
//
//	var sensorData = lightSensor.getLightSensorData();
//    console.log('light level: ' + sensorData.lightLevel);
//
//
//}
//
//function onGetSuccessCB(sensorData) {
//    console.log('light level: ' + sensorData.lightLevel);
//    var lightLevel= sensorData.lightLevel;
//	var timestamp = new Date().getTime();
//    var lightJson={
//    		"Smartwatch" : "16e331e82ea91fee7b03f0be9001a3cd",
//    		"date" : timestamp,
//    		"reading" : lightLevel		
//    }
//    sendMsg(lightJson, lightSensorHistoryURL)
//}
//
//function onsuccessCB() {
//   console.log('sensor started');
// lightSensor.getLightSensorData(onGetSuccessCB);
//  // lightSensor.stop();
//}
//
//
//function errorCallback(error) {
//	// console.log('ee');
//	switch (error.code) {
//	case error.PERMISSION_DENIED:
//		console.log("User denied the request for heartrate.");
//		break;
//	// FIX HERE
//	case error.POSITION_UNAVAILABLE:
//		console.log("Location information is unavailable.");
//		break;
//	case error.TIMEOUT:
//		console.log("The request to get user location timed out.");
//		break;
//	case error.UNKNOWN_ERROR:
//		console.log("An unknown error occurred.");
//		break;
//	}
//}
