
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
	var client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'lightSensor');

	// called when the client connects
	function onConnect() {
		// Once a connection has been made, make a subscription and send a
		// message.
		console.log("connected");
		client.subscribe("watch2/lightSensor");
		console.log("subscribed");

		var message = new Paho.MQTT.Message("Watch ready hehe!");
		console.log(message.payloadString);
		message.destinationName = "watch2/lightSensor";
		client.send(message); // publish message
		console.log("message sent");

		setInterval(sendLight, 1000 * 6);
		function sendLight() {
			app.model
					.getSensorValue(function onSensorValueReceived(sensorData) {
						var timestamp = new Date().getTime();
						var lightJson = {
							"Smartwatch" : "16e331e82ea91fee7b03f0be9001a3cd",
							"date" : timestamp,
							"reading" : sensorData.lightLevel + 'lx'
						}
						console.log(lightJson);
						var message = new Paho.MQTT.Message(JSON.stringify(lightJson));
						message.destinationName = "watch2/lightSensor";
						client.send(message); // publish message
						console.log("message sent");
					});
		}

	}
	client.onMessageArrived = onMessageArrived;

	function onMessageArrived(message) {
		console.log('Message Arrived');
		// var msg = JSON.parse(message.payloadString); //only if the message is
		// a string in JSON format
		console.log(message.payloadString);
		if (message.destinationName == 'watch2/lightSensor') {
			console.log("message arrived");
		} else {
			tizen.application.getCurrentApplication().exit();
		}
	}

	client.connect({
		onSuccess : onConnect
	});

	window.addEventListener('load', init);
}(window.app));
