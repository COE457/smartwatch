
/*global window, tizen, console*/

/**
 * Main application module. Provides a namespace for other application modules.
 * Handles application life cycle.
 * 
 * @module app
 * @requires {@link app.model}
 * @namespace app
 */

window.app = window.app || {};

var getID = tizen.systeminfo.getCapabilities();
var devID = getID.duid.substring(0,8);
// strict mode wrapper
(function defineApp(app) {
	'use strict';

	/**
	 * Exits application.
	 * 
	 * @memberof app
	 * @public
	 */
	function exitApplication() {
		try {
			tizen.application.getCurrentApplication().exit();
		} catch (e) {
			console.error('Error:', e.message);
		}
	}

	/**
	 * Handles tizenhwkey event.
	 * 
	 * @memberof app
	 * @private
	 * @param {Event}
	 *            event
	 */
	function onHardwareKeysTap(event) {
		if (event.keyName === 'back') {
			exitApplication();
		}
	}

	/**
	 * Binds events.
	 * 
	 * @memberof app
	 * @private
	 */
	function bindEvents() {
		window.addEventListener('tizenhwkey', onHardwareKeysTap);
	}

	/**
	 * Initializes application.
	 * 
	 * @memberof app
	 * @private
	 */
	function init() {
		bindEvents();
		app.model.init();
	}
	var clieanLight = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'lightSensor');
	clieanLight.connect({
		onSuccess : onConnect
	});
	clieanLight.onConnectionLost = onConnectionLost;
	function onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			console.log("onConnectionLost:" + responseObject.errorMessage);
		}
	}
	// called when the client connects
	function onConnect() {
		// Once a connection has been made, make a subscription and send a
		// message.
		console.log("connected");
		clieanLight.subscribe("childMonitor/sensors/"+devID+"/lightSensorHistory");
		console.log("subscribed");

		setInterval(sendLight, 1000*10);
		function sendLight() {

			app.model.getSensorValue(function onSensorValueReceived(sensorData) {

						var timestamp = new Date().getTime();
						// create a JSON to send
						var lightJson = {
							"Smartwatch" : devID,
							"date" : timestamp,
							"reading" : sensorData.lightLevel + 'lx'
						}
						var message = new Paho.MQTT.Message(JSON.stringify(lightJson));
						message.destinationName = "childMonitor/sensors/"+devID+"/lightSensorHistory";
						clieanLight.send(message); // publish message
						console.log("message sent");
					}, err => {console.log(err)});
		}

	}
	clieanLight.onMessageArrived = onMessageArrived;

	function onMessageArrived(message) {
		console.log('Message Arrived');
	}

	window.addEventListener('load', init);
}(window.app));
