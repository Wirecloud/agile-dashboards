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

    request_github_info();
    MashupPlatform.wiring.registerStatusCallback(request_github_info);

})();
