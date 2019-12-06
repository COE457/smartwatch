/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global tau, app */
/*jshint unused: vars*/
/*exported tauMoreOptions*/

var tauMoreOptions = (function() {
    var page,
        popup,
        handler,
        popupCircle,
        elSelector,
        selector,
        clickHandlerBound,
        clickElSelectorBound,
        tauMoreOptions = {};

    /**
     * Opens the pop-up when the more-option button is clicked
     * @private
     * @param {Object} event - the object for click event
     */
    function clickHandler(event) {
        if (tau.support.shape.circle) {
            tau.openPopup(popupCircle);
        } else {
            tau.openPopup(popup);
        }
    }

    /**
     * Handles events for clicking selector buttons (options) in the pop-up
     * @private
     * @param {Object} event - the object for click event
     */
    function clickElSelector(event) {
        var target = event.target,
            dataTitle;

        if (tau.support.shape.circle) {
            // 'ui-selector-indicator' is default indicator class name of Selector component
            if (target.classList.contains("ui-selector-indicator")) {
                tau.closePopup(popupCircle);
            } else {
                dataTitle = target.getAttribute("id").replace('to-','');
                if (dataTitle === "delete") {
                    app.deleteVoice();
                    tau.closePopup(popupCircle);
                    setTimeout(function() {
                        window.history.back();
                    }, 500);
                } else if (dataTitle) {
                    tau.changePage("#" + dataTitle);
                } else {
                    tau.closePopup(popupCircle);
                }
            }
        }
    }

    /**
     * Handles events before the more-options page shows
     * @public
     * @param {String} pageId - the id of the page with the more-options component
     */
    tauMoreOptions.pageBeforeShowHandler = function(pageId) {
        var radius = window.innerHeight / 2 * 0.8;

        page = document.querySelector(pageId);
        popup = page.querySelector("#moreoptionsPopup");
        handler = page.querySelector(".ui-more");
        popupCircle = page.querySelector("#moreoptionsPopupCircle");
        elSelector = page.querySelector("#selector");

        clickHandlerBound = clickHandler.bind(null);
        clickElSelectorBound = clickElSelector.bind(null);

        handler.addEventListener("click", clickHandlerBound);
        elSelector.addEventListener("click", clickElSelectorBound);

        if (tau.support.shape.circle) {
            selector = tau.widget.Selector(elSelector, {
                itemRadius: radius
            });
        }
    };

    /**
     * Handles events before the more-options page hides
     * @public
     */
    tauMoreOptions.pageHideHandler = function() {
        handler.removeEventListener("click", clickHandlerBound);
        elSelector.removeEventListener("click", clickElSelectorBound);
        if (tau.support.shape.circle) {
            selector.destroy();
        }
    };

    return tauMoreOptions;
}());
