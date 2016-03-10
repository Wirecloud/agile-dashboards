/*
 * workload-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWeT
 * Licensed under the Apache2 license.
 */


(function () {

    "use strict";

    var init = function init() {

        MashupPlatform.wiring.registerCallback("issues", function (data) {
            var series = calculateIssueSeries(data);
            build_column_chart(series.serie, series.months);
        });

        MashupPlatform.wiring.registerCallback("commits", function (data) {
            var serie = calculateCommitSeries(data);
            //build_pie_chart(serie);
        });

    };

    var calculateCommitSeries = function calculateCommitSeries (commits) {

    };

    var calculateIssueSeries = function calculateIssueSeries (issues) {
        var result = [];
        var months = [];
        

        issues.forEach (function (issue) {

            var assignee = issue.assignee;
            //If theres no assignee skip the issue
            if (!assignee) {
                return;
            }
            var month = issue.creationDate.substring(0, 7);
            
            var i = months.indexOf(month);
            if (i === -1) {
                months.push(month);
                i = months.length - 1;
            } 
            
            if (result[assignee]) {
                if (result[assignee][i]) {
                    result[assignee][i] += 1;
                } else {
                    result[assignee][i] = 1;
                }
            } else {
                // If its the first issue of the assignee, initialize the array
                result[assignee] = [];
                result[assignee][i] = 1;
            }
        });

        return {serie: result, months: months};
    };

    var build_column_chart = function build_column_chart(serie, months) {
        
        var series = [];
        var keys = Object.keys(serie);
        keys.forEach(function (key, i) {
            series.push({data: serie[key], name: key});
        });

        var options = {
            chart: {
                type: "column"
            },
            xAxis: {
                categories: months,
                title: {
                    text: "Months"
                }
            },
            yAxis: {
                title: {
                    text: "Issues"
                }
            },
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            legend: {
                enabled: true
            },
            series: series
        };
        //Push the highcharts options
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };

    var build_pie_chart = function build_pie_chart(serie) {

    };

    init();

    /* test-code */

    /* end-test-code */

})();
