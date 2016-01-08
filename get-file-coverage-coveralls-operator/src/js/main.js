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

    var addCoverageReport = function addCoverageReport(file, response) {
        var build_info, covered_lines = 0, total_lines = 0;

        build_info = JSON.parse(response.responseText);
        build_info.forEach(function (line_info) {
            if (line_info == null) {
                return;
            }

            if (line_info > 0) {
                covered_lines += 1;
            }
            total_lines += 1;
        });
        coverage_info[file] = {
            covered: covered_lines,
            missing: total_lines - covered_lines,
            total: total_lines,
            percentage: covered_lines / total_lines
        };
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

        // Abort current requests
        current_count = 0;
        current_requests.forEach(function (request) {request.abort();});

        // Make the required requests for obtaining the coverage
        current_requests = [];
        current_count = file_list.length;
        coverage_info = {};

        if (file_list.length === 0) {
            MashupPlatform.wiring.pushEvent('coverage-report-matrix', coverage_info);
            return;
        }

        file_list.forEach(function (file) {
            current_requests.push(MashupPlatform.http.makeRequest('https://coveralls.io/builds/' + revision_id + '/source.json', {
                method: 'GET',
                parameters: {
                    filename: file
                },
                onSuccess: addCoverageReport.bind(null, file),
                onComplete: onComplete
            }));
        });
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
                        // Remove the "src/" prefix
                        file_list.push(file.substr(4));
                    }
                });
            });

        });

        process();
    });

})();
