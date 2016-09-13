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
        MashupPlatform.wiring.registerCallback("issues", issuesCallback);
        MashupPlatform.wiring.registerCallback("commits", commitsCallback);
    };

    var issuesCallback = function issuesCallback (data) {
        var series = calculateIssueSeries(data);
        if (series.months.length === 1) {
            build_pie_chart(series.serie);
        } else {
            build_column_chart(series.serie, series.months, "Issues");
        }
    };

    var commitsCallback = function commitsCallback (data) {
        var series = calculateCommitSeries(data);
        if (series.months.length === 1) {
            build_pie_chart(series.serie);
        } else {
            build_column_chart(series.serie, series.months, "Commits");
        }
    };

    //Get the series to be plotted from the provided commits
    var calculateCommitSeries = function calculateCommitSeries (commits) {
        var result = [];
        var months = [];
        commits.forEach(function (commit) {
            var author = commit.author;
            //If it has no author skip it.
            if (!author) {
                return;
            }
            var month = commit.month;

            var i = months.indexOf(month);
            if (i === -1) {
                months.push(month);
                i = months.length - 1;
            }
            //Count the total commits per month
            if (result[author]) {
                if (result[author][i]) {
                    result[author][i] += 1;
                } else {
                    result[author][i] = 1;
                }
            } else {
                // If its the first issue of the author, initialize the array
                result[author] = [];
                result[author][i] = 1;
            }
        });
        return {serie: result, months: months};
    };

    //Get the series to be plotted from the provided issues
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
            //Count issues
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

    var columnDataHandler = function columnDataHandler (col) {
        var month = col.category;
        var assignee = col.series.name;
        return [
                {type: "eq", value: month, attr: "month"},
                {type: "eq", value: assignee, attr: "assignee"}
                ];
    };

    var pieDataHandler = function pieDataHandler (pie) {
        var filterBy = pie.name;
        return [{type: "eq", value: filterBy, attr: "assignee"}];
    };

    var build_column_chart = function build_column_chart(serie, months, type) {
        //Convert it to the highcharts series
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
                    text: type
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

        options.dataHandler = columnDataHandler;

        //Push the highcharts options
        MashupPlatform.wiring.pushEvent("chart-options", options);
    };


    var build_pie_chart = function build_pie_chart(series) {
        //Wait for data
        var serie = [];
        var keys = Object.keys(series);
        keys.forEach(function (key) {
            serie.push({name: key, y: series[key][0]});
        });

        var options = {
            chart: {
                type: 'pie'
            },
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            legend: {
                enabled: true
            },
            series: [{
                data: serie
            }]
        };

        options.dataHandler = pieDataHandler;

        //Push the highcharts options
        MashupPlatform.wiring.pushEvent("chart-options", options);
    };

    init();

    /* test-code */
    window.issuesCallback = issuesCallback;
    window.commitsCallback = commitsCallback;
    /* end-test-code */
})();
