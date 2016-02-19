/*
 * burndown-chart-generator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var timestamps = null;
    var values = null;

    var dayLength = 86400000;

    var sprint = null;

    var startDate = null;
    var endDate = null;

    var version = null;

    var verId = null;





    function calculateInterval(days, issuesCount) {
        var serie = [];

        var factor = issuesCount / (days.length -1);

        days.forEach(function(d, index) {
            serie.push([index, issuesCount - factor * index]);
        });

        return serie;
    }

    function calculateProgress(days, issues) {
        var serie = [];
        var total = issues.length;
        var count = 0;
        var today = new Date();
        days.forEach(function(day, index) {
            if(day > today) {
                return;
            }


            for (var i = 0; i < issues.length; i++){

                if (day >= Date.parse(issues[i].fields.resolutiondate) - dayLength +1 ) {
                    count++;
                    issues.splice(i, 1);
                    i--;
                }
            }
            
            serie.push([index, total - count]);
        });
        return serie;
    }

    // Get the timestamps of each day of the sprint
    function getDays(start, end) {
        var result = [];
        var aux = start;
        result.push(aux);
        while (aux < end) {
            aux += dayLength;
            result.push(aux);
        }
        return result;
    }



    var plot = function plot() {

        //Check if there's missing data
        if(endDate === null || sprint === null) {
            return;
        }
        

        var days = getDays(Date.parse(startDate), Date.parse(endDate));

        if (sprint == null) {
            return;
        }

        var options;
        options = {

            tooltip: {
                shared: true
            },

            title: {
                text: version
            },

            series: [{
                data: calculateInterval(days, sprint.length),
                name: "Reference"
            },
            {
                data: calculateProgress(days, sprint),
                name: "Actual"
            }]
        };
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));
    };

    var cleanPlot = function cleanPlot() {
        var options = {};
        MashupPlatform.wiring.pushEvent("chart-options", JSON.stringify(options));  
    };

    MashupPlatform.wiring.registerCallback("issues", function (data) {
        sprint = data;
        version = null;

        if(sprint.length === 0) {
            cleanPlot();
            return;
        }

        version = sprint[0].fields.version.name;

        data.metadata.versions.forEach( function(ver) {
            if (ver.name === version) {
                startDate = ver.startDate;
                endDate = ver.releaseDate;
            }
        });

        plot();
    });
})();
