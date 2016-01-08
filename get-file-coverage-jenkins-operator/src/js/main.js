/*
 * get-file-coverage-coveralls
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var current_requests = [];
    var file_list = null;
    var revision_id = null;
    var current_count = 0;
    var coverage_info = {};

    var addCoverageReport = function addCoverageReport(response) {
        var build_info, index;

        build_info = JSON.parse(response.responseText);
        file_list.forEach(function (file) {
            // TODO
        });
    };

    var onComplete = function onComplete() {
        if (--current_count === 0) {
            MashupPlatform.wiring.pushEvent('coverage-report-matrix', coverage_info);
            coverage_info = [];
            current_requests = [];
        }
    };

    var endsWith = function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    var process = function process() {

        if (revision_id == null || file_list == null) {
            return;
        }

        current_requests.forEach(function (request) {request.abort();});
        current_requests = [];
        current_count = file_list.length;
        coverage_info = {};

        if (file_list.length === 0) {
            MashupPlatform.wiring.pushEvent('coverage-report-matrix', coverage_info);
            return;
        }

        current_requests.push(MashupPlatform.http.makeRequest(MashupPlatform.prefs.get('jenkins_server') + 'job/' + MashupPlatform.prefs.get('job_id') + '/' + revision_id + '/cobertura/api/json', {
            method: 'GET',
            parameters: {
                depth: 100
            },
            onSuccess: addCoverageReport,
            onComplete: onComplete
        }));
    };

    MashupPlatform.wiring.registerCallback("revision-list", function (revision_list) {
        revision_id = revision_list[revision_list.length - 1];
        process();
    });

    MashupPlatform.wiring.registerCallback("affected-file-matrix", function (file_matrix) {

        file_list = [];
        file_matrix.forEach(function (files_per_build) {

            files_per_build.forEach(function (files_per_change) {
                files_per_change.forEach(function (file) {
                    if (endsWith(file, '.py') && file_list.indexOf(file) === -1) {
                        file_list.push(file);
                    }
                });
            });

        });

        process();
    });

})();
