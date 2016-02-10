/*
 * jira-harvester
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 Conwet
 * Licensed under the MIT license.
 */

(function () {
    "use strict";

    var baseURI = "https://jira.atlassian.com/rest/api/latest/";
    var issueKey = "JRA-9";

    var requestHeaders = {
            Accept: "application/json"
        };

    var init = function init() {
        //On preferences update
        MashupPlatform.prefs.registerCallback(function (new_preferences) {
            //Updates de OAUTH token
            if ("oauth2-token" in new_preferences) {
                requestHeaders.Authorization = MashupPlatform.prefs.get("oauth2-token");
            }

            //Updates de jira instance URI
            if ("jira-url" in new_preferences) {
                baseURI = MashupPlatform.prefs.get("jira-url") + "/rest/api/latest/";
            }

            //Updates the target issue
            if ("issue-key" in new_preferences) {
                issueKey = MashupPlatform.prefs.get("issue-key");
            }
            pushInfo();
        });
    };

    //Sends events through the connected outputs
    var pushInfo = function pushInfo() {
        requestIssue();
    };

    //Request all the issues of the project
    var requestIssue = function requestIssue () {
        MashupPlatform.http.makeRequest (baseURI + "issue/" + projectID + , {
            method: 'GET',
            supportsAccessControl: true,
            parameters: {
                state: 'all',
                per_page: 100
            },
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var issue = JSON.parse(response.responseText);

                MashupPlatform.wiring.pushEvent("issue-list", issue);
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();