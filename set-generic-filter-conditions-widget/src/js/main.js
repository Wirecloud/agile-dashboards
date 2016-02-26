/*
 * set-generic-filter-conditions-widget
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */
 
/* global StyledElements */


(function () {

    "use strict";

    var data = null;
    var selectors = [];

    var init = function init() {
        MashupPlatform.wiring.registerCallback("input", function (d) {
            data = d;
            calculateFilters();
        });
    };

    var calculateFilters = function calculateFilters () {
        //Wait for data
        if(data === null) {
            return;
        }
        //Check if data has filter info
        if(!data.metadata || !data.metadata.filters || data.metadata.filters.length <= 0) {
            return; //No filters available
        }
        //Clear previous filters
        clearSelectors();

        var dict = data.metadata.filters;
        dict.forEach(function (filter) {
            createSelector(filter);
        });
    };

    //Removes current selectors
    var clearSelectors = function clearSelectors () {
        selectors = [];

        //Remove them from the view
        var body = document.getElementById('filters');
        body.innerHTML = "";

    };

    //Get nested property of an object
    var getProperty = function getProperty (item, attr) {
        attr = attr.split(".");
        for (var i = 0; i < attr.length; i++) {
            item = item[attr[i]] ;
        }
        return item;
    };

    //Creates a new selector based on the input filter
    var createSelector = function createSelector (filter) {
        //Clear body
        var body = document.getElementById('filters');
        var div = document.createElement('div');
        var title = new StyledElements.Fragment("<h4>" + filter.name + "</h4>");
        var select = new StyledElements.Select();
        var found = [];
        var entries = [];

        entries.push({label: 'All', value: ''});
        data.forEach( function (item) {
            var prop = getProperty(item, filter.property);
            if (!found[prop]) {
                found[prop] = true;
                entries.push({label: prop, value: prop});
            }
        });

        select.addEntries(entries);
        select.addEventListener("change", sendEvents.bind(this));

        //Add the selector to the view
        div.appendChild(title);
        div.appendChild(select);
        body.appendChild(div);

        //Save the new selector
        selectors.push(select);
    };

    var sendEvents = function sendEvents() {

    };

    //Init the widget
    init();
    /* test-code */

    /* end-test-code */

})();