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

    var repoName;
    var username;

    var issueData, commitData;
    var requestHeaders;

    var eventsToDo;

    //Stablish callbacks
    var init = function init() {

        MashupPlatform.wiring.registerStatusCallback(pushInfo);

        //On preferences update
        MashupPlatform.prefs.registerCallback(updatePrefs);
        updatePrefs();
    };

    var updatePrefs = function updatePrefs() {
        var oauth2_token = MashupPlatform.prefs.get("oauth2-token").trim();
        username = MashupPlatform.prefs.get("repo-owner").trim();
        repoName = MashupPlatform.prefs.get("repo-name").trim();

        //Build the request headers
        requestHeaders = {
            Accept: "application/vnd.github.v3.html+json"
        };

        //Choose authentication method if any
        if (oauth2_token !== '') {
            requestHeaders.Authorization = 'token {oauth2-token}';
            requestHeaders["X-WireCloud-Secure-Data"] = 'action=header, header=Authorization, var_ref=oauth2-token';
        } else if (username !== "") {
            var user_ref = "username";
            var pass_ref = "passwd";
            requestHeaders["X-WireCloud-Secure-Data"] = 'action=basic_auth, user_ref=' + user_ref + ', pass_ref=' + pass_ref + ', type=operator';
        }

        request_github_info();
    };

    //Tries to push data and if theres no data harvest it.
    var pushInfo = function pushInfo() {
        if (issueData) {
            MashupPlatform.wiring.pushEvent("issue-list", issueData);
        } else {
            request_github_info();
        }
    };

    //Harvest commits and issues, only if they are connected to something through wiring
    var request_github_info = function request_github_info () {
        var max = MashupPlatform.prefs.get("max");
        var page;
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

        //Harvest issues
        if (MashupPlatform.operator.outputs['issue-list'].connected) {
            page = 1;
            milestones = [];
            issueData = [];
            var leftIssues = max;

            //Recursively harvest data pages
            var harvestIssueFunc = function (res) {
                if (res && leftIssues > 0) {
                    page++;
                    request_github_issues(page, leftIssues).then(harvestIssueFunc);
                    if (!unlimited) { // Do not decrease leftIssues if its unlimited
                        leftIssues -= 100;
                    }
                } else {
                    //Calculate the sprints
                    guessMilestonesBeginDate ();

                    // Revert the order so newer issues are last
                    // This is for the graphs to sow first on the left and latest on the right
                    issueData.reverse();

                    //Add some metadata
                    issueData.metadata = {};
                    issueData.metadata.versions = milestones;
                    issueData.metadata.type = "list";
                    issueData.metadata.tag = "Issue";
                    issueData.metadata.verbose = "Github issues";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Sprints", base: "metadata.versions", property: "name", display: "name", compare: "versions", type: "some"});
                    filters.push({name: "Assignee", property: "assignee", display: "assignee"});
                    filters.push({name: "Status", property: "status", display: "status"});
                    filters.push({name: "Label", property: "labels", display: "labels", type: "some"});
                    filters.push({name: "Issue Key", property: "key", display: "key"});
                    filters.push({name: "Creation month", property: "month", display: "month"});
                    issueData.metadata.filters = filters;

                    //Push basic data
                    MashupPlatform.wiring.pushEvent("issue-list", issueData);

                    //Harvest extra data such as event data
                    harvestEvents();
                }
            };
            //Start harvesting issues
            request_github_issues(page, leftIssues).then(harvestIssueFunc);
            if (!unlimited) { // Do not decrease leftIssues if its unlimited
                leftIssues -= 100;
            }
        }

        //Harvest commits
        if (MashupPlatform.operator.outputs['commit-list'].connected) {
            page = 1;
            issueData = [];
            var leftCommits = max;
            commitData = [];

            //Recursively harvest data pages
            var harvestCommitFunc = function (res) {
                if (res && leftCommits > 0) {
                    page++;
                    request_github_commits(page, leftCommits).then(harvestCommitFunc);
                    if (!unlimited) { // Do not decrease leftCommits if its unlimited
                        leftCommits -= 100;
                    }
                } else {
                    // Revert the order so newer commits are last
                    // This is for the graphs to sow first on the left and latest on the right
                    commitData.reverse();

                    //Add some metadata
                    commitData.metadata = {};
                    commitData.metadata.type = "list";
                    commitData.metadata.tag = "Commit";
                    commitData.metadata.verbose = "Github commits";
                    //filter metadata
                    var filters = [];
                    filters.push({name: "Author", property: "author", display: "author"});
                    filters.push({name: "Month", property: "month", display: "month"});
                    filters.push({name: "Commit Sha", property: "sha", display: "sha"});
                    commitData.metadata.filters = filters;

                    MashupPlatform.wiring.pushEvent("commit-list", commitData);
                }
            };
            //Start harvesting issues
            request_github_commits(page, leftCommits).then(harvestCommitFunc);
            if (!unlimited) { // Do not decrease leftCommits if its unlimited
                leftCommits -= 100;
            }
        }
    };

    //Creates a promise that harvest a  page of issues
    var request_github_issues = function request_github_issues (page, pageSize) {
        return new Promise (function (fulfill, reject) {
            MashupPlatform.http.makeRequest("https://api.github.com/repos/" + username + "/" + repoName + "/issues", {
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

                    issueData = issueData.concat(normalizeData(JSON.parse(response.responseText)));

                    fulfill(true);
                },
                onError: function (response) {
                    reject(false);
                }
            });
        });
    };

    //Harvest data from Github
    var request_github_commits = function request_github_commits(page, pageSize) {
        return new Promise (function (fulfill, reject) {
            MashupPlatform.http.makeRequest("https://api.github.com/repos/" + username + "/" + repoName + "/commits", {
                method: 'GET',
                supportsAccessControl: true,
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
                        commitData.push(normalizeCommit(data[i]));
                    }

                    fulfill(true);
                },
                onError: function (response) {
                    reject(false);
                }
            });
        });
    };

    //Harvest event data
    var harvestEvents = function harvestEvents() {
        eventsToDo = issueData.length;
        issueData.forEach(function (issue) {
            harvestIssueEvents(issue);
        });
    };

    var harvestIssueEvents = function harvestIssueEvents (issue) {

        MashupPlatform.http.makeRequest("https://api.github.com/repos/" + username + "/" + repoName + "/issues/" + issue.key.substring(1, issue.key.length) + "/events", {
            method: 'GET',
            supportsAccessControl: true,
            requestHeaders: requestHeaders,
            onSuccess: function (response) {
                var data = JSON.parse(response.responseText);
                var closingCommitFound = false;

                data.forEach(function (event) {
                    //Harvest previous milestones
                    if (event.event === "milestoned") {
                        if (issue.versions.indexOf(event.milestone.title) === -1) {
                            issue.versions.push(event.milestone.title);
                            addMilestones (event.milestone.title, event.milestone.due_on);
                        }
                    }

                    //Closing commit only makes sense if the issue is closed.
                    if (issue.status === "closed") {
                        //Harvest closing commit references if any
                        if (event.event === "closed") {
                            if (event.commit_id) {
                                issue.closingCommit = event.commit_id;
                                issue.closingCommitUri = event.commit_url;
                                closingCommitFound = true;
                            }
                        } else if (event.event === "referenced" && !closingCommitFound) {
                            if (event.commit_id) {
                                issue.closingCommit = event.commit_id;
                                issue.closingCommitUri = event.commit_url;
                                closingCommitFound = true;
                            }
                        }
                    }

                });
            },
            onComplete: function (response) {
                if (--eventsToDo === 0) {
                    //Update repository milestones, just in case any new milestone was found
                    guessMilestonesBeginDate();
                    issueData.metadata.versions = milestones;

                    //Push the new data
                    MashupPlatform.wiring.pushEvent("issue-list", issueData);
                }
            }
        });
    };

    //Removes useless JSON data and gives a normalized format
    var normalizeCommit = function normalizeCommit (commit) {
        var result = {};

        //Id
        result.sha = commit.sha;

        //Creation data
        result.author = commit.commit.author.name;
        result.month = commit.commit.author.date.substring(0, 7);
        result.timestamp = Date.parse(commit.commit.author.date);

        //Commit data
        result.parents = commit.parents;
        result.stats = commit.stats;
        result.files = commit.files;
        result.message = commit.message;

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
        //Link to the issue webpage
        result.link = issue.html_url;
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
        } else {
            result.assignee = "";
            result.assigneeId = "";
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
            if (!milestones[i].endDate) {
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
