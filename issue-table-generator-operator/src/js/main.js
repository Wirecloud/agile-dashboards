/*
 * issue-table-generator
 *
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var versions;

    var init = function init() {
        MashupPlatform.wiring.registerCallback("issues", function (data) {
            generateDataset(data);
        });
    };

    var generateDataset = function generateDataset(data) {

        //Saves version data for the dueDate content builder
        if (data && data.metadata) {
            versions = data.metadata.versions;
        }

        //Issue table structure
        var structure = [
            {field: "key", label: "Issue Key", type: "string", sortable: false},
            {field: "title", label: "Issue title", type: "string"},
            {field: "status", label: "Status", type: "string"},
            {field: "assignee", label: "Assignee", type: "string"},
            {field: ["versions", "0"], label: "Sprint", type: "string"},
            {field: "creationDate", label: "Creation Date", type: "date"},
            {field: "resolutionDate", label: "Resolution Date", type: "date"},
            {field: "dueDate", label: "Due Date", type: "date", contentBuilder: contentBuilderDueDate}
        ];

        var dataset = {
            structure: structure,
            data: data,
            id: "key",
            state_function: stateFunc,
            initialSortColumn: null
        };
        MashupPlatform.wiring.pushEvent('dataset', dataset);
    };

    var contentBuilderDueDate = function contentBuilderDueDate (issue) {
        if (issue.dueDate) {
            return issue.dueDate;
        }
        var ver = issue.versions[0];

        for (var i = 0; i < versions.length; i++) {
            if (versions[i].name === ver) {
                return versions[i].endDate;
            }
        }
        //If it has no version nor dueDate, leave cell blank
        return "";
    };

    //Choose the state of the row based on the issue status
    var stateFunc = function stateFunc (issue) {
        switch (issue.status.toLowerCase()) {
            case "closed": return "success";
            case "in progress": return "info";
            default: return "danger";
        }
    };

    init();

    /* test-code */
    var test = {};

    test.generateDataset = generateDataset;
    test.stateFunc = stateFunc;
    test.setVersions = function (ver) {
        versions = ver;
    }
    test.contentBuilderDueDate = contentBuilderDueDate;

    window.IssueTableGenerator = test;

    /* end-test-code */

})();
