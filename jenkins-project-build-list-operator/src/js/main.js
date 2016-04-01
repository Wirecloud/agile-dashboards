/*
 * jenkins-project-build-list
 *
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var init = function init() {
        MashupPlatform.wiring.registerCallback("build-list", function (data) {
            generateDataset(data);
        });
    };

    var generateDataset = function generateDataset(data) {
        // Create the table structure
        var structure = [
            {field: 'result', label: '', sortable: true},
            {field: 'id', label: 'Id', sortable: true},
            {field: 'timestamp', label: 'Date', type: 'date', sortable: true}
        ];

        var dataset = {
            structure: structure,
            data: data,
            id: "id",
            state_function: stateFunc
        };
        MashupPlatform.wiring.pushEvent('dataset', dataset);
    };

    var stateFunc = function stateFunc (entry) {
        switch (entry.result) {
        case "SUCCESS":
            return "success";
        case "FAILURE":
            return "danger";
        }
    };

    init();

})();
