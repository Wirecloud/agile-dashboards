"use strict";

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

module.exports.checkEqual = checkEqual;