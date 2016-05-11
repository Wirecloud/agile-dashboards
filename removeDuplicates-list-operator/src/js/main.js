/*
 * removeDuplicates-list
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var result = null;

    var init = function init() {

        //Binds the callbacks
        MashupPlatform.wiring.registerCallback("input-list", function (input) {
            result = removeDuplicates(input);
            pushData();
        });

        //If anything changes, trys to send data
        MashupPlatform.wiring.registerStatusCallback(pushData);
    };

    var pushData = function pushData() {
        if (result !== null) {
            MashupPlatform.wiring.pushEvent("output-list", result);
        }
    };

    var removeDuplicates = function removeDuplicates(list) {
        if (!Array.isArray(list)) {
            throw new MashupPlatform.wiring.EndpointTypeError('Expecting a list');
        }

        //for each item on the original list, compares it to the rest
        for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) {

                //Looks for equal items and removes them
                if (i !== j && checkEqual(list[i], list[j])) {
                    list.splice(j, 1);
                    j--;
                }
            }
        }

        return list;
    };

    //Comprueba si cosas son iguales recursivamente con busqueda por profundidad
    var checkEqual = function checkEqual(a, b) {
        /** a y b pueden ser arrays(lista), strings u objetos **/
        //Si no son del mismo tipo no pueden ser iguales
        if (a.constructor !== b.constructor) {
            return false;
        }
        if (typeof a === "object" && typeof b === "object") {

            // si es un array(lista)
            if (a.constructor === Array && b.constructor === Array) {
                //Si no tienen el mismo tamaño no pueden ser iguales
                if (a.length !== b.length) {
                    return false;
                }
                //Compara uno a uno los elementos de la lista
                var i;
                for (i = 0; i < a.length; i++) {
                    if (!checkEqual(a[i], b[i])) { //Podrian ser a su vez una lista
                        return false;
                    }
                }
                // Si no ha detectado diferencias son iguales
                return true;
            } else {
                //Son un objeto pero no array
                if (!checkEqual(Object.keys(a), Object.keys(b))) {
                    return false;
                }
                for (var k in a) {
                    if (!checkEqual(a[k], b[k])) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            // Suponiendo que es un string lo compara sin mas
            return a === b;
        }
    };

    init();
    /* test-code */
    window.checkEqual = checkEqual;
    window.removeDuplicates = removeDuplicates;
    /* end-test-code */

})();
