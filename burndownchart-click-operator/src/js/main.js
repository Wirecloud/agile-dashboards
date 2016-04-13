/*
 * burndownchart-click
 *
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";
    var DAY_LENGTH = 86400000;

    var inputIssues;

    //Initialize the operator, binding its wiring callbacks
    var init = function init () {
        MashupPlatform.wiring.registerCallback("click", function (data) {
            var dayNumber = JSON.parse(data).x - 1;
            getIssues(dayNumber);
        });

        MashupPlatform.wiring.registerCallback("input-issues", function (data) {
            inputIssues = data;
        });
    };

    //gets the starting date of the input sprint
    var getStartDate = function getStartDate () {
        var startDate;

        //Get the filtered sprint. If none is chosen try with the first available version
        var version;
        if (inputIssues.metadata.filtered && inputIssues.metadata.filtered.Sprints) {
            version = inputIssues.metadata.filtered.Sprints;
        } else {
            version = inputIssues[0].versions[0];
        }

        //Get the startDate from the version data
        inputIssues.metadata.versions.forEach(function (ver) {
            if (ver.name === version) {
                startDate = Date.parse(ver.startDate);
            }
        });

        return startDate;
    };

    //Harvest the issues that were closed target day
    var getIssues = function getIssues (dayNumber) {
        if (!inputIssues || !dayNumber) {
            return;
        }

        var startDate = getStartDate();

        var dayLower = startDate + (dayNumber - 1) * DAY_LENGTH; //lowest timestamp of the day
        var dayUpper = startDate + (dayNumber) * DAY_LENGTH; //highest timestamp of the day
        var result = [];

        inputIssues.forEach (function (issue) {
            var date = Date.parse(issue.resolutionDate) - DAY_LENGTH + 1;
            if (date >= dayLower && date < dayUpper) {
                result.push(issue);
            }
        });

        result.metadata = inputIssues.metadata;

        //Push the issues
        MashupPlatform.wiring.pushEvent("output-issues", result);

    };

    init();


})();
