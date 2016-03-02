/*
 * reliability-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var issue_list = null;

    var build_pie_chart = function build_pie_chart(done, failed) {
        return {
            chart: {
                type: 'pie'
            },
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            legend: {
                enabled: false
            },
            series: [{
                data: [
                    {name: "Closed", y: done},
                    {name: "Pending", y: failed}
                ]
            }]
        };

    };

    var build_serie = function build_serie(attr, values) {
        var key, data = [];

        for (key in values) {
            data.push(values[key][attr]);
        }

        return data;
    };

    var build_column_chart = function build_column_chart(users, data) {
        return {
            chart: {
                type: 'column'
            },
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: users,
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            tooltip: {
                borderColor: '#7cb5ec',
                headerFormat: '<b>{point.key}</b><br />',
                pointFormat: '<b style="color:{series.color}">{series.name}</b>: <b>{point.y}</b> issues ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: 'Pending',
                color: 'rgb(158, 39, 35)',
                data: build_serie('failed', data)
            }, {
                name: 'Closed',
                color: 'rgb(53, 121, 53)',
                data: build_serie('done', data)
            }]
        };
    };

    var plot_chart = function plot_chart() {
        var data = [];
        issue_list.forEach(function (issue) {
            if (issue.assignee == null) {
                return;
            }

            if (!(issue.assignee in data)) {
                data[issue.assignee] = {
                    done: 0,
                    failed: 0
                };
            }

            if (issue.status.toLowerCase() === 'closed') {
                data[issue.assignee].done += 1;
            } else {
                data[issue.assignee].failed += 1;
            }
        });

        var users = Object.keys(data);
        if (users.length === 1) {
            MashupPlatform.wiring.pushEvent('chart-options', JSON.stringify(build_pie_chart(data[users[0]].done, data[users[0]].failed)));
        } else {
            MashupPlatform.wiring.pushEvent('chart-options', JSON.stringify(build_column_chart(users, data)));
        }
    };

    MashupPlatform.wiring.registerCallback("issues-list", function (_issue_list) {
        issue_list = _issue_list;
        plot_chart();
    });

})();
