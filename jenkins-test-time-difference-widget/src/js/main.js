/*
 * jenkins-test-time-difference
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

/* globals StyledElements */

(function () {

    "use strict";

    var layout;
    var table;
    var init = function init() {
        //Create the table
        layout = new StyledElements.BorderLayout();
        createTable();

        layout.getCenterContainer().addClassName('loading');
        layout.insertInto(document.body);
        layout.repaint();

        //Add the loading animation
        layout.getCenterContainer().disable();

        MashupPlatform.wiring.registerCallback("test-list", function (data) {
            //Check if theres data. If not -> clear the table and set loading animation
            if (!Array.isArray(data) || data.length < 2) {
                table.pClearTable();
                layout.getCenterContainer().disable();
                return;
            }

            var info = [];
            var build1 = data[0].suites[0].cases;
            var build2 = data[1].suites[0].cases;
            //Add the total times as an entry.
            info.push({testname: "Total", duration1: data[0].suites[0].duration, duration2: data[1].suites[0].duration, diff: data[0].suites[0].duration - data[1].suites[0].duration});

            //Add all the tests of the input builds
            for (var i = 0; i < build1.length; i++) {
                info.push({testname: build1[i].className, duration1: build1[i].duration, duration2: build2[i].duration, diff: build1[i].duration - build2[i].duration});
            }

            //Add the elements to the table and remove the loading animation
            table.source.changeElements(info);
            layout.getCenterContainer().enable();
        });

    };

    var createTable = function createTable() {
        //Set the table fields
        var fields = [
            {field: "testname", label: "Test", sortable: true, type: "string"},
            {field: "duration1", label: "Build1 durations", sortable: true, type: "number"},
            {field: "duration2", label: "Build2 durations", sortable: true, type: "number"},
            {field: "diff", label: "Difference", sortable: true, type: "number"}
        ];

        //Configure the model table and create it
        table = new StyledElements.ModelTable(fields, {
            id: 'id',
            pageSize: 0,
            'class': 'table-striped',
            initialSortColumn: 'diff',
            initialDescendingOrder: true,
            stateFunc: function (entry) {
                if (entry.diff <= 0) {
                    return "success";
                } else {
                    return "danger";
                }
            }
        });

        table.reload();
        layout.center.clear();
        layout.center.appendChild(table);
    };

    init();
})();
