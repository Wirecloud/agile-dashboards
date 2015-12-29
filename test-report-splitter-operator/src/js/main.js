/*
 * build-splitter
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    MashupPlatform.prefs.registerCallback(function (new_preferences) {

    }.bind(this));

    MashupPlatform.wiring.registerCallback("test-report-list", function (test_report_list) {
        var fail_count_list = [], pass_count_list = [], skip_count_list = [];

        test_report_list.forEach(function (test_report) {
            fail_count_list.push(test_report.failCount);
            pass_count_list.push(test_report.passCount);
            skip_count_list.push(test_report.skipCount);
        });

        MashupPlatform.wiring.pushEvent("fail-count-list", fail_count_list);
        MashupPlatform.wiring.pushEvent("pass-count-list", pass_count_list);
        MashupPlatform.wiring.pushEvent("skip-count-list", skip_count_list);
    });

    /* test-code */

    /* end-test-code */

})();
