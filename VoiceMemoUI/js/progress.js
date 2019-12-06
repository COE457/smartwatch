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

/*global tau, app*/
/*exported tauProgress*/

var tauProgress = (function() {
    var progressBar,
        progressBarWidget,
        tauProgress = {};

    /**
     * Resets progress-bar-related variables
     * @public
     */
    function clearVariables() {
        // Reset the progress bar
        progressBar = null;
        progressBarWidget.value(0);
    }

    /**
     * Fills in the progress bar as time passes
     * @public
     */
    tauProgress.changeProgressValue = function() {
        // Get the current value of progress bar and convert it into float
        var value = parseFloat(progressBarWidget.value());

        // The circle must be filled full when it reaches the max amount of recording time
        // The value increases by 100 / MAX_DURATION SEC every 1 second
        if (value < app.MAX_DURATION_SEC) {
            value += (100 / app.MAX_DURATION_SEC);
        } else {
            value = app.MAX_DURATION_SEC;
        }

        // Set the new value of progress bar
        progressBarWidget.value(value);
    };

    /**
     * Handles events before the progress-bar page shows
     * @public
     */
    tauProgress.pageBeforeShowHandler = function() {
        if (tau.support.shape.circle) {
            // Make a circle progress-bar object
            if (!progressBar) {
                progressBar = document.getElementById("circleprogress");
            }

            // Make a circle progress-bar object (tau)
            progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {
                size: "full"
            });
        }
    };

    /**
     * Handles events before the progress-bar page hides
     * @public
     */
    tauProgress.pageHideHandler = function() {
        // Release the progress-bar object
        if (progressBarWidget) {
            clearVariables();
            progressBarWidget.destroy();
        }
    };

    return tauProgress;
}());