var NoMsg = true; /* Global variable set to true when there are no messages */
var tau;/* Global Variable */
var getID = tizen.systeminfo.getCapabilities();
var devID = getID.duid.substring(0, 8);

// URL to create the smartwatch on the server
var smartWatchURL = "http://192.168.137.1:3001/API/smartwatch/create";

// Create a MQTT Client
var client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'messaging');
client.onMessageArrived = onMessageArrived;
// Define onConnectionLost function
client.onConnectionLost = onConnectionLost;
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:" + responseObject.errorMessage);
	}
}
// Connect the client and call onConnect if the connect call was successful
client.connect({
	onSuccess : onConnect
});

(function() {

	try {
		tizen.power
				.setScreenStateChangeListener(function(prevState, currState) {
					if (currState === 'SCREEN_NORMAL'
							&& prevState === 'SCREEN_OFF') {
						// when screen woke up
						var app = tizen.application.getCurrentApplication();
						tizen.application.launch(app.appInfo.id, function() {
							// you can do something here when your app have been
							// launch

						});
					}
				});
	} catch (e) {
	}
	// Intializing the variables by getting elements from the dom by ID
	var page = document.getElementById("hsectionchangerPage"), changer = document
			.getElementById("hsectionchanger"), sectionLength = document
			.querySelectorAll("section").length, elPageIndicator = document
			.getElementById("pageIndicator"), sectionChanger, pageIndicator, pageIndicatorHandler;

	/**
	 * pagebeforeshow event handler: does preparatory work and adds event
	 * listeners
	 */

	page.addEventListener("pagebeforeshow", function() {
		// Creating PageIndicator
		pageIndicator = tau.widget.PageIndicator(elPageIndicator, {
			numberOfPages : sectionLength
		});
		pageIndicator.setActive(0);
		// Creating SectionChanger object
		sectionChanger = tau.widget.SectionChanger(changer, {
			circular : false,
			orientation : "horizontal", // set the section scroller orientation
			useBouncingEffect : true
		});
		// Show an alert on load with the watchID
		alert("Watch Id is " + devID);
	});

	/**
	 * pagehide event handler: destroys and removes event listeners
	 */
	page.addEventListener("pagehide", function() {
		// release object
		sectionChanger.destroy();
	});

	/**
	 * sectionchange event handler
	 * 
	 * @param {Event}
	 *            e
	 */
	pageIndicatorHandler = function(e) {
		pageIndicator.setActive(e.detail.active);// sets the current page as
		// active
	};

	changer.addEventListener("sectionchange", pageIndicatorHandler, false);
	// adds a listener to changer that listens to the change in sections

}());

(function() {
	// adds an event listener that listens for the back hardware button
	window.addEventListener("tizenhwkey", function(ev) {
		var activePopup = null, page = null, pageId = "";
		// goes back a page or exits the popup
		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageId = page ? page.id : "";
			// exits the app on back button if the main page is reached and
			// there is no active popup
			if (pageId === "hsectionchangerPage" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}());

/**
 * 
 * @function initializaNoMsg
 * @desciption prints no messages on the start of the app and when called
 * 
 */
function initializeNoMsg() {
	console.log(devID);
	var temp = document.getElementById('message-view');
	if (NoMsg === true) {
		var eldiv = document.createElement('div');
		var elspan = document.createElement('span');
		elspan.classList.add('noMsgs');
		elspan.innerHTML = "No messages";
		eldiv.appendChild(elspan);
		temp.appendChild(eldiv);
	}
}

/**
 * @function makeMsg
 * @desciption generates the message HTML to be previewed
 * @param messageBody
 * @param msgFrom
 * @param id
 * @fires
 */
function makeMsg(msgFrom, messageBody, id) {
	console.log("making message");
	console.log(messageBody);

	var temp = document.getElementById('message-view');

	// removes all child elements if NoMsg==true
	if (NoMsg === true) {
		var deleteNoMsg = document.getElementsByClassName("noMsgs")[0].parentNode;
		temp.removeChild(deleteNoMsg);
		NoMsg = false;
	}
	// creates variables to name the elements ids
	var msgSenderid = "msgSender" + id;
	var checkboxid = "checkbox" + id;
	// creats the HTML string to be appended
	var s = "<div class=\"msgFrom\" id=\"" + msgSenderid + "\">" + msgFrom
			+ "</div><div class=\"msgContainer\"><div><span class=\"msg\">"
			+ messageBody + "</span></div><div><input type=\"checkbox\" id=\""
			+ checkboxid
			+ "\" class=\"checkboxes dismiss\"></div></div></div>";
	// creats the msg div Element to add the HTML to
	var msg = document.createElement("div");
	msg.setAttribute("id", id);// sets the id of the div element
	msg.innerHTML = s;// adds the HTMl inside the div element
	temp.appendChild(msg);// appends the msg Node Element to the parent Node
}

// called when the client connects
function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	console.log("connected");
	// subscribe to the topics
	client.subscribe("childMonitor/connect/"+devID);
	client.subscribe("childMonitor/message/"+devID);
	client.subscribe("childMonitor/messageDismissed/"+devID);
	// create watch ID to register watch
	watchIdJson = {
		"serialNumber" : devID,
		"active" : true
	};
	// register Watch
	sendMsg(watchIdJson, smartWatchURL);
}

function onMessageArrived(message) {
	console.log('Message Arrived');
	// string in JSON format
	console.log(message.payloadString);
	console.log(message.destinationName);
	// only if the message is from childMonitor/message
	if (message.destinationName == 'childMonitor/message/'+devID) {
		navigator.vibrate(1000); //vibrates when a message arrives
		alert("NEW MESSAGE!") //sends an alert when a message arrives
		var msg = JSON.parse(message.payloadString);
		console.log("message arrived");
		makeMsg(msg.from, msg.msg, msg.id)
	}
}
// Show watch id on click
$("#ShowId").on("click", function alertWatchID() {
	alert("Watch Id is " + devID);
});

// Dismiss message on click and delete its view for dynamically created
$("#message-view").on("click", ".dismiss", function r() {
	var lastChar = this.id.match(/\d+/g);
	// charecter of the id string
	var temp = document.getElementById('message-view');
	document.getElementById(lastChar.join()).remove();
	// removes the element with the id found
	var Dismissed = {
		"id" : lastChar
	};
	var message = new Paho.MQTT.Message(JSON.stringify(Dismissed));
	message.destinationName = "childMonitor/messageDismissed/"+devID;
	client.send(message);// publish message
	// if all messages are removed
	if (temp.childElementCount === 0) {
		alert("No new messages");// preview and alert
		NoMsg = true;
		initializeNoMsg();// display on the screen that there are no messages
	}
});

/**
 * @function sendMsg
 * @description sends the Msg to the server
 * @param body,
 *            url
 */
function sendMsg(body, url) {
	console.log(body);
	$.ajax({
		url : url,
		dataType : "json",
		type : "POST",
		contentType : 'application/json',
		data : JSON.stringify(body),
		processData : false,
		success : function(data, textStatus, jQxhr) {
			console.log('hi');
		},
		error : function(jqXhr, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}
window.init = initializeNoMsg();// calls intializeNoMsg once window is
// initilized
