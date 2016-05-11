/*
 * calculate-tendency
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var marshall = function marshall(value) {
        return JSON.stringify({value: value});
    };

    var valuesCallback = function valuesCallback (values) {
        var i, average, count, maximum, minimum, sorted_values, sum = 0;

        count = values.length;
        minimum = values[0];
        maximum = values[0];

        for (i = 0; i < count; i++) {
            sum += values[i];

            if (values[i] < minimum) {
                minimum = values[i];
            }

            if (values[i] > maximum) {
                maximum = values[i];
            }
        }

        count = values.length;
        average = sum / count;
        MashupPlatform.wiring.pushEvent("minimum", marshall(minimum));
        MashupPlatform.wiring.pushEvent("maximum", marshall(maximum));
        MashupPlatform.wiring.pushEvent("arithmetic-mean", marshall(average));
        MashupPlatform.wiring.pushEvent("count", marshall(count));
        MashupPlatform.wiring.pushEvent("sum", marshall(sum));

        if (MashupPlatform.operator.outputs.median.connected) {
            var median = 0;
            if (count > 0) {
                sorted_values = values.slice(0).sort(function (a, b) {return a - b;});

                var half = Math.floor(count / 2);

                if (count % 2) {
                    median = sorted_values[half];
                } else {
                    median = (sorted_values[half - 1] + sorted_values[half]) / 2.0;
                }
            }
            MashupPlatform.wiring.pushEvent("median", marshall(median));
        }
        if (MashupPlatform.operator.outputs.mode.connected) {
            var numMapping = {};
            var greatestFreq = 0;
            var mode = 0;
            values.forEach(function findMode(number) {
                numMapping[number] = (numMapping[number] || 0) + 1;

                if (greatestFreq < numMapping[number]) {
                    greatestFreq = numMapping[number];
                    mode = number;
                }
            });
            MashupPlatform.wiring.pushEvent('mode', marshall(mode));
        }

        if (MashupPlatform.operator.outputs["standard-deviation"].connected) {
            var squarediffs = values.map(function (value) {
                var diff = value - average;
                return diff * diff;
            });

            var squarediffssum = squarediffs.reduce(function (sum, value) {
                return sum + value;
            }, 0);
            var standarddeviation = Math.sqrt(squarediffssum / count);
            MashupPlatform.wiring.pushEvent('standard-deviation', marshall(standarddeviation));
        }

    };

    MashupPlatform.wiring.registerCallback("value-list", valuesCallback);

    /* test-code */
    var test = {};

    test.valuesCallback = valuesCallback;

    window.CalculateTendency = test;
    /* end-test-code */

})();
