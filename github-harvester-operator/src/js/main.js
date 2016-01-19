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

        if (MashupPlatform.operator.outputs['issue-list'].connected) {

            MashupPlatform.http.makeRequest("https://api.github.com/repos/Wirecloud/wirecloud/issues", {
                method: 'GET',
                supportsAccessControl: true,
                parameters: {
                    state: 'all',
                    per_page: 100
                },
                requestHeaders: {
                    Accept: "application/vnd.github.v3.html+json",
                    Authorization: 'token ' + MashupPlatform.prefs.get('oauth2-token')
                },
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
                requestHeaders: {
                    Accept: "application/vnd.github.v3.html+json",
                    Authorization: 'token ' + MashupPlatform.prefs.get('oauth2-token')
                },
                onSuccess: function (response) {
                    MashupPlatform.wiring.pushEvent("commit-list", JSON.parse(response.responseText));
                }
            });
        }
    };

    request_github_info();
    MashupPlatform.wiring.registerStatusCallback(request_github_info);

})();
