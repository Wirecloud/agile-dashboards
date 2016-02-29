/*
 * gitlab-harvester
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 Conwet
 * Licensed under the MIT license.
 */
(function () {
    "use strict";

    var baseURI = "https://repo.conwet.fi.upm.es/api/v3";
    var projectID = "101";

    var requestHeaders = {
            Accept: "application/json"
        };

    var init = function init() {
        //Register callbacks
        MashupPlatform.prefs.registerCallback(newPreferences);
        MashupPlatform.wiring.registerStatusCallback(pushInfo);
        newPreferences();
    };

    var newPreferences = function newPreferences () {
        //Updates de AUTH tokens
        requestHeaders["PRIVATE-TOKEN"] = MashupPlatform.prefs.get("private-token");
        requestHeaders.Authorization = MashupPlatform.prefs.get("oauth2-token");

        //Updates de gitlab instance URI
        baseURI = MashupPlatform.prefs.get("gitlab-url") + "/api/v3";

        //Updates the target project
        getProjectId(MashupPlatform.prefs.get("project-name"));
        pushInfo();
    };

    //Sends events through the connected outputs
    var pushInfo = function pushInfo() {
        //if (MashupPlatform.operator.outputs['issue-list'].connected) {
        requestIssues();
        //}
        //if (MashupPlatform.operator.outputs['commit-list'].connected) {
        requestCommits();
        //}
    };

    var getProjectId = function getProjectId(projectName) {
        MashupPlatform.http.makeRequest (baseURI + "/projects", {
            method: 'GET',
            supportsAccessControl: true,
            parameters: {
                state: 'all',
                per_page: 100
            },
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var projects = JSON.parse(response.responseText);
                //Looks for the projectID needed for the querys
                for (var i = 0; i < projects.length; i++) {
                    if (projects[i].name === projectName) {
                        projectID = projects[i].id;
                        break;
                    }
                }
            }
        });
    };

    //Request all the issues of the project
    var requestIssues = function requestIssues () {
        MashupPlatform.http.makeRequest (baseURI + "/projects/" + projectID + "/issues", {
            method: 'GET',
            supportsAccessControl: true,
            parameters: {
                state: 'all',
                per_page: 100
            },
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var issues = JSON.parse(response.responseText);
                issues.forEach(function (issue) {
                    //Keeping it like the Github Harvester (?)
                    //issue.closed_at = Date.parse("null");
                    if (issue.assignee != null) {
                        issue.assignee = issue.assignee.username;
                    }
                    if (issue.milestone != null) {
                        issue.milestone = issue.milestone.title;
                    }
                });

                //Add some metadata
                issues.metadata = {};
                issues.metadata.type = "list";
                issues.metadata.tag = "Issues";
                issues.metadata.verbose = "Gitlab issues";
                //filter metadata
                var filters = [];
                filters.push({name: "Milestone", property: "milestone", display: "milestone"});
                filters.push({name: "Assignee", property: "assignee", display: "assignee"});
                filters.push({name: "Status", property: "state", display: "state"});
                issues.metadata.filters = filters;

                MashupPlatform.wiring.pushEvent("issue-list", issues);
            }
        });
    };

    //Request all the commits of the project
    var requestCommits = function requestCommits() {
        MashupPlatform.http.makeRequest(baseURI + "/projects/" + projectID + "/repository/commits", {
            method: 'GET',
            supportsAccessControl: true,
            parameters: {
                per_page: 100
            },
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var commits = JSON.parse(response.responseText);

                //Add some metadata
                commits.metadata = {};
                commits.metadata.type = "list";
                commits.metadata.tag = "Commits";
                commits.metadata.verbose = "Gitlab commits";
                //filter metadata
                var filters = [];
                filters.push({name: "Author", property: "author_name", display: "author_name"});
                commits.metadata.filters = filters;


                MashupPlatform.wiring.pushEvent("commit-list", commits);
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();
