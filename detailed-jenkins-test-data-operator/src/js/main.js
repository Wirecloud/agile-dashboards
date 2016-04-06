/*
 * detailed-jenkins-test-data
 * https://repo.conwet.fi.upm.es/Wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var count = 0;

    var data;
    var previousQuery = [];

    var init = function init() {
        MashupPlatform.wiring.registerCallback("build", function (builds) {

            if (!builds) {
                previousQuery = null;
                return;
            }

            //Check if its the same query as the previous one
            if (previousQuery.length === builds.length) {
                var sameQuery = true;
                for (var i = 0; i < builds.length; i++) {
                    if (previousQuery[i] !== builds[i].buildURL) {
                        sameQuery = false;
                    }
                }

                //If its the same query, send previous data.
                if (sameQuery) {
                    MashupPlatform.wiring.pushEvent("test-data", data);
                    return;
                }
            }

            //If its not the same query, new data must be harvested.

            //Check if the max amount is exceded
            if (builds.length > MashupPlatform.prefs.get("max").trim()) {
                throw new MashupPlatform.wiring.EndpointTypeError('Input data was larger than max');
            }
            //Harvest the data for all input builds
            data = [];
            previousQuery = [];
            if (Array.isArray(builds)) {
                count = builds.length;
                builds.forEach(function (build) {
                    previousQuery.push(build.buildURL);
                    harvestTestData (build);
                });
            } else {
                count = 1;
                harvestTestData (builds);
            }
        });
    };

    var harvestTestData = function harvestTestData (build) {
        //Get the base uri of the build
        var url = build.buildURL;
        if (!url || url === "") {
            return;
        }
        //Add path to ask for the testreport results of the build.
        url += "/testReport/api/json";
        MashupPlatform.http.makeRequest(url, {
            method: 'GET',
            parameters: {"depth": 1},
            onSuccess: function (response) {
                //Push the data to a list
                var res = JSON.parse(response.responseText);
                data.push(res);
            },
            onComplete: function () {
                //Wait for all the http requests to end.
                if (--count === 0) {
                    MashupPlatform.wiring.pushEvent("test-data", data);
                }
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();
