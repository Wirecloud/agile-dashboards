

/*
 * setDifference-list-operator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var list_A = [];
    var list_B = [];

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

    //Calcula la diferencia de dos listas
    var calculate_complement = function calculate_complement(listA, listB) {
        var result = [];
        //Si uno de ellos no es una lista no existe la diferencia
        if (!Array.isArray(listA) || !Array.isArray(listB)) {
            return result;
        }

        if (listA.length === 0) {
            return listB;
        } else if (listB.length === 0) {
            return listA;
        }

        //Solo calcula la diferecnia si ambas listas contienen valores
        listA.forEach(function (a) {
            if (!listB.some(function (b, i) {
                if (checkEqual(a, b)) {
                    listB.splice(i, 1);
                    return true; // Deja de buscar
                }
                return false; //Sigue buscando
            })) {
                result.push(a);
            }
        });

        listB.forEach(function (elem) {
            result.push(elem);
        });
        return result;
    };

    //Bindea los endpoints para recibir los valores
    MashupPlatform.wiring.registerCallback("list-A", function (list) {
        list_A = list.splice(0);
        MashupPlatform.wiring.pushEvent("complement-list", calculate_complement(list_A, list_B));
    });
    MashupPlatform.wiring.registerCallback("list-B", function (list) {
        list_B = list.splice(0);
        //Envia la lista calculada
        MashupPlatform.wiring.pushEvent("complement-list", calculate_complement(list_A, list_B));
    });

    /* test-code */
    window.checkEqual = checkEqual;
    window.calculate_complement = calculate_complement;
    /* end-test-code */

})();

