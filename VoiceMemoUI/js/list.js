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

/*global tau*/
/*exported tauList*/

var tauList = (function() {
    var page,
        listHelper,
        elScroller,
        tauList = {};

    /**
     * Handles events before the list page shows
     * @public
     * @param {String} pageId - the id of the page with the list component
     */
    tauList.pageBeforeShowHandler = function(pageId) {
        var list;

        page = document.querySelector(pageId);
        elScroller = page.querySelector(".ui-scroller");

        if (elScroller) {
            list = elScroller.querySelector(".ui-listview");
        }

        if (elScroller && list) {
        	listHelper = tau.helper.SnapListStyle.create(list);

            elScroller.setAttribute("tizen-circular-scrollbar", "");
        }
    };

    /**
     * Handles events before the list page hides
     * @public
     */
    tauList.pageHideHandler = function() {
        if (listHelper) {
            // Release the list object
            listHelper = null;

            if (elScroller) {
                elScroller.removeAttribute("tizen-circular-scrollbar");
            }
        }
    };

    return tauList;
}());