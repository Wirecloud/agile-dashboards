/*
 * trend-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var timestamps = null;
    var values = null;

    var build_serie = function build_serie() {
        var i, data = [];
        for (i = 0; i < timestamps.length; i++) {
            data.push({x: timestamps[i], y: values[i]});
        }
        return data;
    };

    var plot = function plot() {
        var options, max;

        if (values == null || timestamps == null || values.length != timestamps.length) {
            return;
        }

        options = {
            chart: {
                type: 'area'
            },
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    hour: '%Y-%m-%d<br/>%H:%M',
                    day: '%Y<br/>%m-%d',
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: timestamps.metadata.verbose || "Date"
                }
            },
            yAxis: {
                title: {
                    text: values.metadata.verbose || "Values"
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f}'
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineWidth: 1,
                    marker: {
                        enabled: true,
                        lineWidth: 1
                    }
                }
            },
            series: [{
                name: MashupPlatform.prefs.get('serie_title'),
                data: build_serie(values)
            }]
        };

        max = MashupPlatform.prefs.get('max').trim();
        if (max !== '') {
            options.yAxis = {max: parseInt(max, 10)};
        }
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };

    MashupPlatform.wiring.registerCallback("timestamps", function (data) {
        timestamps = data;
        plot();
    });

    MashupPlatform.wiring.registerCallback("data-serie", function (data) {
        values = data;
        plot();
    });

})();
