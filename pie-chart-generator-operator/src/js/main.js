/*
 * pie-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var init = function init() {
        MashupPlatform.wiring.registerCallback("number-serie", numberSerieCallback);
        MashupPlatform.wiring.registerCallback("label-serie", labelSerieCallback);
    };

    var labelSerieCallback = function labelSerieCallback (data) {
        if (data) {
            var labelSerie = toNumberSerie(data);
            labelSerie = calculateSeries(labelSerie);
            build_pie_chart(labelSerie);
        }
    };

    var numberSerieCallback = function numberSerieCallback (data) {
        if (data) {
            var numberSerie = data;
            numberSerie = calculateSeries(numberSerie);
            build_pie_chart(numberSerie);
        }
    };

    var toNumberSerie = function toNumberSerie (serie) {
        var result = [];

        serie.forEach (function (data) {
            if (result[data]) {
                result[data] += 1;
            } else {
                result[data] = 1;
            }
        });

        return result;
    };

    var calculateSeries = function calculateSeries(data) {
        var result = [];

        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            result.push({name: keys[i], y: data[keys[i]]});
        }
        return result;
    };

    var build_pie_chart = function build_pie_chart(series) {
        var options = {
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
                data: series
            }],
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.percentage:.1f}%'
                    }
                }
            },
            tooltip: {
                borderColor: '#7cb5ec',
                headerFormat: '<b style="color:{point.color}">{point.key}</b><br />',
                pointFormat: '<b>{point.y:.1f}</b> ({point.percentage:.0f}%)<br/>',
            },
        };

        //Push the highcharts options
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };

    init();

    /* test-code */
    window.labelSerieCallback = labelSerieCallback;
    window.numberSerieCallback = numberSerieCallback;
    /* end-test-code */

})();
