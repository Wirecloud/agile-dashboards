/*
 * build-splitter
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    MashupPlatform.wiring.registerCallback("build-list", function (build_list) {
        var build_id_list = [],
            duration_list = [],
            changes_list = [],
            cause_list = [],
            revision_list = [],
            test_report_list = [],
            timestamp_list = [];

        build_list.forEach(function (build) {
            if (typeof build !== 'object' || !('id' in build) || !('duration' in build)) {
                throw new MashupPlatform.wiring.EndpointTypeError('Expecting a build list');
            }

            build_id_list.push(build.id);
            duration_list.push(build.duration);
            changes_list.push(build.changes);
            cause_list.push(build.cause);
            revision_list.push(build.revision);
            test_report_list.push(build.testResults);
            timestamp_list.push(build.timestamp);
        });

        //Adds metadata
        build_id_list.metadata = {type: "build", tag: "Build"};
        duration_list.metadata = {type: "number", tag: "Duration", "verbose": "Build duration"};
        changes_list.metadata = {type: "number", tag: "Changes", "verbose": "Build changes"};
        cause_list.metadata = {type: "text", tag: "Cause"};
        revision_list.metadata = {type: "revision", tag: "Revision"};
        test_report_list.metadata = {type: "test_report", tag: "Test report"};
        timestamp_list.metadata = {type: "timestamp", tag: "Date", verbose: "Build date"};


        MashupPlatform.wiring.pushEvent("build-id-list", build_id_list);
        MashupPlatform.wiring.pushEvent("duration-list", duration_list);
        MashupPlatform.wiring.pushEvent("changes-list", changes_list);
        MashupPlatform.wiring.pushEvent("cause-list", cause_list);
        MashupPlatform.wiring.pushEvent("revision-list", revision_list);
        MashupPlatform.wiring.pushEvent("test-report-list", test_report_list);
        MashupPlatform.wiring.pushEvent("timestamp-list", timestamp_list);
    });

})();
