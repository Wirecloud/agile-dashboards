
/*
 * packlist
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var itemA = null;
    var itemB = null;

    var checkPacked = function checkPacked(l) {
        return l.metadata && l.metadata.type === "packedList";
    };

    var pack = function pack(itemA, itemB) {
        var result;
        //If theres not two inputs waits
        if (itemA == null || itemB == null) {
            return;
        }

        //Build the packed list
        if (checkPacked (itemA) || checkPacked(itemB)) {
            var aux;

            if (checkPacked(itemA)) {
                result = itemA;
                aux = itemB;
            } else {
                result = itemB;
                aux = itemA;
            }

            //If the other item is also a packed list (We dont do nested packs)
            if (checkPacked (aux)) {
                itemB.forEach (function (e) {
                    result.push(e);
                });
            } else {
                //Just append if its another item
                result.push(aux);
            }
        } else {

            //Creates the packed list
            result = [];
            result.push(itemA);
            result.push(itemB);

            //Looks for metadata in the base items
            var metadata;
            if (itemA.metadata) {
                metadata = itemA.metadata;
            } else {
                if (itemB.metadata) {
                    metadata = itemB.metadata;
                }
            }

            //Builds metadata
            result.metadata = {};
            result.metadata.type = "packedList";
            result.metadata.tag = metadata.tag;
            result.metadata.verbose = metadata.verbose;
        }

        //Push results
        MashupPlatform.wiring.pushEvent("packed-list", result);
    };

    //Bindea los endpoints para recibir los valores
    MashupPlatform.wiring.registerCallback("inputA", function (list) {
        itemA = list;
        pack(itemA, itemB);
    });

    MashupPlatform.wiring.registerCallback("inputB", function (list) {
        itemB = list;
        pack(itemA, itemB);
    });

    /* test-code */

    /* end-test-code */

})();
