/*
 * column-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var dataSerie;
    var labelList;

    var init = function init () {
        MashupPlatform.wiring.registerCallback("data-serie", function (data) {
            dataSerie = data;
            build_column_chart();
        });

        MashupPlatform.wiring.registerCallback("label-list", function (labels) {
            labelList = labels;
            build_column_chart();
        });

    };

    var build_column_chart = function build_column_chart() {

        //If theres no data clean the chart and leave
        if (!dataSerie) {
            MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify({}));
            return;
        }

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
                categories: labelList || ""
            },
            yAxis: {
                title: {
                    text: dataSerie.metadata ? dataSerie.metadata.verbose || dataSerie.metadata.verbose.tag || "" : ""
                }
            },
            series: [{
                data: dataSerie
            }]
        };

        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };

    init();

})();
