/*
 * jira-issue-splitter
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var data = null;

    //Initialize as empty data.
    var statusList = [], priorityList = [], assigneeList = [], typeList = [];

    var init = function init() {
        MashupPlatform.wiring.registerCallback("issue-list", function (values) {
            data = values;
            calculateOutputs();
        });
        MashupPlatform.wiring.registerStatusCallback (pushInfo);
    };

    var calculateOutputs = function calculateOutputs() {
        //Resets the cached splits
        statusList = [];
        priorityList = [];
        assigneeList = [];
        typeList = [];

        //Splits the data
        data.forEach(function (issue) {
            if (issue.jira && issue.jira.priority) {
                priorityList.push(issue.jira.priority);
            }

            statusList.push(issue.status);
            assigneeList.push(issue.assignee);
            typeList.push(issue.type);
        });
        pushInfo();
    };

    var pushInfo = function pushInfo() {
        MashupPlatform.wiring.pushEvent("status-list", statusList);
        MashupPlatform.wiring.pushEvent("priority-list", priorityList);
        MashupPlatform.wiring.pushEvent("assignee-list", assigneeList);
        MashupPlatform.wiring.pushEvent("type-list", typeList);
    };

    init();

    /* test-code */

    /* end-test-code */

})();
