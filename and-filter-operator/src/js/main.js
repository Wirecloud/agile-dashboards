/*
 * and-filter
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var original_list = null;
    var condition_list = '';

    var filter = function filter() {
        var i, filtered = [];

        if (original_list == null) {
            return;
        }

        if (condition_list !== '') {
            for (i = 0; i < original_list.length; i++) {
                if (original_list[i].timestamp < condition_list.timerange.start) {
                    continue;
                } else if (original_list[i].timestamp > condition_list.timerange.end) {
                    break;
                }

                filtered.push(original_list[i]);
            }
        } else {
            filtered = original_list.slice(0);
        }

        MashupPlatform.wiring.pushEvent('filtered-list', filtered);
    };

    MashupPlatform.wiring.registerCallback("original-list", function (_original_list) {
        original_list = _original_list;
        filter();
    }.bind(this));

    MashupPlatform.wiring.registerCallback("condition-list", function (_condition_list) {
        condition_list = _condition_list;
        filter();
    }.bind(this));

})();
