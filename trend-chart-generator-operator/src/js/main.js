/*
 * trend-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var timestamps = null; // Chart timestamps (X axis)
    var values = null; // Chart data series (Y axis)
    var xAxisUnit;
    var series = [];

    //Creates a serie from a list of data
    var build_serie = function build_serie(serie) {
        //Check if somethings wrong
        if (serie.length != timestamps.length) {
            return;
        }
        //Create the serie
        var i, data = [];
        for (i = 0; i < timestamps.length; i++) {
            data.push({x: timestamps[i], y: serie[i]});
        }
        return data;
    };

    //Creates all series
    var build_series = function build_series() {
        //Wipes current series
        series = [];

        //Check if theres data
        if (values === null || values.length === 0 || timestamps == null || timestamps.length === 0) {
            return;
        }

        if (!Array.isArray(values[0])) {
            //Single series
            series.push ({name: getMetadataVerbose(values), data: build_serie(values)});
            xAxisUnit = getMetadataVerbose(values);
        } else {
            //Multiple series
            values.forEach (function (serie) {
                series.push({name: getMetadataVerbose(serie), data: build_serie(serie)});
                xAxisUnit = getMetadataTag(serie);
            });
        }

        //If theres data --> redraw
        if (series.length > 0) {
            plot();
        }
    };

    //Gets the metadata, if any
    var getMetadataTag = function getMetadataTag(o) {
        return o.metadata ? o.metadata.tag || "values" : "values";
    };
    var getMetadataVerbose = function getMetadataMsg(o) {
        return o.metadata ? getMetadataTag(o) : "values";
    };

    //Draws the chart
    var plot = function plot() {
        var options, max;

        options = {
            chart: {
                type: 'area'
            },
            title: {
                text: MashupPlatform.prefs.get('title')
            },
            legend: {
                enabled: series.length === 1 ? false : true //Enable legend if there are more than 1 series
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
                    text: getMetadataVerbose(timestamps)
                }
            },
            yAxis: {
                title: {
                    text: xAxisUnit
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
            series: series
        };

        max = MashupPlatform.prefs.get('max').trim();
        if (max !== '') {
            options.yAxis = {max: parseInt(max, 10)};
        }
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };

    //Callback for the endpoints
    MashupPlatform.wiring.registerCallback("timestamps", function (data) {
        timestamps = data;
        build_series();
    });
    MashupPlatform.wiring.registerCallback("data-serie", function (data) {
        values = data;
        build_series();
    });

})();
