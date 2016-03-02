/*
 * union-list
 *
 *
 * Copyright (c) 2016 CoNwet
 * Licensed under the MIT license.
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

    //Calcula la union de dos listas
    var calculate_union = function calculate_union(listA, listB) {
        var result = [];
        //Si uno de ellos no es una lista no existe la union
        if (!Array.isArray(listA) || !Array.isArray(listB)) {
            //MashupPlatform.operator.log("Input endpoint is not a list");
            return result;
        }
        //Solo calcula la union si ambas listas contienen valores
        if (listA.length !== 0 && listB.length !== 0) {
            //Añade los elementos de la listA a la solucion
            result = result.concat(listA);

            listB.forEach(function (b) {
                //Busca cada elemento de listA en listB hasta que uno sea igual
                if (listA.every(function (a) { return !checkEqual(a, b); })) {
                    result.push(b);
                }
            });
        }
        return result;
    };

    //Bindea los endpoints para recibir los valores
    MashupPlatform.wiring.registerCallback("list-A", function (list) {
        list_A = list;
        MashupPlatform.wiring.pushEvent("union-list", calculate_union(list_A, list_B));
    });
    MashupPlatform.wiring.registerCallback("list-B", function (list) {
        list_B = list;
        //Envia la lista calculada
        MashupPlatform.wiring.pushEvent("union-list", calculate_union(list_A, list_B));
    });

    /* test-code */
    /* exports checkEqual */
    window.checkEqual = checkEqual;
    /* exports calculate_union */
    window.calculate_union = calculate_union;
    /* end-test-code */

})();
