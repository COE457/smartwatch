window.onload = requestPermissions();
var heartrate;
var hearRateHistoryURL = 'http://192.168.137.1:3001/API/heartRateHistory/create';
var equipmentHistoryURL = 'http://192.168.137.1:3001/API/equipmentHistory/create';

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

function sensorFunc() {
	tizen.humanactivitymonitor.getHumanActivityData("HRM",
			successCallbackHeart, errorCallback);
	tizen.humanactivitymonitor.getHumanActivityData("SLEEP_MONITOR",
			successCallbackSleep, errorCallback);
	tizen.humanactivitymonitor.getHumanActivityData("PEDOMETER",
			successCallbackPedo, errorCallback);
}

function successCallbackPedo(pedometerInfo) {
	console.log('Step status: ' + pedometerInfo.stepStatus);
	console.log('Speed: ' + pedometerInfo.speed);
	console.log('Walking frequency: ' + pedometerInfo.walkingFrequency);

	var stepStatus = pedometerInfo.stepStatus;
	var speedStatus = pedometerInfo.speed;
	var walkingStatus = pedometerInfo.walkingFrequency;

	var timestamp = new Date().getTime();

	var statusJson = {
		"Smartwatch" : "82e94aeab1c552f8f251a53a9b0065e6",
		"date" : timestamp,
		"stepStatus" : stepStatus,
		"speedStatus" : speedStatus,
		"walkingStatus" : walkingStatus
	};
	// sendMsg(sleepJson, sleepHistoryURL);

	/* Deregisters a previously registered listener */
	tizen.humanactivitymonitor.unsetAccumulativePedometerListener();
}

function successCallbackSleep(slinfo) {
	sleepStatus = slinfo.status;
	var timestamp = new Date().getTime();

	var sleepJson = {
		"Smartwatch" : "82e94aeab1c552f8f251a53a9b0065e6",
		"date" : timestamp,
		"sleeping" : sleepStatus
	};
	// sendMsg(sleepJson, sleepHistoryURL);

}

function successCallbackHeart(hrminfo) {

	heartrate = hrminfo.heartRate;
	var timestamp = new Date().getTime();
	var equippedJson;
	var heartrateJson = {
		"Smartwatch" : "82e94aeab1c552f8f251a53a9b0065e6",
		"date" : timestamp,
		"reading" : heartrate.toString()
	};

	// sendMsg(heartrateJson, hearRateHistoryURL);

	if (heartrate > 0) {
		equippedJson = {
			"Smartwatch" : "82e94aeab1c552f8f251a53a9b0065e6",
			"date" : timestamp,
			"equipped" : true
		};
		// sendMsg(equipped, equipmentHistoryURL);

	} else {
		equippedJson = {
			"Smartwatch" : "82e94aeab1c552f8f251a53a9b0065e6",
			"date" : timestamp,
			"equipped" : false
		};
		// sendMsg(equipped, equipmentHistoryURL);
	}
}

function errorCallback(error) {
	// console.log('ee');
	switch (error.code) {
	case error.PERMISSION_DENIED:
		console.log("User denied the request for heartrate.");
		break;
	// FIX HERE
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
	tizen.humanactivitymonitor.start('PEDOMETER');
	console.log('succes Permision');
	setInterval(sensorFunc, 1000 * 1);
}

function requestPermissions() {
	tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo",
			successCallbackPer, errorCallback);
	console.log("request permission");

}
