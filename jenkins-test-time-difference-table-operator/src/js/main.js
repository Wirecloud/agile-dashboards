/*
 * jenkins-test-time-difference-table
 *
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var data;
    var init = function init() {
        MashupPlatform.wiring.registerCallback("test-list", function (d) {
            data = d;
            calculateDifference();
        });

        MashupPlatform.prefs.registerCallback(function (newPrefs) {
            calculateDifference();
        });
    };

    var truncate = function (number, factor) {
        return Math.trunc(number * factor) / factor;
    };

    var calculateDifference = function calculateDifference () {
        //Wait for data from two builds at least
        if (!data || !data[0] || !data[1]) {
            return;
        }

        var info = [];
        var build1 = data[0].suites[0].cases;
        var build2 = data[1].suites[0].cases;

        var decimalsFactor = Math.pow(10, MashupPlatform.prefs.get("decimals"));

        //Add the total times as an entry.
        info.push({testname: "Total", duration1: truncate(data[0].suites[0].duration, decimalsFactor), duration2: truncate(data[1].suites[0].duration, decimalsFactor), diff: truncate(data[0].suites[0].duration - data[1].suites[0].duration, decimalsFactor)});

        //Add all the tests of the input builds
        for (var i = 0; i < build1.length; i++) {
            info.push({testname: build1[i].className, duration1: truncate(build1[i].duration, decimalsFactor), duration2: truncate(build2[i].duration, decimalsFactor), diff: truncate(build1[i].duration - build2[i].duration, decimalsFactor)});
        }

        generateDataset(info);
    };

    var generateDataset = function generateDataset(info) {
        //Set the table structure
        var structure = [
            {field: "testname", label: "Test", type: "string"},
            {field: "duration1", label: "Build1 durations", type: "number"},
            {field: "duration2", label: "Build2 durations", type: "number"},
            {field: "diff", label: "Difference", type: "number"}
        ];

        //Builds the required dataset
        var dataset = {
            structure: structure,
            data: info,
            id: "testname",
            state_function: stateFunc
        };
        MashupPlatform.wiring.pushEvent('dataset', dataset);
    };

    var stateFunc = function stateFunc (entry) {
        if (entry.diff < 0) {
            return "success";
        } else if (entry.diff === 0) {
            return "info";
        } else {
            return "danger";
        }
    };

    init();

})();
