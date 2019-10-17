/*global tau */
/*
 * Detects swipe event.
 * If user doing swipe, this function measure it is swipe or not.
 * Swipe is made by touch events.
 * Calculate touch start and end event with position.
 * @public
 */

/*exported swipedetect*/

function swipedetect (el, callback){

    var touchsurface = el,
        swipedir,
        startX,
        startY,
        dist,
        distX,
        distY,
        threshold = 100, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function(){};

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        swipedir = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
    }, false);

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir);
    }, false);
}

var indexScrollbarElement = document.getElementById('indexscrollbar');

if (!tau.support.shape.circle) {
	/* Create IndexScrollbar */
	indexScrollbar = new tau.widget.IndexScrollbar(indexScrollbarElement);
} else {
	/* Create CircularIndexScrollbar */
	indexScrollbar = new tau.widget.CircularIndexScrollbar(
			indexScrollbarElement);
}

(function() {

	var page = document.getElementById("hsectionchangerPage"), changer = document
			.getElementById("hsectionchanger"), sectionLength = document
			.querySelectorAll("section").length, elPageIndicator = document
			.getElementById("pageIndicator"), sectionChanger, pageIndicator, pageIndicatorHandler;

	document.getElementById('msg').setAttribute('tizen-circular-scrollbar', '');


	/**
	 * pagebeforeshow event handler Do preparatory works and adds event
	 * listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		// make PageIndicator
		pageIndicator = tau.widget.PageIndicator(elPageIndicator, {
			numberOfPages : sectionLength
		});
		pageIndicator.setActive(2);
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

			if (pageId === "main" && !activePopup) {
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
