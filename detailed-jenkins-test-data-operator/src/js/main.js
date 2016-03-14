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

    var init = function init() {
        MashupPlatform.wiring.registerCallback("build", function (builds) {
            if (!builds) {
                return;
            }

            //Check if the max amount is exceded
            if (builds.length > MashupPlatform.prefs.get("max").trim()) {
                throw new MashupPlatform.wiring.EndpointTypeError('Input data was larger than max');
            }
            //Harvest the data for all input builds
            var result = [];
            if (Array.isArray(builds)) {
                count = builds.length;
                builds.forEach(function (build) {
                    harvestTestData (build, result);
                });
            } else {
                count = 1;
                harvestTestData (builds, result);
            }
        });
    };

    var harvestTestData = function harvestTestData (build, result) {
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
                var data = JSON.parse(response.responseText);
                result.push(data);
            },
            onComplete: function () {
                //Wait for all the http requests to end.
                if (--count === 0) {
                    MashupPlatform.wiring.pushEvent("test-data", result);
                }
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();
