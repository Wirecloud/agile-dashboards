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

        //Gets the saved values
        var aux = MashupPlatform.widget.getVariable('chosenValues').get();
        var chosenValues = null;
        if (aux && aux !== "") {
            chosenValues = JSON.parse(aux);
        }
        
        var dict = data.metadata.filters;
        dict.forEach(function (filter) {
            var chosenValue = "";
            //Searchs for the current filter saved value
            if(chosenValues) {
                chosenValues.some(function (value) {
                    if (value.name === filter.name) {
                        chosenValue = value.value;
                    }
                });
            }
            createSelector(filter, chosenValue);
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
        //If theres no attr then the result is the original item
        if (!attr || attr === "") {
            return item;
        }
        //Search for the propertys
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
    var createSelector = function createSelector (filter, chosenValue) {
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
            //If its a list loop through it
            if (Array.isArray(property)) {
                for (var i = 0; i < property.length; i++) {
                    if (!found[property[i]]) {
                        found[property[i]] = true;
                        entries.push({label: display[i], value: property[i]});
                    }
                }
            //If its a single value
            } else if (!found[property]) {
                found[property] = true;
                entries.push({label: display, value: property});
            }
        });
        select.addEntries(entries);
        select.addEventListener("change", sendEvents.bind(this));

        //Updates the default value
        select.setValue(chosenValue);

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
        //Wipes selected values
        var newValues = [];

        var filters = [];
        selectors.forEach(function (selector) {
            var val = selector.getValue();
            if (val !== '') {
                filters.push({type: selector.attr.type || "eq", value: val, attr: selector.attr.compare || selector.attr.property, name: selector.attr.name});
                //Saves the selected value
                newValues.push({name: selector.attr.name, value: val});
            }
        });

        //Updates the new values
        var chosenValues = MashupPlatform.widget.getVariable('chosenValues');
        chosenValues.set(JSON.stringify(newValues));

        MashupPlatform.wiring.pushEvent('filter-conditions', filters);
    };

    //Init the widget
    init();
    /* test-code */

    /* end-test-code */

})();