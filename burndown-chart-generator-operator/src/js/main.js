/*
 * burndown-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var DAY_LENGTH = 86400000;
    var sprint = null;
    var startDate = null;
    var endDate = null;
    var version = null;

    var init = function init() {
        MashupPlatform.wiring.registerCallback("issues", function (data) {
            sprint = data;
            version = null;
            if (sprint.length === 0) {
                cleanPlot("Input data is empty :(");
                return;
            }

            //Get the filtered sprint. If none is chosen try with the first available version
            if (data.metadata.filtered && data.metadata.filtered.Sprints) {
                version = data.metadata.filtered.Sprints;
            } else {
                version = sprint[0].versions[0];
            }


            if (!checkOneSprint()) {
                cleanPlot("All input issues must be from the same sprint");
                return;
            }

            //Get version data
            data.metadata.versions.forEach(function (ver) {
                if (ver.name === version) {
                    startDate = ver.startDate;
                    endDate = ver.endDate;
                }
            });

            plot();
        });
    };

    // Calculates the reference data series
    var calculateInterval = function calculateInterval(days, issuesCount) {
        var serie = [];
        var factor = issuesCount / (days.length - 1);

        days.forEach(function (d, index) {
            serie.push([index + 1, issuesCount - factor * index]);
        });

        return serie;
    };

    // Calculates the data series of the actual progress made during the sprint
    var calculateProgress = function calculateProgress(days, issues) {
        var progress = [];
        var closed = [];
        var total = issues.length;
        var count = 0;
        var dailyCount = 0;
        var today = new Date();
        days.forEach(function (day, index) {
            //There cant be any issues completed in the future
            if (day > today) {
                return;
            }
            dailyCount = 0;
            for (var i = 0; i < issues.length; i++) {

                if (day >= Date.parse(issues[i].resolutionDate) - DAY_LENGTH + 1) {
                    dailyCount++;
                    issues.splice(i, 1); //Removes it
                    i--;
                }
            }
            count += dailyCount;
            progress.push([index + 1, total - count]);
            closed.push([index + 1, dailyCount]);
        });
        return {progress: progress, closed: closed};
    };

    //all the issues are part of the target sprint
    var checkOneSprint = function checkOneSprint() {
        return sprint.every(function (issue) {
            return issue.versions.some(function (ver) {
                return ver === version;
            });
        });
    };

    // Get the timestamps of each day of the sprint
    var getDays = function getDays(start, end) {
        var result = [];
        var aux = start;
        result.push(aux);
        while (aux < end) {
            aux += DAY_LENGTH;
            result.push(aux);
        }
        return result;
    };



    var plot = function plot() {

        //Check if there's missing data
        if (endDate === null || sprint === null) {
            return;
        }
        //Calculates the day interval of the sprint
        var days = getDays(Date.parse(startDate), Date.parse(endDate));

        if (sprint == null) {
            return;
        }

        var aux = calculateProgress(days, sprint.slice(0));
        var progressSeries = aux.progress;
        var closedSeries = aux.closed;

        var options;

        options = {

            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:.1f}</b><br/>',
                shared: true
            },

            title: {
                text: version
            },

            xAxis: {
                tickInterval: 1,
                title: {
                    text: "Days"
                }
            },

            yAxis: {
                title: {
                    text: "Issues"
                }
            },

            series: [
            {
                type: 'column',
                data: closedSeries,
                name: "Closed",
                dataLabels: {
                    enabled: true
                }
            },
            {

                data: calculateInterval(days, sprint.length),
                name: "Reference"
            },
            {
                type: 'spline',
                data: progressSeries,
                name: "Actual"
            }
            ]
        };
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };


    var cleanPlot = function cleanPlot(msg) {
        var options = {};
        options.title = {text: msg};
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };

    //Init the operator
    init();
})();
