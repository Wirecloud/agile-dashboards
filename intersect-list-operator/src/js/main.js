/*
 * intersect-list-operator
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

        // si es un array(lista)
        if (Array.isArray(a) && Array.isArray(b)) {
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
            // Suponiendo que es un string lo compara sin mas
            return a === b;
        }
    };

    //Calcula la interseccion de dos listas
    var calculate_intersection = function calculate_intersection(listA, listB) {
        var result = [];
        //Si uno de ellos no es una lista no existe la interseccion
        if (!Array.isArray(listA) || !Array.isArray(listB)) {
            //MashupPlatform.operator.log("Input endpoint is not a list");
            return result;
        }
        //Solo calcula la interseccion si ambas listas contienen valores
        if (listA.length !== 0 && listB.length !== 0) {
            listA.forEach(function (a) {
                listB.some(function (b) {//Busca cada elemento de listA en listB hasta que uno sea igual
                    //Si el elemento coincide es parte de la interseccion
                    if (checkEqual(a, b)) {
                        result.push(a);
                        return true; // Deja de buscar
                    }
                    return false; //Sigue buscando
                });
            });
        }
        return result;
    };

    //Bindea los endpoints para recibir los valores
    MashupPlatform.wiring.registerCallback("list-A", function (list) {
        list_A = list;
        MashupPlatform.wiring.pushEvent("intersected-list", calculate_intersection(list_A, list_B));
    });
    MashupPlatform.wiring.registerCallback("list-B", function (list) {
        list_B = list;
        //Envia la lista calculada
        MashupPlatform.wiring.pushEvent("intersected-list", calculate_intersection(list_A, list_B));
    });

    /* test-code */
    /* exports checkEqual */
    window.checkEqual = checkEqual;
    /* exports calculate_intersection */
    window.calculate_intersection = calculate_intersection;
    /* end-test-code */

})();