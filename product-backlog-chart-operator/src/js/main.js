/*
 * product-backlog-chart
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var data = null;
    var series_cache = null;

    var init = function init() {
        MashupPlatform.wiring.registerCallback("issues", function (d) {
            data = d;
            series_cache = calculateSeries();
            plot();
        });
    };

    var calculateSeries = function calculateSeries() {

        var created = [];
        var resolved = [];
        var updated = [];

        var date;

        data.forEach(function (issue) {
            //Creation count
            if (issue.creationDate) {
                date = issue.creationDate.substring(0, 7);
                if (created[date]) {
                    created[date] += 1;
                } else {
                    created[date] = 1;
                }
            }
            //Resolved count
            if (issue.resolutionDate) {
                date = issue.resolutionDate.substring(0, 7);
                if (resolved[date]) {
                    resolved[date] += 1;
                } else {
                    resolved[date] = 1;
                }
            }
            //Updated count
            if (issue.updatedDate) {
                date = issue.updatedDate.substring(0, 7);
                if (updated[date]) {
                    updated[date] += 1;
                } else {
                    updated[date] = 1;
                }
            }
        });

        //Takes all the keys together
        var keys = Object.keys(created).concat(Object.keys(resolved));
        //removes duplicates and sorts them
        keys = removeDuplicates(keys).sort(sortDates);

        var series = [];
        var createdSeries = [];
        var resolvedSeries = [];
        var updatedSeries = [];
        var progressSeries = [];

        //calculates the values of each serie
        keys.forEach(function (key) {
            createdSeries.push((created[key] || 0) + (createdSeries[createdSeries.length - 1] || 0));
            resolvedSeries.push((resolved[key] || 0) + (resolvedSeries[resolvedSeries.length - 1] || 0));
            updatedSeries.push((updated[key] || 0) + (updatedSeries[updatedSeries.length - 1] || 0));

            //Progress?
            progressSeries.push(resolved[key] || 0);
        });

        //Builds the series for highcharts
        series.push({name: "Progress", data: progressSeries, type: "column", dataLabels: {enabled: true}});
        series.push({name: "Created", data: createdSeries});
        series.push({name: "Resolved", data: resolvedSeries});
        series.push({name: "Updated", data: updatedSeries});
        return series;
    };

    //Helper function to sort the issue dates
    var sortDates = function sortDates(a, b) {
        //Splits dates on year and month
        var x = a.split("-");
        var y = b.split("-");
        //Compares the year
        var result = x[0] - y[0];

        //If the year its the same, compares the month
        if (result === 0) {
            result = x[1] - y[1];
        }
        //Returns the result of the comparision
        return result;
    };

    //Removes duplicate elements of an array
    var removeDuplicates = function removeDuplicates(array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };

    var highchartsDataHandler = function highchartsDataHandler (graph) {
        var month = graph.x;

        var filters;

        series_cache[0].data.forEach( function () {

        })



            return [{type: "eq", value: closedString, attr: "status"}];

            return [{type: "not", value: closedString, attr: "status"}];

        return filters;

    };

    var plot = function plot() {
        //Wait for data
        if (data === null) {
            return;
        }
        var options;
        options = {
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            xAxis: {
                tickInterval: 1,
                title: {
                    text: "Months"
                }
            },
            legend: {
                enabled: true
            },
            series: series_cache
        };



        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };
    init();
    /* test-code */

    /* end-test-code */

})();
