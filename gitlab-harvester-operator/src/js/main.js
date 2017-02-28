/*
 * gitlab-harvester
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2016 Conwet
 * Licensed under the MIT license.
 */
(function () {
    "use strict";

    var baseURI = "https://repo.conwet.fi.upm.es/api/v3";
    var issueBaseURI = "";
    var projectID = "101";

    var milestones = [];
    var DAY_LENGTH = 86400000;

    var issues;
    var commits;

    var requestHeaders = {
            Accept: "application/json"
        };

    var init = function init() {
        //Register callbacks
        MashupPlatform.prefs.registerCallback(newPreferences);
        MashupPlatform.wiring.registerStatusCallback(pushInfo);

        // build authorization headers
        requestHeaders["PRIVATE-TOKEN"] = "{private-token}";
        requestHeaders.Authorization = "{oauth2-token}";
        // Replace the headers with the secure preferences
        requestHeaders["X-WireCloud-Secure-Data"] = 'action=header, header=Authorization, var_ref=oauth2-token&action=header, header=PRIVATE-TOKEN, var_ref=private-token';

        newPreferences();
    };

    var newPreferences = function newPreferences () {

        //Updates de gitlab instance URI
        baseURI = MashupPlatform.prefs.get("gitlab-url") + "/api/v3";

        //Updates the target project
        getProjectId(MashupPlatform.prefs.get("project-name"));
    };

    var pushInfo = function pushInfo () {
        if (issues) {
            MashupPlatform.wiring.pushEvent("issue-list", issues);
            //If there were no issues, harvestInfo would have sent the harvested commits.
            if (commits) {
                MashupPlatform.wiring.pushEvent("commit-list", commits);
            } else {
                harvestInfo();
            }
        } else {
            harvestInfo();
        }
    };

    //Sends events through the connected outputs
    var harvestInfo = function harvestInfo() {
        var max = MashupPlatform.prefs.get("max");
        //Check if there are no issues to harvest
        if (max === 0) {
            return;
        }
        //If max issues is negative -> unlimited
        var unlimited = false;
        if (max < 0) {
            unlimited = true;
            max = 100; //This is for setting the issues per page to 100 later
        }
        var issuePage = 1;
        var commitPage = 0;

        //Harvest issues
        if (MashupPlatform.operator.outputs['issue-list'].connected) {
            milestones = [];
            issues = [];
            var leftIssues = max;


            //Recursively harvest data pages
            var harvestIssueFunc = function (res) {
                if (res && leftIssues > 0) {
                    issuePage++;
                    requestIssues(issuePage, leftIssues).then(harvestIssueFunc);
                    if (!unlimited) { // Do not decrease leftIssues if its unlimited
                        leftIssues -= 100;
                    }
                } else {

                    // Revert the order so newer issues are last
                    // This is for the graphs to sow first on the left and latest on the right
                    issues.reverse();

                    //Calculate the sprints
                    guessMilestonesBeginDate ();

                    //Add some metadata
                    issues.metadata = {};
                    issues.metadata.versions = milestones;
                    issues.metadata.type = "list";
                    issues.metadata.tag = "Issues";
                    issues.metadata.verbose = "Gitlab issues";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Sprints", base: "metadata.versions", property: "name", display: "name", compare: "versions", type: "some"});
                    filters.push({name: "Assignee", property: "assignee", display: "assignee"});
                    filters.push({name: "Status", property: "status", display: "status"});
                    filters.push({name: "Label", property: "labels", display: "labels", type: "some"});
                    filters.push({name: "Issue Key", property: "key", display: "key"});
                    filters.push({name: "Creation month", property: "month", display: "month"});
                    issues.metadata.filters = filters;

                    //Push the final data
                    MashupPlatform.wiring.pushEvent("issue-list", issues);
                }
            };
            //Start harvesting issues
            requestIssues(issuePage, leftIssues).then(harvestIssueFunc);
            if (!unlimited) { // Do not decrease leftIssues if its unlimited
                leftIssues -= 100;
            }
        }

        //Harvest commits
        if (MashupPlatform.operator.outputs['commit-list'].connected) {
            var leftCommits = max;
            commits = [];

            //Recursively harvest data pages
            var harvestCommitFunc = function (res) {
                if (res && leftCommits > 0) {
                    commitPage++;
                    requestCommits(commitPage, leftCommits).then(harvestCommitFunc);
                    if (!unlimited) { // Do not decrease leftCommits if its unlimited
                        leftCommits -= 100;
                    }
                } else {
                    // Revert the order so newer commits are last
                    // This is for the graphs to sow first on the left and latest on the right
                    commits.reverse();

                    //Add some metadata
                    commits.metadata = {};
                    commits.metadata.type = "list";
                    commits.metadata.tag = "Commits";
                    commits.metadata.verbose = "Gitlab commits";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Author", property: "author", display: "author"});
                    filters.push({name: "Month", property: "month", display: "month"});
                    commits.metadata.filters = filters;

                    MashupPlatform.wiring.pushEvent("commit-list", commits);
                }
            };
            //Start harvesting issues
            requestCommits(commitPage, leftCommits).then(harvestCommitFunc);
            if (!unlimited) { // Do not decrease leftCommits if its unlimited
                leftCommits -= 100;
            }
        }
    };

    var getProjectId = function getProjectId(projectName) {
        MashupPlatform.http.makeRequest (baseURI + "/projects", {
            method: 'GET',
            supportsAccessControl: false,
            parameters: {
                state: 'all',
                per_page: 100
            },
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var projects = JSON.parse(response.responseText);
                //Looks for the projectID needed for the querys
                for (var i = 0; i < projects.length; i++) {
                    if (projects[i].name_with_namespace === projectName) {
                        projectID = projects[i].id;
                        issueBaseURI = projects[i].web_url;
                        break;
                    }
                }
                harvestInfo();
            }
        });
    };

    //Request all the issues of the project
    var requestIssues = function requestIssues (page, pageSize) {
        return new Promise (function (fulfill, reject) {
            MashupPlatform.http.makeRequest (baseURI + "/projects/" + projectID + "/issues", {
                method: 'GET',
                supportsAccessControl: false,
                parameters: {
                    state: 'all',
                    per_page: pageSize,
                    page: page
                },
                requestHeaders: requestHeaders,
                onSuccess: function (response) {
                    //If there's no data, its probably the last page.
                    if (JSON.parse(response.responseText).length === 0) {
                        fulfill(false);
                        return;
                    }

                    issues = issues.concat(normalizeData(JSON.parse(response.responseText)));
                    fulfill(true);
                },
                onError: function (response) {
                    reject(false);
                }
            });
        });
    };

    //Request all the commits of the project
    var requestCommits = function requestCommits(page, pageSize) {
        return new Promise (function (fulfill, reject) {
            MashupPlatform.http.makeRequest(baseURI + "/projects/" + projectID + "/repository/commits", {
                method: 'GET',
                supportsAccessControl: false,
                parameters: {
                    per_page: pageSize,
                    page: page
                },
                requestHeaders: requestHeaders,
                onSuccess: function (response) {
                    var data = JSON.parse(response.responseText);
                    //If there's no data, its probably the last page.
                    if (data.length === 0) {
                        fulfill(false);
                        return;
                    }

                    for (var i = 0; i < data.length; i++) {
                        commits.push(normalizeCommit(data[i]));
                    }
                    fulfill(true);
                },
                onError: function (response) {
                    reject(false);
                }
            });
        });
    };

    //Removes useless JSON data and gives a normalized format
    var normalizeCommit = function normalizeCommit (commit) {
        var result = {};

        result.author = commit.author_name;
        result.month = commit.created_at.substring(0, 7);
        result.timestamp = Date.parse(commit.created_at);

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

        result.key = "#" + issue.iid;
        result.from = "gitlab";
        result.title = issue.title || "";

        //Link to the issue webpage
        result.link = issueBaseURI + "/issues/" + issue.iid;
        result.labels = issue.label;

        result.type = null;

        //User data
        if (issue.author) {
            result.creatorId = issue.author.username;
            result.creator = issue.author.name;
        }
        if (issue.assignee) {
            result.assigneeId = issue.assignee.username;
            result.assignee = issue.assignee.name;
        } else {
            result.assignee = "";
            result.assigneeId = "";
        }
        //Status of the issue (closed / open / etc)
        result.status = issue.state;

        //Harvest event dates
        result.creationDate = issue.created_at;
        result.creationTimestamp = Date.parse(issue.created_at) || null;

        //Gitlab has no issue closing date, so best we can do is guess it.
        var close = issue.state === "closed" ? issue.updated_at : null;
        result.resolutionDate = close;
        result.resolutionTimestamp = Date.parse(close) || null;

        result.updatedDate = issue.updated_at || null;
        result.updatedTimestamp = Date.parse(issue.updated_at) || null;

        result.month = issue.created_at.substring(0, 7);

        //Harvest versions
        result.versions = [];
        if (issue.milestone) {
            result.versions.push(issue.milestone.title);
            addMilestones (issue.milestone.title, issue.milestone.due_date);
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
    /* test-code */

    /* end-test-code */

})();
