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

        //Gets version info and all component issues
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
                
                var msg = data.issues;
                msg.versions = versions;

                for (var i = 0; i < msg.length; i++) {
                    // Makes version info consistent
                    msg[i].fields.version = "";
                    if(msg[i].fields.fixVersions && msg[i].fields.fixVersions[0]) {
                        msg[i].fields.version = msg[i].fields.fixVersions[0].name || ""; 
                    } else if (msg[i].fields.versions && msg[i].fields.versions[0]) {
                        msg[i].fields.version = msg[i].fields.versions[0].name || "";
                    }
                }
                MashupPlatform.wiring.pushEvent("jira-issues", msg);
            }
        });
    };

    init();
    /* test-code */

    /* end-test-code */

})();

