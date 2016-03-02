/*
 * jira-harvester
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 Conwet
 * Licensed under the MIT license.
 */

(function () {
    "use strict";

    var baseURI = "http://jira.fiware.org";

    var requestHeaders = {
            Accept: "application/json",
            "Content-Type": "Application/json",
            Authorization: "Basic cmZlcm5hbmRlejpDMG53M3Rf"
        };

    var token;
    var oauth2Token;

    var projectId = "APP";

    var component = "Wirecloud";

    var init = function init() {

        MashupPlatform.wiring.registerStatusCallback (pushInfo);

        //On preferences update
        MashupPlatform.prefs.registerCallback(updatePrefs);
        updatePrefs();
    };

    var updatePrefs = function updatePrefs() {
        //Updates the OAUTH token
        oauth2Token = MashupPlatform.prefs.get("oauth2-token");

        //Updates the Login credentials
        token = btoa(MashupPlatform.prefs.get("username") + ":" + MashupPlatform.prefs.get("passwd"));
        requestHeaders.Authorization = "Basic " + token;

        //Updates the jira instance URI
        baseURI = MashupPlatform.prefs.get("jira-url");

        //Updates the target project
        projectId = MashupPlatform.prefs.get("project-key");

        //Updates the target component
        component = MashupPlatform.prefs.get("component");
        pushInfo();
    };

    //Sends events through the connected outputs
    var pushInfo = function pushInfo() {
        //Gets version info and all component issues
        requestProjectVersions();
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
                var versions = [];
                data.forEach(function (version) {
                    versions.push({name: version.name, startDate: version.startDate, endDate: version.releaseDate});
                });

                requestComponentIssues(versions);
            }
        });
    };

    // Request all the issues associated to the component
    var requestComponentIssues = function requestComponentIssues(versions) {
        //http://jira.fiware.org/rest/api/2/search?jql=component%3DWirecloud&maxResults=1000

        MashupPlatform.http.makeRequest (baseURI + "/rest/api/latest/search?jql=component%3D" + component + "&maxResults=1000&expand=changelog", {
            method: 'GET',
            supportsAccessControl: false,

            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);
                var msg = normalizeData(data.issues);

                //Add some metadata
                msg.metadata = {};
                msg.metadata.versions = versions; // :)
                msg.metadata.type = "list";
                msg.metadata.tag = "Issue";
                msg.metadata.verbose = "Jira issues";
                //Add filter configuration
                var filters = [];
                filters.push({name: "Sprints", base: "metadata.versions", property: "name", display: "name", compare: "versions", type: "some"});
                filters.push({name: "Assignee", property: "assigneeId", display: "assignee"});
                filters.push({name: "Status", property: "status", display: "status"});
                msg.metadata.filters = filters;

                //Pushes the list of issues
                MashupPlatform.wiring.pushEvent("jira-issues", msg);
            }
        });
    };

    //Gives Jira's issues a standar issue format common to all harvester's issues
    var normalizeData = function normalizeData (data) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            result.push(normalizeIssue(data[i]));
        }

        return result;
    };

    //Removes useless response JSON data
    var normalizeIssue = function normalizeIssue (issue) {
        var result = {};

        result.type = issue.fields.issuetype.name || "";
        result.jira = {};
        result.jira.components = issue.fields.components;
        result.jira.projectName = issue.fields.name;
        result.jira.projectKey = issue.fields.key;
        result.jira.priority = issue.fields.priority ? issue.fields.priority.name : null;

        result.creatorId = issue.fields.creator.name;
        result.creator = issue.fields.creator.displayName;
        result.assigneeId = issue.fields.assignee.name;
        result.assignee = issue.fields.assignee.displayName;

        result.status = issue.fields.status.name;

        //Harvest event dates
        result.creationDate = issue.fields.created;
        result.creationTimestamp = Date.parse(issue.fields.created) || null;

        result.resolutionDate = issue.fields.resolutiondate || null;
        result.resolutionTimestamp = Date.parse(issue.fields.resolutiondate) || null;

        result.updatedDate = issue.fields.updated || null;
        result.updatedTimestamp = Date.parse(issue.fields.updated) || null;

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
