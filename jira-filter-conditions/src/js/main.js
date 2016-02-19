/*
 * jira-filter-conditions
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

/* global StyledElements */
/* exported SprintReleaseSelector */
(function () {

    "use strict";


    var issues = null;
    var versions = null;

    var versionSelect = new StyledElements.Select({initialEntries: [{label: 'Any version', value: ''}]});
    var assigneeSelect = new StyledElements.Select({initialEntries: [{label: 'Any assignee', value: ''}]});

    var statusSelect = new StyledElements.Select({initialEntries: [{label: 'Any status', value: ''}]});


    var createFilterOptions = function createFilterOptions() {
        if (issues === null || versions === null) {
            return;
        }
        
        versionSelector();
        assigneeSelector();
        statusSelector();

    };

    var buildSelectors = function buildSelectors() {
        var title;
        // Version select
        title = new StyledElements.Fragment('<h4>Version</h4>');
        title.insertInto(document.body);
        versionSelect.addEventListener('change', sendEvents.bind(this));
        versionSelect.insertInto(document.body);

        // Assignee select
        title = new StyledElements.Fragment('<h4>Assignee</h4>');
        title.insertInto(document.body);
        assigneeSelect.addEventListener('change', sendEvents.bind(this));
        assigneeSelect.insertInto(document.body);

        //Status select
        title = new StyledElements.Fragment('<h4>Status</h4>');
        title.insertInto(document.body);
        statusSelect.addEventListener('change', sendEvents.bind(this));
        statusSelect.insertInto(document.body);
    };


    //Adds the version selector to the widget
    var versionSelector = function versionSelector() {
        
        // Adds an entry for each version
        var entries = [];
        entries.push({label: 'Any version', value: ''});
        versions.forEach(function (version) {
            entries.push({label: version.name, value: version.name });
        });

        versionSelect.clear();
        versionSelect.addEntries(entries);
    };


    var assigneeSelector = function assigneeSelector() {
        // Adds an entry for each assignee
        var entries = [];
        var found = [];

        entries.push({label: 'Any assignee', value: ''});
        issues.forEach(function (issue) {
            if(issue.fields.assignee && !found[issue.fields.assignee.name] ) {
                found[issue.fields.assignee.name] = true;
                entries.push({label: issue.fields.assignee.displayName, value: issue.fields.assignee.name });
            }
        });

        //Creates the StryledElement
        assigneeSelect.clear();
        assigneeSelect.addEntries(entries);
    };

    var statusSelector = function statusSelector() {
        // Adds an entry for each status
        var entries = [];
        var found = [];

        entries.push({label: 'Any status', value: ''});
        issues.forEach(function (issue) {
            //Only add to the filter new statuses
            if(!found[issue.fields.status.id]) {
                found[issue.fields.status.id] = true;
                entries.push({label: issue.fields.status.name, value: issue.fields.status.id });
            }
        });

        statusSelect.clear();
        statusSelect.addEntries(entries);

    };

    // Harvest data from the selectors and generate the filter data.
    var sendEvents = function sendEvents() {
        //Harvest data
        var version = versionSelect.getValue();
        var assignee = assigneeSelect.getValue();
        var status = statusSelect.getValue();

        //Create filters
        var filters = [];
        if (version !== '') {
            filters.push({type: 'eq', attr: "fields.version.name", value: version});
        }

        if (assignee !== '') {
            filters.push({type: 'eq', attr: "fields.assignee.name", value: assignee});
        }

        if (status !== '') {
            filters.push({type: 'eq', attr: "fields.status.id", value: status});
        }

        //Push data
        MashupPlatform.wiring.pushEvent('filter-conditions', filters);
    };


    MashupPlatform.wiring.registerCallback("jira-issues", function (data) {
        issues = data;
        versions = data.metadata.versions;
        createFilterOptions();
    });


    buildSelectors();
    /* test-code */

    /* end-test-code */

})();