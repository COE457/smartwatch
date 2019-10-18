/*global tau */
/*
 * Detects swipe event.
 * If user doing swipe, this function measure it is swipe or not.
 * Swipe is made by touch events.
 * Calculate touch start and end event with position.
 * @public
 */

(function() {
	 
	var page = document.getElementById("hsectionchangerPage"), 
	changer = document.getElementById("hsectionchanger"),
	sectionLength = document.querySelectorAll("section").length,
	elPageIndicator = document.getElementById("pageIndicator"),
	sectionChanger, pageIndicator, pageIndicatorHandler;

	//document.getElementById('msg').setAttribute('tizen-circular-scrollbar', '');
	
	
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



function remove(id){
	var lastChar = id[id.length -1];
	var temp= document.getElementById('message-view');

	document.getElementById('msgSender'+lastChar).remove();
	document.getElementById('msg'+lastChar).remove();
	if (temp.childElementCount===0) {
		alert("No new messages");
		var eldiv = document.createElement('div');
		var elspan=document.createElement('span');
		elspan.classList.add('noMsgs');
		elspan.innerHTML = "No messages";
		eldiv.appendChild(elspan);
		temp.appendChild(eldiv);
	}
}