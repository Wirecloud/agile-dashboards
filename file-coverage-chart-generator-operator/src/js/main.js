/*
 * file-coverage-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var build_serie = function build_serie(attr, values) {
        var key, data = [];

        for (key in values) {
            data.push(values[key][attr]);
        }

        return data;
    };

    MashupPlatform.wiring.registerCallback("data-series", function (values) {

        var options = {
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
                categories: Object.keys(values),
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
                pointFormat: '<b style="color:{series.color}">{series.name}</b>: <b>{point.y}</b> lines ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: 'Missing',
                color: 'rgb(158, 39, 35)',
                data: build_serie('missing', values)
            }, {
                name: 'Covered',
                color: 'rgb(53, 121, 53)',
                data: build_serie('covered', values)
            }]
        };


        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    }.bind(this));

})();
