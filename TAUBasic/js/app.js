var NoMsg = false; /* Global variable set to true when there are no messages */
var tau;/* Global Variable */
var id = 0;/*
				 * Global variable to set the messages id and increment it with
				 * every message, acts as the id received from the webportal
				 */

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

	changer.addEventListener("sectionchange", pageIndicatorHandler, false);// adds
																			// a
																			// listener
																			// to
																			// changer
																			// that
																			// listens
																			// to
																			// the
																			// change
																			// in
																			// sections

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
 * @function remove
 * @desciption removes the message by id, checks if there are no msgs to call initializeNoMsg() and then calls sendPromise
 * @param id:
 * @fires initializeNoMsg()
 * @fires sendPromise
 * 
 */
function remove(id) {

	var lastChar = id[id.length - 1];//gets the id number from the last charecter of the id string
	var temp = document.getElementById('message-view');
	document.getElementById(lastChar).remove();//removes the element with the id found
	//if all messages are removed
	if (temp.childElementCount === 0) {
		alert("No new messages");//preview and alert
		NoMsg = true;
		initializeNoMsg();//display on the screen that there are no messages
	}
	sendPromise(id);//send back to portal that the msg has been read
}

/**
 * @function receiveMsg
 * @description 
 * @fires makeMsg
 * 
 */
function receiveMsg() {
	//receives msg from webportal, parses the message to get the msgFrom and messageBody var
	var msgFrom, messageBody, id;
	makeMsg(msgFrom, messageBody, id);//creates the msg HTML depending on the message body and messafe sender
	idcount++;//increment id counter to have distinct messages

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
	var temp = document.getElementById('message-view');
	//removes all child elements if NoMsg==true 
	if (NoMsg === true) {
		while (temp.childElementCount !== 0) {
			temp.removeChild();
		}
		NoMsg = false;
	}
//creates variables to name the elements ids
	var msgSenderid = "msgSender" + id;
	var popupid = "Popup" + id;
	var checkboxid = "checkbox" + id;
	var cancelbtnid = "2btnPopup-cancel" + id;
	var OKbtnid = "2btnPopup-OK" + id;
//creats the HTML string to be appended 
	var s = "<div class=\"msgFrom\" id=\""
			+ msgSenderid
			+ "\">"
			+ msgFrom
			+ "</div><div class=\"msgContainer\"><div><span class=\"msg\">Lunch is ready</span></div><div><a href=\"#"
			+ popupid
			+ "\" data-rel=\"popup\"> <input type=\"checkbox\" id=\""
			+ checkboxid
			+ "\" class=\"checkboxes\"</a></div><div id=\""
			+ popupid
			+ "\" class=\"ui-popup\"><div class=\"ui-popup-content\">Dismiss Message?</div><div class=\"ui-popup-footer ui-grid-col-2\"><a id=\""
			+ OKbtnid
			+ "\" data-role=\"button\" class=\"ui-btn\"onclick=\"remove(this.id)\">OK</a> <a id=\""
			+ cancelbtnid
			+ "\"data-role=\"button\" class=\"ui-btn\" data-rel=\"back\"data-inline=\"true\">Cancel</a></div></div></div>";
	//creats the msg div Element to add the HTML to
	var msg = document.createElement("div");
	msg.setAttribute("id", idcount);//sets the id of the div element
	msg.innerHTML = s;// adds the HTMl inside the div element
	temp.appendChild(msg);//appends the msg Node Element to the parent Node

}
/**
 * 
 * @function sendPromise
 * @desciption sends back to the web portal that the kid has accepted the message
 * @param id
 * 
 */

function sendPromise(id) {
//Send back to web portal the id of the message resolved
}
/**
 * 
 * @function sendSOSAlert
 * @desciption sends and Alert to parents
 * @param
 */
function sendSOSAlert() {
//Send to parents and alert
}

window.init = initializeNoMsg();//calls intializeNoMsg once window is initilized
