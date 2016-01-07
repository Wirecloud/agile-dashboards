/* global StyledElements */
/* exported JenkinsProjectBuildList */

var JenkinsProjectBuildList = (function () {

    "use strict";

    var JenkinsProjectBuildList = function JenkinsProjectBuildList () {

        /* Context */
        MashupPlatform.widget.context.registerCallback(function (newValues) {
            if (this.layout && ("heightInPixels" in newValues || "widthInPixels" in newValues)) {
                this.layout.repaint();
            }
        }.bind(this));

        MashupPlatform.wiring.registerCallback("build-filter-list", function (data) {
            this.filters = data;
            this.filter();
        }.bind(this));

        this.filters = '';
        this.build_info = [];
        this.layout = null;
        this.table = null;
    };

    JenkinsProjectBuildList.prototype.init = function init() {
        this.layout = new StyledElements.BorderLayout();
        createTable.call(this);

        this.layout.getCenterContainer().addClassName('loading');
        this.layout.insertInto(document.body);
        this.layout.repaint();

        this.reload();
    };

    JenkinsProjectBuildList.prototype.filter = function filter() {
        var i, filtered = [];

        if (this.filters !== '') {
            for (i = 0; i < this.build_info.length; i++) {
                if (this.build_info[i].timestamp < this.filters.timerange.start) {
                    continue;
                } else if (this.build_info[i].timestamp > this.filters.timerange.end) {
                    break;
                }

                filtered.push(this.build_info[i]);
            }
        } else {
            filtered = this.build_info.slice(0);
        }

        this.table.source.changeElements(filtered);
        MashupPlatform.wiring.pushEvent("build-list", filtered);
    };

    JenkinsProjectBuildList.prototype.reload = function reload() {
        var url = MashupPlatform.prefs.get('jenkins_server') + 'job/' + MashupPlatform.prefs.get('job_id') + '/api/json';

        this.layout.getCenterContainer().disable();
        MashupPlatform.http.makeRequest(url, {
            method: 'GET',
            parameters: {"depth": 1},
            onSuccess: function (response) {
                var i, j, build_info, build, data, testResults, revision;

                data = JSON.parse(response.responseText);

                build_info = [];
                for (i = 0; i < data.builds.length; i++) {
                    build = data.builds[i];

                    if (build.building) {
                        continue;
                    }

                    testResults = {passCount: 0, failCount: 0, skipCount: 0, totalCount: 0};
                    revision = null;
                    for (j = 0; j < build.actions.length; j++) {
                        if ('failCount' in build.actions[j]) {
                            testResults = {
                                passCount: build.actions[j].totalCount - build.actions[j].failCount - build.actions[j].skipCount,
                                failCount: build.actions[j].failCount,
                                skipCount: build.actions[j].skipCount,
                                totalCount: build.actions[j].totalCount
                            };
                        }
                        if ('lastBuiltRevision' in build.actions[j]) {
                            revision = build.actions[j].lastBuiltRevision.SHA1;
                        }
                    }

                    build_info.push({
                        id: build.id,
                        result: build.result,
                        timestamp: build.timestamp,
                        revision: revision,
                        changes: build.changeSet.items,
                        testResults: testResults
                    });
                }

                this.build_info = build_info.sort(function (a, b) {return a.timestamp - b.timestamp;});
                this.filter();
            }.bind(this),
            onFailure: function () {
            },
            onComplete: function () {
                this.layout.getCenterContainer().enable();
            }.bind(this)
        });
    };

    var onRowClick = function onRowClick(row) {
        //MashupPlatform.wiring.pushEvent('selected-row', row);
    };

    var createTable = function createTable() {
        // Create the table
        var fields = [
            {field: 'result', label: '', sortable: true},
            {field: 'id', label: 'Id', sortable: true},
            {field: 'timestamp', label: 'Date', type: 'date', sortable: true}
        ];

        this.table = new StyledElements.ModelTable(fields, {
            id: 'id',
            pageSize: 0,
            'class': 'table-striped',
            initialSortColumn: 'id',
            initialDescendingOrder: true,
            stateFunc: function (entry) {
                switch (entry.result) {
                case "SUCCESS":
                    return "success";
                case "FAILURE":
                    return "danger";
                }
            }
        });
        this.table.addEventListener("click", onRowClick);
        this.table.reload();
        this.layout.center.clear();
        this.layout.center.appendChild(this.table);
    };

    return JenkinsProjectBuildList;

})();
