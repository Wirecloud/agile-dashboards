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
            changes_list = [],
            cause_list = [],
            revision_list = [],
            test_report_list = [],
            timestamp_list = [];

        build_list.forEach(function (build) {
            build_id_list.push(build.id);
            changes_list.push(build.changes);
            cause_list.push(build.cause);
            revision_list.push(build.revision);
            test_report_list.push(build.testResults);
            timestamp_list.push(build.timestamp);
        });

        MashupPlatform.wiring.pushEvent("build-id-list", build_id_list);
        MashupPlatform.wiring.pushEvent("changes-list", changes_list);
        MashupPlatform.wiring.pushEvent("cause-list", cause_list);
        MashupPlatform.wiring.pushEvent("revision-list", revision_list);
        MashupPlatform.wiring.pushEvent("test-report-list", test_report_list);
        MashupPlatform.wiring.pushEvent("timestamp-list", timestamp_list);
    });

})();
