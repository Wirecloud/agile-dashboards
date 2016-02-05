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
    function checkEqual(a, b) {
        /** a y b pueden ser arrays(lista), strings u objetos **/

        //Si no son del mismo tipo no pueden ser iguales
        if (a.constructor !== b.constructor) {
            return false;
        }

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
        }
        // Suponiendo que es un string lo compara sin mas
        else {
            return a === b;
        }
    }

    //Calcula la interseccion de dos listas
    function calculate_intersection(){
        var result = [];

        //Solo calcula la interseccion si ambas listas contienen valores
        if (list_A.length !== 0 && list_B.length !== 0){
            list_A.forEach(function(a){
                list_B.some(function(b){//Busca cada elemento de list_A en list_B hasta que uno sea igual
                    //Si el elemento coincide es parte de la interseccion
                    if(checkEqual(a,b)){
                        result.push(a);
                        return true // Deja de buscar
                    }
                    return false //Sigue buscando
                });
            });
        }
        
        //Envia la lista calculada
        MashupPlatform.wiring.pushEvent("intersected-list", result);
    }

    //Bindea los endpoints para recibir los valores
    MashupPlatform.wiring.registerCallback("list-A", function (list) {
        list_A = list;
        calculate_intersection();
    });
    MashupPlatform.wiring.registerCallback("list-B", function (list) {
        list_B = list;
        calculate_intersection();
    });

})();
