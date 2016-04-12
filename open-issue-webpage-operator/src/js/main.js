/*
 * open-issue-webpage
 *
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var lastLinks = [];

    var init = function init () {
        MashupPlatform.wiring.registerCallback("issue", function (issue) {
            var max = MashupPlatform.prefs.get("max");
            //If max is 0 or input is null, nothing to be done.
            if (max === 0 || !issue) {
                return;
            }

            var links = [];
            //If input is an array, get as many links as the max preference allows
            if (Array.isArray(issue)) {
                for (var i = 0; i < issue.length; i++) {
                    if (max > 0 && i > max - 1) {
                        break;
                    }
                    links.push(issue[i].link);
                }
            } else {
                //If input is just one, grab its link
                links.push(issue.link);
            }

            //Open tabs
            openWebpage(links);
            lastLinks = links;
        });
    };

    //Open tabs for all the input links
    //This will be blocked by the popup blocker if the wiring event that triggered this operator was not user triggered.
    var openWebpage = function openWebpage (links) {
        var block = MashupPlatform.prefs.get("block");
        links.forEach(function (link) {
            // Open the tab only if it was not on the last batch of links
            if (!block || lastLinks.indexOf(link) === -1) {
                window.open(link);
            }
        });
    };

    init();

})();
