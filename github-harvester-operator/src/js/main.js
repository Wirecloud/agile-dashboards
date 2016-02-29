/*
 * github-harvester
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var request_github_info = function request_github_info() {

        var requestHeaders = {
            Accept: "application/vnd.github.v3.html+json"
        };

        var oauth2_token = MashupPlatform.prefs.get('oauth2-token').trim();
        if (oauth2_token !== '') {
            requestHeaders.Authorization = 'token ' + oauth2_token;
        }

        if (MashupPlatform.operator.outputs['issue-list'].connected) {

            MashupPlatform.http.makeRequest("https://api.github.com/repos/Wirecloud/wirecloud/issues", {
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
                        issue.closed_at = Date.parse(issue.closed_at);
                        if (issue.assignee != null) {
                            issue.assignee = issue.assignee.login;
                        }
                        if (issue.milestone != null) {
                            issue.milestone = issue.milestone.title;
                        }
                    });

                    //Add some metadata
                    issues.metadata = {};
                    issues.metadata.type = "list";
                    issues.metadata.tag = "Issue";
                    issues.metadata.verbose = "Github issues";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Milestone", property: "milestone", display: "milestone"});
                    filters.push({name: "Assignee", property: "assignee", display: "assignee"});
                    filters.push({name: "Status", property: "state", display: "state"});
                    issues.metadata.filters = filters;

                    MashupPlatform.wiring.pushEvent("issue-list", issues);
                }
            });

        }

        if (MashupPlatform.operator.outputs['commit-list'].connected) {
            MashupPlatform.http.makeRequest("https://api.github.com/repos/Wirecloud/wirecloud/commits", {
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
                    commits.metadata.tag = "Commit";
                    commits.metadata.verbose = "Github commits";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Author", property: "commit.author.name", display: "commit.author.name"});
                    commits.metadata.filters = filters;


                    MashupPlatform.wiring.pushEvent("commit-list", commits);
                }
            });
        }
    };

    request_github_info();
    MashupPlatform.wiring.registerStatusCallback(request_github_info);

})();
