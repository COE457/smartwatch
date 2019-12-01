var NoMsg = false; /* Global variable set to true when there are no messages */
var tau;/* Global Variable */
var id = 5;/*
 * Global variable to set the messages id and increment it with
 * every message, acts as the id received from the webportal
 */
var panicHistoryURL = "http://192.168.137.1:3001/API/panicHistory/create";
var client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'watch2/connect');
client.connect({
	onSuccess : onConnect
});

client.onMessageArrived = onMessageArrived;

(function() {
	

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
 * @function receiveMsg
 * @description
 * @fires makeMsg
 * 
 */
function receiveMsg() {
	// receives msg from webportal, parses the message to get the msgFrom and
	// messageBody var
	var msgFrom, messageBody, id;
	makeMsg(msgFrom, messageBody, id);// creates the msg HTML depending on the
	// message body and messafe sender
	id++;// increment id counter to have distinct messages

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
	var popupid = "Popup" + id;
	var checkboxid = "checkbox" + id;
	var cancelbtnid = "btnPopup-cancel" + id;
	var OKbtnid = "btnPopup-OK" + id;
	// creats the HTML string to be appended
	var s = "<div class=\"msgFrom\" id=\""
			+ msgSenderid
			+ "\">"
			+ msgFrom
			+ "</div><div class=\"msgContainer\"><div><span class=\"msg\">"
			+ messageBody
			+ "</span></div><div><a href=\"#"
			+ popupid
			+ "\" data-rel=\"popup\"> <input type=\"checkbox\" id=\""
			+ checkboxid
			+ "\" class=\"checkboxes\"</a></div><div id=\""
			+ popupid
			+ "\" class=\"ui-popup\"><div class=\"ui-popup-content\">Dismiss Message?</div><div class=\"ui-popup-footer ui-grid-col-2\"><a id=\""
			+ OKbtnid
			+ "\" data-role=\"button\" class=\"ui-btn dismiss\">OK</a> <a id=\""
			+ cancelbtnid
			+ "\"data-role=\"button\" class=\"ui-btn \" data-rel=\"back\">Cancel</a></div></div></div>";
	// creats the msg div Element to add the HTML to
	var msg = document.createElement("div");
	msg.setAttribute("id", id);// sets the id of the div element
	msg.innerHTML = s;// adds the HTMl inside the div element
	temp.appendChild(msg);// appends the msg Node Element to the parent Node
	id = id + 1;
}

// called when the client connects
function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	console.log("connected");
	
	client.subscribe("watch2/connect");
	client.subscribe("watch2/message");

	client.subscribe("watch2/msgDismissed");

	var message = new Paho.MQTT.Message("Watch ready!");
	message.destinationName = "watch2/connect";
	client.send(message);// publish message
}

// called when the client connects
//function onConnectDismiss() {
//	// Once a connection has been made, make a subscription and send a message.
//	console.log("connected dismiss");
//	client.subscribe("watch2/msgDismissed");
//	var message = new Paho.MQTT.Message("Dimissied connected");
//	message.destinationName = "watch2/msgDismissed";
//	clientDismiss.send(message);// publish message
//}

function onMessageArrived(message) {
	console.log('Message Arrived');
	// string in JSON format
	
	console.log(message.payloadString);
	console.log(message.destinationName);
	if (message.destinationName == 'watch2/message') {
		var msg = JSON.parse(message.payloadString); //only if the message is a
		console.log("message arrived");
		makeMsg(msg.from, msg.msg, msg.id)
		id++;
	} else {
		// tizen.application.getCurrentApplication().exit();
	}
}



/**
 * 
 * @function sendSOSAlert
 * @desciption sends and Alert to parents onClick
 * @param
 * @fires sendMsg()
 */
$("#SOS").on("click", function sendSOSAlert() {
	// Send to parents and alert
	var timestamp = new Date().getTime();
	var panicJson = {
		"Smartwatch" : "16e331e82ea91fee7b03f0be9017903a",
		"date" : timestamp,
		"dismissed" : "0"
	};
	sendMsg(panicJson, panicHistoryURL);
});


$("#message-view").on("click", ".dismiss", function r() {
	//var lastChar = this.id[this.id.length - 1];// gets the id number from the
	var lastChar = this.id.match(/\d+/g);

	// charecter of the id string
	var temp = document.getElementById('message-view');
	document.getElementById(lastChar.join()).remove();// removes the element with the
	// id found
	var message = new Paho.MQTT.Message("Dimissied " + id);
	message.destinationName = "watch2/msgDismissed";
	client.send(message);// publish message
	// if all messages are removed
	if (temp.childElementCount === 0) {
		alert("No new messages");// preview and alert
		NoMsg = true;
		initializeNoMsg();// display on the screen that there are no messages
	}

});


$(".dismiss").on("click", function remove() {

	//var lastChar = this.id[this.id.length - 1];// gets the id number from the charecter of the id string
	var lastChar = this.id.match(/\d+/g);
	var temp = document.getElementById('message-view');
	document.getElementById(lastChar.join()).remove();// removes the element with the
	// id found

	var message = new Paho.MQTT.Message("Dimissied "+ lastChar);
	message.destinationName = "watch2/msgDismissed";
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
