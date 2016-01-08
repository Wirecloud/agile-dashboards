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
            data.push({x: key, y: values[key][attr]});
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
                    text: 'File'
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                }
            },
            series: [{
                name: 'Covered',
                data: build_serie('covered', values)
            }]
        };


        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    }.bind(this));

})();
