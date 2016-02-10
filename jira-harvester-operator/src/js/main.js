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

    var token;
    var oauth2Token;



    ///rest/api/2/search?jql=project="Your Project Key"

    var init = function init() {
        //On preferences update
        MashupPlatform.prefs.registerCallback(function (new_preferences) {
            //Updates the OAUTH token
            if ("oauth2-token" in new_preferences) {
                //TODO
            }

            //Updates the Login credentials
            if ("username" in new_preferences || "passwd" in new_preferences) {
                token = atob(MashupPlatform.prefs.get("username") + ":" + MashupPlatform.prefs.get("passwd"));
                requestHeaders.Authentication = token;
            }

            //Updates the jira instance URI
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
        MashupPlatform.http.makeRequest (baseURI + "search?jql=project=" + projectID , {
            method: 'GET',
            supportsAccessControl: true,
            parameters: {
                state: 'all',
                per_page: 100
            },
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var issues = JSON.parse(response.responseText);
                MashupPlatform.wiring.pushEvent("issue-list", issues);
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();