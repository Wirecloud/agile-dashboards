/*
 * pie-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";
    var series;
    var init = function init() {
        MashupPlatform.wiring.registerCallback("number-serie", numberSerieCallback);
        MashupPlatform.wiring.registerCallback("label-serie", labelSerieCallback);
    };

    var labelSerieCallback = function labelSerieCallback (data) {
        if (data) {
            var labelSerie = toNumberSerie(data);
            labelSerie = calculateSeries(labelSerie);
            series = labelSerie;
            series.metadata = data.metadata || {};
            build_pie_chart(series);
        }
    };

    var numberSerieCallback = function numberSerieCallback (data) {
        if (data) {
            var numberSerie = data;
            numberSerie = calculateSeries(numberSerie);
            series = numberSerie;
            series.metadata = data.metadata || {};
            build_pie_chart(series);
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

    var dataHandler = function dataHandler (pie) {
        var filterBy = pie.name;
        var meta = series.metadata;
        return [{type: meta.filterAttributeType || "eq", value: filterBy, attr: meta.filterAttribute}];
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
                animation: MashupPlatform.prefs.get('animation'),
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

        if (series.metadata.filterAttribute) {
            options.dataHandler = dataHandler;
        }

        //Push the highcharts options
        MashupPlatform.wiring.pushEvent("chart-options", options);
    };

    init();

    /* test-code */
    window.labelSerieCallback = labelSerieCallback;
    window.numberSerieCallback = numberSerieCallback;
    /* end-test-code */

})();
