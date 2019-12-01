/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global window, tizen, console*/

/**
 * Application model module.
 * It is responsible for initializing and managing light sensor.
 *
 * @module app.model
 * @namespace app.model
 * @memberof app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppModel(app) {
    'use strict';

    /**
     * Sensor type constant string.
     *
     * @memberof app.model
     * @private
     * @const {string}
     */
    var SENSOR_TYPE = 'LIGHT',

        /**
         * Maximal signal strength.
         *
         * @memberof app.model
         * @private
         * @const {number}
         */
        MAX_SIGNAL_STRENGTH = 65535,

        /**
         * Stores initialized sensor.
         *
         * @memberof app.model
         * @private
         * @type {LightSensor}
         */
        sensor = null;

    /**
     * Gets sensor state.
     * Calls callback when done with obtained object.
     *
     * @memberof app.model
     * @public
     * @param {function} onGetSuccessCB Success callback.
     */
    function getSensorValue(onGetSuccessCB) {
        if (!sensor) {
            return;
        }

        sensor.start(
            function onSensorStart() {
                sensor.getLightSensorData(
                    onGetSuccessCB,
                    function onError(err) {
                        console.error('Getting light sensor data failed.',
                            err.message);
                    }
                );
                sensor.stop();
            },
            function onError(err) {
                console.error('Could not start light sensor.',
                    err.message);
            }
        );
    }

    /**
     * Initializes model.
     *
     * @memberof app.model
     * @public
     */
    function init() {
        try {
            sensor = tizen.sensorservice.getDefaultSensor(SENSOR_TYPE);
        } catch (err) {
            console.error('Could not access light sensor.',
                err.message);
        }
    }

    app.model = {
        MAX_SIGNAL_STRENGTH: MAX_SIGNAL_STRENGTH,
        init: init,
        getSensorValue: getSensorValue
    };

}(window.app));

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
