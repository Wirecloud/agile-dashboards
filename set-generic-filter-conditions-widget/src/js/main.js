/*
 * set-generic-filter-conditions-widget
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
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
        if (data === null) {
            return;
        }
        //Check if data has filter info
        if (!data.metadata || !data.metadata.filters || data.metadata.filters.length <= 0) {
            return; //No filters available

        }
        //Clear previous filters
        clearSelectors();

        var dict = data.metadata.filters;
        dict.forEach(function (filter) {
            createSelector(filter);
        });
        sendEvents();
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
            if (!item[attr[i]]) {
                return null;
            }
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

        //Check if the data to be filtered
        var dataSet = filter.base ? getProperty(data, filter.base) : data;

        entries.push({label: 'All', value: ''});
        dataSet.forEach(function (item) {
            var property = getProperty(item, filter.property);
            var display = getProperty(item, filter.display);

            if (!property || !display) {
                return;
            }

            if (Array.isArray(property)) {
                for (var i = 0; i < property.length; i++) {
                    if (!found[property[i]]) {
                        found[property[i]] = true;
                        entries.push({label: display[i], value: property[i]});
                    }
                }
            } else if (!found[property]) {
                found[property] = true;
                entries.push({label: display, value: property});
            }
        });

        select.addEntries(entries);
        select.addEventListener("change", sendEvents.bind(this));

        //Add the selector to the view
        title.insertInto(div);
        select.insertInto(div);
        body.appendChild(div);

        //Save the new selector
        select.attr = filter; //Save where to compare the info for later building the filter
        selectors.push(select);
    };

    //Build the filters from the selected data and push it
    var sendEvents = function sendEvents() {

        var filters = [];
        selectors.forEach(function (selector) {
            var val = selector.getValue();
            if (val !== '') {
                filters.push({type: selector.attr.type || "eq", value: val, attr: selector.attr.compare || selector.attr.property, name: selector.attr.name});
            }
        });

        MashupPlatform.wiring.pushEvent('filter-conditions', filters);
    };

    //Init the widget
    init();
    /* test-code */

    /* end-test-code */

})();