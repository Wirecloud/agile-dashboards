/*
 * get-coverage-report-coveralls
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var current_requests = [];
    var coverage_info = [];
    var revision_list = null;
    var current_count = 0;

    var addCoverageReport = function addCoverageReport(response) {
        var build_info, index;

        build_info = JSON.parse(response.responseText);
        index = revision_list.indexOf(build_info.commit_sha);
        coverage_info[index] = build_info.covered_percent;
    };

    var onComplete = function onComplete() {
        if (--current_count === 0) {
            MashupPlatform.wiring.pushEvent('coverage-report-list', coverage_info);
            coverage_info = [];
            current_requests = [];
        }
    };

    MashupPlatform.wiring.registerCallback("revision-list", function (data) {

        var i;

        for (i = 0; i < current_requests.length; i++) {
            current_requests[i].abort();
        }

        revision_list = data;

        if (revision_list.length === 0) {
            MashupPlatform.wiring.pushEvent('coverage-report-list', []);
            return;
        }

        current_requests = [];
        coverage_info = new Array(revision_list.length);
        current_count = revision_list.length;
        for (i = 0; i < revision_list.length; i++) {
            MashupPlatform.http.makeRequest('https://coveralls.io/builds/' + revision_list[i] + '.json', {
                method: 'GET',
                onSuccess: addCoverageReport,
                onComplete: onComplete
            });
        }

    }.bind(this));

})();
