/*
 * BasicListMathOperator
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";
    var inputA = null;
    var inputB = null;

    var init = function init() {

        //Bind the callbacks
        MashupPlatform.wiring.registerCallback("input-a", function (input) {
            inputA = input;
            calculateOutputs();
        });
        MashupPlatform.wiring.registerCallback("input-b", function (input) {
            inputB = input;
            calculateOutputs();
        });

        //If anything changes trys to send data
        MashupPlatform.wiring.registerStatusCallback(calculateOutputs);
    };

    //Basic operations
    var additionOp = function additioOp(x, y) {
        //Check if the operation types are valid
        if ((x.constructor !== String && x.constructor !== Number) || (y.constructor !== String && y.constructor !== Number)) {
            throw new MashupPlatform.wiring.EndpointTypeError('Expecting a (list of) number or string');
        }

        return x + y;
    };

    var subtractionOp = function subtractionOp(x, y) {
        //Check if the operation types are valid
        if ((x.constructor !== String && x.constructor !== Number) || (y.constructor !== String && y.constructor !== Number)) {
            throw new MashupPlatform.wiring.EndpointTypeError('Expecting a (list of) number or string');
        }

        return x - y;
    };

    var multiplicationOp = function multiplicationOp(x, y) {
        //Check if the operation types are valid
        if (x.constructor !== Number || y.constructor !== Number) {
            throw new MashupPlatform.wiring.EndpointTypeError('Expecting a (list of) number');
        }

        return x * y;
    };

    var divisionOp = function divisionOp(x, y) {
        //Check if the operation types are valid
        if (x.constructor !== Number || y.constructor !== Number) {
            throw new MashupPlatform.wiring.EndpointTypeError('Expecting a (list of) number');
        }

        return x / y;
    };

    var calculateOutputs = function calculateOutputs() {
        if (inputA == null || inputB == null) {
            return;
        }

        MashupPlatform.wiring.pushEvent("addition", calculate(additionOp));
        MashupPlatform.wiring.pushEvent("subtraction", calculate(subtractionOp));
        MashupPlatform.wiring.pushEvent("multiplication", calculate(multiplicationOp));
        MashupPlatform.wiring.pushEvent("division", calculate(divisionOp));
    };

    var calculate = function calculate(operation) {
        var result = [];

        //Check if both are lists
        if (Array.isArray(inputA) && Array.isArray(inputB)) {
            inputA.forEach(function (a, i) {
                result.push(operation(a, inputB[i]));
            });

            return result;
        }
        //If one of the inputs is a list but the other is not, it applies the operation to all the list

        //If inputA is an array but inputB is not
        if (Array.isArray(inputA)) {
            inputA.forEach(function (a) {
                result.push(operation(a, inputB));
            });
            return result;
        } else {
            //If inputB is an array but inputA is not
            if (Array.isArray(inputB)) {
                inputB.forEach(function (b) {
                    result.push(operation(b, inputA));
                });
                return result;
            }
        }

        return operation(inputA, inputB);
    };


    init();

    /* test-code */

    /* end-test-code */

})();
