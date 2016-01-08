/*
 * get-coverage-report-jenkins
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var current_requests = [];
    var coverage_info = [];
    var build_list = null;
    var current_count = 0;

    var addCoverageReport = function addCoverageReport(index, response) {
        var build_info;

        build_info = JSON.parse(response.responseText);
        coverage_info[index] = build_info.results.elements[3].ratio;
    };

    var onComplete = function onComplete() {
        if (--current_count === 0) {
            MashupPlatform.wiring.pushEvent('coverage-report-list', coverage_info);
            coverage_info = [];
            current_requests = [];
        }
    };

    MashupPlatform.wiring.registerCallback("build-list", function (data) {

        var i;

        for (i = 0; i < current_requests.length; i++) {
            current_requests[i].abort();
        }

        build_list = data;
        current_requests = [];
        coverage_info = new Array(build_list.length);
        current_count = data.length;
        for (i = 0; i < build_list.length; i++) {
            current_requests.push(MashupPlatform.http.makeRequest(MashupPlatform.prefs.get('jenkins_server') + 'job/' + MashupPlatform.prefs.get('job_id') + '/' + build_list[i] + '/cobertura/api/json', {
                method: 'GET',
                parameters: {depth: 2},
                onSuccess: addCoverageReport.bind(null, i),
                onComplete: onComplete
            }));
        }

    }.bind(this));

})();
