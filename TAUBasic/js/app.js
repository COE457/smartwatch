var NoMsg = false;
var tau;
var idcount=0;
(function() {

	var page = document.getElementById("hsectionchangerPage"), changer = document
			.getElementById("hsectionchanger"), sectionLength = document
			.querySelectorAll("section").length, elPageIndicator = document
			.getElementById("pageIndicator"), sectionChanger, pageIndicator, pageIndicatorHandler;

	/**
	 * pagebeforeshow event handler Do preparatory works and adds event
	 * listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		// make PageIndicator
		pageIndicator = tau.widget.PageIndicator(elPageIndicator, {
			numberOfPages : sectionLength
		});
		pageIndicator.setActive(0);
		// make SectionChanger object
		sectionChanger = tau.widget.SectionChanger(changer, {
			circular : false,
			orientation : "horizontal",
			useBouncingEffect : true
		});
	});

	/**
	 * pagehide event handler Destroys and removes event listeners
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
		pageIndicator.setActive(e.detail.active);
	};

	changer.addEventListener("sectionchange", pageIndicatorHandler, false);

}());



(function() {
	window.addEventListener("tizenhwkey", function(ev) {
		var activePopup = null, page = null, pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageId = page ? page.id : "";

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
 * @function remove
 * @desciption generates the message to be previewed
 * @param messageBody:
 *            object
 * @fires sendPromise
 * 
 */
function intializeNoMsg() {
	var temp = document.getElementById('message-view');
	if (NoMsg === true) {
		  var eldiv = document.createElement('div'); var
		  elspan=document.createElement('span');
		  elspan.classList.add('noMsgs'); elspan.innerHTML = "No messages";
		  eldiv.appendChild(elspan); temp.appendChild(eldiv);
		 
	}

}

function remove(id) {

	var lastChar = id[id.length - 1];
	var temp = document.getElementById('message-view');
	document.getElementById(lastChar).remove();
	if (temp.childElementCount === 0) {
		alert("No new messages");
		var eldiv = document.createElement('div');
		var elspan = document.createElement('span');
		elspan.classList.add('noMsgs');
		elspan.innerHTML = "No messages";
		eldiv.appendChild(elspan);
		temp.appendChild(eldiv);
		NoMsg = true;
	}

}

/**
 * @function genMsg
 * @desciption generates the message to be previewed
 * @param messageBody:
 *            object
 * @fires
 */
function receiveMsg(msgFrom, messageBody) {
	makeMsg(msgFrom, messageBody);
	idcount++;

}

function makeMsg(msgFrom, messageBody) {
	var temp = document.getElementById('message-view');
	if (NoMsg === true) {
		while (temp.childElementCount !== 0) {
			temp.removeChild();
		}
		NoMsg = false;
	}

	var msgSenderid="msgSender"+idcount;
	var popupid= "Popup"+idcount;
	var checkboxid="checkbox"+idcount;
	var cancelbtnid="2btnPopup-cancel"+idcount;
	var OKbtnid="2btnPopup-OK"+idcount;

	var s = "<div class=\"msgFrom\" id=\""+msgSenderid+"\">"+msgFrom+"</div><div class=\"msgContainer\"><div><span class=\"msg\">Lunch is ready</span></div><div><a href=\"#"+popupid+"\" data-rel=\"popup\"> <input type=\"checkbox\" id=\""+checkboxid+"\" class=\"checkboxes\"</a></div><div id=\""+popupid+"\" class=\"ui-popup\"><div class=\"ui-popup-content\">Dismiss Message?</div><div class=\"ui-popup-footer ui-grid-col-2\"><a id=\""+OKbtnid+"\" data-role=\"button\" class=\"ui-btn\"onclick=\"remove(this.id)\">OK</a> <a id=\""+cancelbtnid+"\"data-role=\"button\" class=\"ui-btn\" data-rel=\"back\"data-inline=\"true\">Cancel</a></div></div></div>";
	var msg = document.createElement("div");
	msg.setAttribute("id",idcount);
	msg.innerHTML=s;
	temp.appendChild(msg);

}
/**
 * 
 * @function
 * @desciption
 * @param
 * 
 */
function sendPromise(id) {

}
/**
 * 
 * @function
 * @desciption
 * @param
 * 
 */
function sendSOSAlert() {

}

window.init = intializeNoMsg();
