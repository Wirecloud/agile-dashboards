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
    var rapidViewId = "1";

    var component = "Wirecloud";



    ///rest/api/2/search?jql=project="Your Project Key"

    var init = function init() {
        //On preferences update
        MashupPlatform.prefs.registerCallback(function (new_preferences) {
            //Updates the OAUTH token
            
            if ("oauth2-token" in new_preferences) {
                oauth2Token = MashupPlatform.prefs.get("oauth2-token");
            }

            //Updates the Login credentials
            if ("username" in new_preferences || "passwd" in new_preferences) {
                //token = atob(MashupPlatform.prefs.get("username") + ":" + MashupPlatform.prefs.get("passwd"));
                //requestHeaders.Authorization = token;
            }

            //Updates the jira instance URI
            if ("jira-url" in new_preferences) {
                //baseURI = MashupPlatform.prefs.get("jira-url");
            }

            //Updates the target issue
            if ("project-key" in new_preferences) {
                projectId = MashupPlatform.prefs.get("project-key");
            }

            if ("rapid-view" in new_preferences) {
                rapidViewId = MashupPlatform.prefs.get("rapid-view");
            }
            
            pushInfo();
        });
    };

    //Sends events through the connected outputs
    var pushInfo = function pushInfo() {
        //requestIssue();
        //requestSprints();

        //requestComponentIssues();
        requestProjectVersions();
    };

    var requestProjectVersions = function requestProjectVersions() {
        // http://jira.fiware.org/rest/api/2/project/APP/versions
        MashupPlatform.http.makeRequest (baseURI +"/rest/api/2/project/" + projectId + "/versions", {
            method: 'GET',
            supportsAccessControl: false,
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);

                requestComponentIssues(data);
            }
        });        
    };

    var requestComponentIssues = function requestComponentIssues(versions) {
        //http://jira.fiware.org/rest/api/2/search?jql=component%3DWirecloud&maxResults=1000

        MashupPlatform.http.makeRequest (baseURI +"/rest/api/latest/search?jql=component%3D" + component + "&maxResults=1000", {
            method: 'GET',
            supportsAccessControl: false,

            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);
                var msg = {
                    versions: versions,
                    issues: data.issues
                };
                MashupPlatform.wiring.pushEvent("jira-issues", msg);
            }
        });
    };















    //Request all the issues of the project
    var requestProjectIssues = function requestProjectIssues () {
        MashupPlatform.http.makeRequest (baseURI +"/rest/api/latest/search?jql=project=" + projectId , {
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


    // https://mognom.atlassian.net/rest/greenhopper/1.0/rapidview


    // https://mognom.atlassian.net/rest/greenhopper/latest/sprintquery/\1\?includeHistoricSprints\=true\&includeFutureSprints\=true
    // https://mognom.atlassian.net/rest/greenhopper/latest/rapid/charts/sprintreport\?rapidViewId\=1\&sprintId\=2

    // https://mognom.atlassian.net/rest/api/2/search\?jql\=project=TES%20AND%20Sprint=1

    // Resulting sprint list
    var sprintList = [];
    var aux = 0; // Count of remaining sprints to be harvested


    //Gets all the sprints of the rapid view
    var requestSprints = function requestSprints () {
        sprintList = [];
        MashupPlatform.http.makeRequest (baseURI + "/rest/greenhopper/latest/sprintquery/" + rapidViewId + "\?includeHistoricSprints\=true\&includeFutureSprints\=true" , { //lol
            method: 'GET',
            supportsAccessControl: false,
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);
                
                aux = data.sprints.length;

                data.sprints.forEach(function (sprint) {
                    requestSprintDates(sprint.id);
                });
            }
        });
    };

    // Gets the start and end date of the sprint + brief of the sprint's issues
    var requestSprintDates = function requestSprintDates(sprintId) {
        MashupPlatform.http.makeRequest (baseURI + "/rest/greenhopper/latest/rapid/charts/sprintreport\?rapidViewId\=" + rapidViewId + "\&sprintId\=" + sprintId , { //lol2
            method: 'GET',
            supportsAccessControl: false,
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);                

                requestSprintIssues(data.sprint, sprintId);
            }
        });
    };

    // Gets detailed information of the issues associated to the sprint and project
    var requestSprintIssues = function requestSprintIssues(sprintData, sprintId) {
        MashupPlatform.http.makeRequest (baseURI + "/rest/api/latest/search\?jql\=project=" + projectId + "%20AND%20Sprint=" + sprintId, { //lol5
            method: 'GET',
            supportsAccessControl: false,
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);
                
                var sprint = {
                    sprint: sprintData,
                    issues: data.issues
                };

                sprintList.push(sprint);

                aux --;
                if (aux === 0) {
                    MashupPlatform.wiring.pushEvent("jira-sprints", sprintList);
                }
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();

