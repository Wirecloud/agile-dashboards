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

    var checkEqual = function checkEqual(a, b) {
        /** a y b pueden ser arrays(lista), strings u objetos **/

        // si es un array(lista)
        if (Array.isArray(a) && Array.isArray(b)) {
            //Si no tienen el mismo tamaño no pueden ser iguales
            if (a.length !== b.length) {
                return false;
            }
            //Comara uno a uno los elementos de la lista
            var i;
            for (i = 0; i < a.length; i++) {
                if (!checkEqual(a[i], b[i])) { //Podrian ser a su vez una lista
                    return false;
                }
            }
            // Si no ha detectado diferencias son iguales
            return true;
        } else {
            // Suponiendo que es un string lo compara sin mas
            return a === b;
        }
    };

    //Calcula la interseccion de dos listas
    var calculate_union = function calculate_union(listA, listB) {
        var result = [];
        //Si uno de ellos no es una lista no existe la interseccion
        if (!Array.isArray(listA) || !Array.isArray(listB)) {
            //MashupPlatform.operator.log("Input endpoint is not a list");
            return result;
        }
        //Solo calcula la interseccion si ambas listas contienen valores
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
        MashupPlatform.wiring.pushEvent("intersected-list", calculate_union(list_A, list_B));
    });
    MashupPlatform.wiring.registerCallback("list-B", function (list) {
        list_B = list;
        //Envia la lista calculada
        MashupPlatform.wiring.pushEvent("intersected-list", calculate_union(list_A, list_B));
    });

    /* test-code */
    /* exports checkEqual */
    window.checkEqual = checkEqual;
    /* exports calculate_intersection */
    window.calculate_union = calculate_union;
    /* end-test-code */

})();
