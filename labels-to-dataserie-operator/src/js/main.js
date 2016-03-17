/*
 * labels-to-dataserie
 * https://git://repo.conwet.fi.upm.es/wirecloud/agile-dashboards.git
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var dataSerie = [], labelSerie = [];

    var init = function init() {
        MashupPlatform.wiring.registerCallback("label-list", function (data) {
            //Update current data and push it
            toNumberSerie(data);
            pushData();
        });

        MashupPlatform.wiring.registerStatusCallback (pushData);
    };

    var toNumberSerie = function toNumberSerie (labels) {
        var aux = [];

        labels.forEach (function (data) {
            if (aux[data]) {
                aux[data] += 1;
            } else {
                aux[data] = 1;
            }
        });

        //Build the data and label series
        dataSerie = [];
        labelSerie = [];
        for (var key in aux) {
            labelSerie.push(key);
            dataSerie.push(aux[key]);
        }
    };

    //Push current data
    var pushData = function pushData () {
        MashupPlatform.wiring.pushEvent("data-serie", dataSerie);
        MashupPlatform.wiring.pushEvent("label-serie", labelSerie);
    };

    init();
    /* test-code */

    /* end-test-code */

})();
