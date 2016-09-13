/*
 * jira-harvester
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 Conwet
 * Licensed under the MIT license.
 */

(function () {
    "use strict";

    var requestHeaders = {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: "Basic cmZlcm5hbmRlejpDMG53M3Rf"
        };

    var token;
    var baseURI;
    var projectId;
    var component;
    var issues;

    var versions;

    var init = function init() {

        MashupPlatform.wiring.registerStatusCallback (pushInfo);

        //On preferences update
        MashupPlatform.prefs.registerCallback(updatePrefs);
        updatePrefs();
    };

    var updatePrefs = function updatePrefs() {
        //Updates the Login credentials
        token = btoa(MashupPlatform.prefs.get("username") + ":" + MashupPlatform.prefs.get("passwd"));
        requestHeaders.Authorization = "Basic " + token;

        //Updates the jira instance URI
        baseURI = MashupPlatform.prefs.get("jira-url");

        //Updates the target project
        projectId = MashupPlatform.prefs.get("project-key");

        //Updates the target component
        component = MashupPlatform.prefs.get("component");

        //Harvest data
        issues = null;
        requestProjectVersions();
    };

    //Sends events through the connected outputs
    var pushInfo = function pushInfo() {
        // send data if available
        if (issues) {
            MashupPlatform.wiring.pushEvent("jira-issues", issues);
        } else {
            requestProjectVersions();
        }
    };

    // Request all the versions of the project (sprints)
    var requestProjectVersions = function requestProjectVersions() {
        // http://jira.fiware.org/rest/api/2/project/APP/versions
        MashupPlatform.http.makeRequest (baseURI + "/rest/api/2/project/" + projectId + "/versions", {
            method: 'GET',
            supportsAccessControl: false,
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);

                //Normalize versions
                versions = [];
                data.forEach(function (version) {
                    versions.push({name: version.name, startDate: version.startDate, endDate: version.releaseDate});
                });

                harvestIssues();
            }
        });
    };

    var harvestIssues = function harvestIssues () {
        var page = 1;
        issues = [];
        var leftIssues = MashupPlatform.prefs.get("max");

        //Check if there are no issues to harvest
        if (leftIssues === 0) {
            return;
        }
        //If max issues is negative -> unlimited
        var unlimited = false;
        if (leftIssues < 0) {
            unlimited = true;
            leftIssues = 100; //This is for setting the issues per page to 100 later
        }

        //Recursively harvest data pages
        var harvestFunc = function (res) {
            if (res && leftIssues > 0) {
                page++;
                //Clamp it to 100
                var toRequest = leftIssues > 100 ? 100 : leftIssues;
                requestComponentIssues(page, toRequest).then(harvestFunc);
                if (!unlimited) { // Do not decrease leftIssues if its unlimited
                    leftIssues -= toRequest;
                }
            } else {

                //Add some metadata
                issues.metadata = {};
                issues.metadata.versions = versions; // :)
                issues.metadata.type = "list";
                issues.metadata.tag = "Issue";
                issues.metadata.verbose = "Jira issues";
                //Add filter configuration
                var filters = [];
                filters.push({name: "Sprints", base: "metadata.versions", property: "name", display: "name", compare: "versions", type: "some"});
                filters.push({name: "Assignee", property: "assigneeId", display: "assignee"});
                filters.push({name: "Status", property: "status", display: "status"});
                filters.push({name: "Type", property: "type", display: "type", type: "eq"});
                filters.push({name: "Issue Key", property: "key", display: "key"});
                filters.push({name: "Creation month", property: "month", display: "month"});

                filters.push({name: "Component", property: "jira.components", display: "jira.components", type: "some"});

                issues.metadata.filters = filters;

                //Push basic data
                MashupPlatform.wiring.pushEvent("jira-issues", issues);
            }
        };
        //Start harvesting issues
        var toRequest = leftIssues > 100 ? 100 : leftIssues;
        requestComponentIssues(page, toRequest).then(harvestFunc);
        if (!unlimited) { // Do not decrease leftIssues if its unlimited
            leftIssues -= toRequest;
        }
    };

    // Request all the issues associated to the component
    var requestComponentIssues = function requestComponentIssues(page, pageSize) {
        //http://jira.fiware.org/rest/api/2/search?jql=component%3DWirecloud&maxResults=1000
        return new Promise (function (fulfill, reject) {
            var jql = "project=" + projectId;
            if (component !== "") {
                jql += " AND component=" + component;
            }

            MashupPlatform.http.makeRequest(baseURI + "/rest/api/latest/search", {
                method: 'GET',
                supportsAccessControl: false,
                parameters: {
                    jql: jql,
                    startAt: page,
                    maxResults: pageSize,
                    expand: "changelog"
                },

                requestHeaders: requestHeaders,
                onSuccess: function (response) {
                    var data = JSON.parse(response.responseText);

                    //If there's no data, its probably the last page.
                    if (data.length === 0) {
                        fulfill(false);
                        return;
                    }

                    issues = issues.concat(normalizeData(data.issues));
                    fulfill(true);
                },
                onError: function (response) {
                    reject(false);
                }
            });
        });
    };

    //Gives Jira's issues a standar issue format common to all harvester's issues
    var normalizeData = function normalizeData (data) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            result.push(normalizeIssue(data[i]));
        }

        // Revert the order so newer issues are last
        // This is for the graphs to sow first on the left and latest on the right
        result.reverse();

        return result;
    };

    //Removes useless response JSON data
    var normalizeIssue = function normalizeIssue (issue) {
        var result = {};

        result.key = issue.key;
        result.title = issue.fields.summary || "";
        result.from = "jira";
        result.link = baseURI + "/browse/" + issue.key;
        result.labels = [];

        //Jira dependent properties.
        result.type = issue.fields.issuetype.name || "";
        result.jira = {};
        result.jira.components = issue.fields.components.map (function (component) {
            return component.name;
        });
        result.jira.projectName = issue.fields.name;
        result.jira.projectKey = issue.fields.key;
        result.jira.priority = issue.fields.priority ? issue.fields.priority.name : null;

        result.creatorId = issue.fields.creator.name;
        result.creator = issue.fields.creator.displayName;
        if (issue.fields.assignee) {
            result.assigneeId = issue.fields.assignee.name;
            result.assignee  = issue.fields.assignee.displayName;
        } else {
            result.assignee = "";
            result.assigneeId = "";
        }

        result.status = issue.fields.status.name;

        //Harvest event dates
        result.creationDate = issue.fields.created;
        result.creationTimestamp = Date.parse(issue.fields.created) || null;

        result.resolutionDate = issue.fields.resolutiondate || null;
        result.resolutionTimestamp = Date.parse(issue.fields.resolutiondate) || null;

        result.updatedDate = issue.fields.updated || null;
        result.updatedTimestamp = Date.parse(issue.fields.updated) || null;

        result.month = issue.fields.created.substring(0, 7);


        result.versions = [];
        if (issue.fields.fixVersions && issue.fields.fixVersions[0]) {
            result.versions.push(issue.fields.fixVersions[0].name);
        } else if (issue.fields.versions && issue.fields.versions[0]) {
            result.versions.push(issue.fields.versions[0].name);
        }

        //Farm versions and append them.
        result.versions = result.versions.concat(findOlderVersions(issue));

        return result;
    };

    var findOlderVersions = function findOlderVersions(issue) {
        var result = [];
        //If there are no changes there cant be any older versions
        if (!issue.changelog || issue.changelog.histories.length <= 0) {
            return result;
        }

        //Look through all the changes for any kind of version change
        var changes = issue.changelog.histories;
        changes.forEach(function (change) {
            var items = change.items;
            items.forEach(function (item) {
                //Check if the version change
                if ((item.field === "Fix Version" || item.field === "Version") && item.fromString) {
                    result.push(item.fromString);
                }
            });
        });

        return result;
    };

    init();
    /* test-code */

    /* end-test-code */

})();

