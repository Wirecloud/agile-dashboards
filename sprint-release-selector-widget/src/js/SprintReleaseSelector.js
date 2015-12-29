/*
 * sprint-release-selector
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

/* exported SprintReleaseSelector */

var SprintReleaseSelector = (function () {

    "use strict";

    /*********************************************************
     ************************CONSTANTS*************************
     *********************************************************/

    /*********************************************************
     ************************VARIABLES*************************
     *********************************************************/

    /********************************************************/
    /**********************CONSTRUCTOR***********************/
    /********************************************************/

    var SprintReleaseSelector = function SprintReleaseSelector() {

        var select = new StyledElements.Select({
            initialEntries: [
                {label: 'Sprint 1.1.1', value: ''},
                {label: 'Sprint 1.1.1', value: ''},
                {label: 'Sprint 1.1.1', value: ''},
                {label: 'Sprint 1.1.1', value: ''},
            ]
        });
        select.insertInto(document.body);

    };

    /*********************************************************
     **************************PRIVATE*************************
     *********************************************************/

    /****************************************/
    /************AUXILIAR FUNCTIONS**********/
    /****************************************/

    /* test-code */
    /* end-test-code */

    return SprintReleaseSelector;

})();
