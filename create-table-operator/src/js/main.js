/*
 * create-table
 * https://github.com/mognom/create-table-operator
 *
 * Copyright (c) 2017 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var endpoint;

    MashupPlatform.prefs.registerCallback(function (new_preferences) {

    }.bind(this));

    var init = function init() {

        MashupPlatform.wiring.registerCallback("dataset", function (input) {
            if (endpoint == null || MashupPlatform.prefs.get("newOne")) {
                endpoint = createTableWidget();
            }
            endpoint.pushEvent(input);
        });

    };

    var createTableWidget = function createTableWidget() {

        var options = {
            title: "Markdown Editor",
            width: "750px",
            height: "350px"
        };

        // Create editor widget and bind its output
        var tableWidget = MashupPlatform.mashup.addWidget('CoNWeT/data-viewer-table/2.1.1', options);

        // Bind remove event
        tableWidget.addEventListener("remove", function () {
            endpoint = null;
        });

        // Send initial content
        var tableInput = MashupPlatform.operator.createOutputEndpoint();
        tableWidget.inputs.dataset.connect(tableInput)

        return tableInput;
    };

    init();
})();
