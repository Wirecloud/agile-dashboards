/*
 * github-harvester
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    var milestones = [];
    var DAY_LENGTH = 86400000;

    var oauth2_token;
    var user, pass;
    var repoName;
    var username;

    //Stablish callbacks
    var init = function init() {

        MashupPlatform.wiring.registerStatusCallback(request_github_info);

        //On preferences update
        MashupPlatform.prefs.registerCallback(updatePrefs);
        updatePrefs();
    };

    var updatePrefs = function updatePrefs() {
        oauth2_token = MashupPlatform.prefs.get("oauth2-token").trim();
        username = MashupPlatform.prefs.get("repo-owner").trim();
        repoName = MashupPlatform.prefs.get("repo-name").trim();

        //Updates the Login credentials
        user = MashupPlatform.prefs.get("username");
        pass = MashupPlatform.prefs.get("passwd");

        request_github_info();
    };

    var request_github_info = function request_github_info() {

        var requestHeaders = {
            Accept: "application/vnd.github.v3.html+json"
        };

        //Choose authentication method if any
        if (oauth2_token !== '') {
            requestHeaders.Authorization = 'token ' + oauth2_token;
        } else if (user !== "" && pass !== "") {
            var token = btoa(user + ":" + pass); //Build the basic authentication token
            requestHeaders.Authorization = "Basic " + token;
        }

        if (MashupPlatform.operator.outputs['issue-list'].connected) {

            MashupPlatform.http.makeRequest("https://api.github.com/repos/" + username + "/" + repoName + "/issues", {
                method: 'GET',
                supportsAccessControl: true,
                parameters: {
                    state: 'all',
                    per_page: 100
                },
                requestHeaders: requestHeaders,
                onSuccess: function (response) {
                    milestones = [];
                    var issues = normalizeData(JSON.parse(response.responseText));

                    //Calculate the sprints
                    guessMilestonesBeginDate ();

                    //Add some metadata
                    issues.metadata = {};
                    issues.metadata.versions = milestones;
                    issues.metadata.type = "list";
                    issues.metadata.tag = "Issue";
                    issues.metadata.verbose = "Github issues";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Sprints", base: "metadata.versions", property: "name", display: "name", compare: "versions", type: "some"});
                    filters.push({name: "Assignee", property: "assignee", display: "assignee"});
                    filters.push({name: "Status", property: "status", display: "status"});
                    filters.push({name: "Label", property: "labels", display: "labels", type: "some"});
                    filters.push({name: "Issue Key", property: "key", display: "key"});
                    filters.push({name: "Creation month", property: "month", display: "month"});
                    issues.metadata.filters = filters;

                    MashupPlatform.wiring.pushEvent("issue-list", issues);
                }
            });

        }

        if (MashupPlatform.operator.outputs['commit-list'].connected) {
            MashupPlatform.http.makeRequest("https://api.github.com/repos/" + username + "/" + repoName + "/commits", {
                method: 'GET',
                supportsAccessControl: true,
                parameters: {
                    per_page: 100
                },
                requestHeaders: requestHeaders,
                onSuccess: function (response) {
                    var data = JSON.parse(response.responseText);
                    var commits = [];
                    for (var i = 0; i < data.length; i++) {
                        commits.push(normalizeCommit(data[i]));
                    }

                    //Add some metadata
                    commits.metadata = {};
                    commits.metadata.type = "list";
                    commits.metadata.tag = "Commit";
                    commits.metadata.verbose = "Github commits";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Author", property: "author", display: "author"});
                    filters.push({name: "Month", property: "month", display: "month"});
                    commits.metadata.filters = filters;

                    MashupPlatform.wiring.pushEvent("commit-list", commits);
                }
            });
        }
    };

    //Removes useless JSON data and gives a normalized format
    var normalizeCommit = function normalizeCommit (commit) {
        var result = {};

        result.author = commit.commit.author.name;
        result.month = commit.commit.author.date.substring(0, 7);
        result.timestamp = Date.parse(commit.author.date);

        return result;
    };

    var normalizeData = function normalizeData (data) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            result.push(normalizeIssue(data[i]));
        }

        return result;
    };

    //Removes useless response JSON data and gives normalized format
    var normalizeIssue = function normalizeIssue (issue) {
        var result = {};

        result.key = "#" + issue.number;
        result.from = "github";
        result.title = issue.title || "";
        result.labels = [];
        issue.labels.forEach(function (label) {
            result.labels.push(label.name);
        });

        result.type = null;

        //User data
        if (issue.user) {
            result.creatorId = issue.user.login;
            result.creator = issue.user.login;
        }
        if (issue.assignee) {
            result.assigneeId = issue.assignee.login;
            result.assignee = issue.assignee.login;
        }
        //Status of the issue (closed / open / etc)
        result.status = issue.state;

        //Harvest event dates
        result.creationDate = issue.created_at;
        result.creationTimestamp = Date.parse(issue.created_at) || null;

        result.resolutionDate = issue.closed_at || null;
        result.resolutionTimestamp = Date.parse(issue.closed_at) || null;

        result.updatedDate = issue.updated_at || null;
        result.updatedTimestamp = Date.parse(issue.updated_at) || null;

        result.month = issue.created_at.substring(0, 7);

        //Harvest versions
        result.versions = [];
        if (issue.milestone) {
            result.versions.push(issue.milestone.title);
            addMilestones (issue.milestone.title, issue.milestone.due_on);
            //result.versions.push(issue.milestone.title);
        }

        return result;
    };

    //Add the milestone if its the first time its found.
    var addMilestones = function addMilestones (title, date) {
        var bol = milestones.some(function (stone) {
            return stone.name === title;
        });
        if (!bol) {
            milestones.push({name: title, endDate: date, startDate: null});
        }
    };
    /*
    * Sprint startDate shall be the next day to the end of the previous sprint
    * If there are no previous sprints it'll be the first day of the month
    */
    var guessMilestonesBeginDate = function guessMilestonesBeginDate () {
        // sort them
        milestones.sort(sortMilestones);

        for (var i = 0; i < milestones.length; i++) {
            //Skip milestones with no endDate
            if (milestones[i].endDate === null) {
                continue;
            }

            // If the previous milestone has no endDate
            // begin date shall be the first day of the month
            if (i === 0 || !milestones[i - 1].endDate) {
                milestones[i].startDate = milestones[i].endDate.substring(0, 7) + "-01";
            } else {
                //The moment next to the previous sprint endDate
                milestones[i].startDate = new Date(Date.parse(milestones[i - 1].endDate) + DAY_LENGTH);
            }
        }
    };

    var sortMilestones = function sortMilestones (a, b) {
        var x = a.endDate;
        var y = b.endDate;

        // The milestones with  no dueDate are always the first
        if (x === null) {
            return -1;
        }
        if (y === null) {
            return 1;
        }

        return Date.parse(a.endDate) - Date.parse(b.endDate);
    };

    init();

})();
