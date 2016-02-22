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

                requestComponentIssues(data);
            }
        });
    };

    // Request all the issues associated to the component
    var requestComponentIssues = function requestComponentIssues(versions) {
        //http://jira.fiware.org/rest/api/2/search?jql=component%3DWirecloud&maxResults=1000

        MashupPlatform.http.makeRequest (baseURI + "/rest/api/latest/search?jql=component%3D" + component + "&maxResults=1000", {
            method: 'GET',
            supportsAccessControl: false,

            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);
                var msg = data.issues;
                for (var i = 0; i < msg.length; i++) {
                    // Makes version info consistent
                    msg[i].fields.version = {};
                    msg[i].fields.version.name = "";
                    if (msg[i].fields.fixVersions && msg[i].fields.fixVersions[0]) {
                        msg[i].fields.version = msg[i].fields.fixVersions[0];
                    } else if (msg[i].fields.versions && msg[i].fields.versions[0]) {
                        msg[i].fields.version = msg[i].fields.versions[0];
                    }

                    //Add some metadata
                    msg.metadata = {};
                    msg.metadata.versions = versions; // :)
                    msg.metadata.type = "list";
                    msg.metadata.tag = "Issue";
                    msg.metadata.verbose = "Jira issues";
                }

                //Pushes the list of issues
                MashupPlatform.wiring.pushEvent("jira-issues", msg);
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();

