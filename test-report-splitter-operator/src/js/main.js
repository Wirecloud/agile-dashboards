/*
 * build-splitter
 *
 * Copyright (c) 2015-2016 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    MashupPlatform.wiring.registerCallback("test-report-list", function (test_report_list) {
        var fail_count_list = [], pass_count_list = [], skip_count_list = [];

        test_report_list.forEach(function (test_report) {
            if (typeof test_report !== 'object' || !('failCount' in test_report) || !('passCount' in test_report)) {
                throw new MashupPlatform.wiring.EndpointTypeError('This operator only supports test-report lists');
            }
            fail_count_list.push(test_report.failCount);
            pass_count_list.push(test_report.passCount);
            skip_count_list.push(test_report.skipCount);
        });

        MashupPlatform.wiring.pushEvent("fail-count-list", fail_count_list);
        MashupPlatform.wiring.pushEvent("pass-count-list", pass_count_list);
        MashupPlatform.wiring.pushEvent("skip-count-list", skip_count_list);
    });

})();
