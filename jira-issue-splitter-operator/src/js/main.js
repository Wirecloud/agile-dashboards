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

    var statusList, priorityList, assigneeList, typeList;

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
            statusList.push(issue.state);
            if (issue.fields.priority) {
                priorityList.push(issue.fields.priority.name);
            }
            assigneeList.push(issue.assignee);
            typeList.push(issue.fields.issuetype.name);
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
