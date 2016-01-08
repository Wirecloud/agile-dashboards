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

            if (filters !== '') {
                MashupPlatform.http.makeRequest("https://api.github.com/repos/Wirecloud/wirecloud/issues", {
                    method: 'GET',
                    supportsAccessControl: true,
                    parameters: {
                        state: 'all',
                        milestone: filters.timerange.id,
                        per_page: 100
                    },
                    requestHeaders: {
                        Accept: "application/vnd.github.v3.html+json"
                    },
                    onSuccess: function (response) {
                        MashupPlatform.wiring.pushEvent("issue-list", JSON.parse(response.responseText));
                    }
                });
            } else {
                MashupPlatform.wiring.pushEvent("issue-list", []);
            }
        }

        if (MashupPlatform.operator.outputs['commit-list'].connected) {
            if (filters !== '') {
                MashupPlatform.http.makeRequest("https://api.github.com/repos/Wirecloud/wirecloud/commits", {
                    method: 'GET',
                    supportsAccessControl: true,
                    parameters: {
                        since: filters.timerange.start,
                        until: filters.timerange.end
                        per_page: 100
                    },
                    requestHeaders: {
                        Accept: "application/vnd.github.v3.html+json"
                    },
                    onSuccess: function (response) {
                        MashupPlatform.wiring.pushEvent("commit-list", JSON.parse(response.responseText));
                    }
                });
            } else {
                MashupPlatform.wiring.pushEvent("issue-list", []);
            }
        }
    }

})();
