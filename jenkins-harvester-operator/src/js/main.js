(function () {

    "use strict";

    var build_info;
    var previous_url = "";

    //Pushes previous data if available.
    var pushData = function pushData () {
        if (build_info && previous_url === MashupPlatform.prefs.get('jenkins_server') + 'job/' + MashupPlatform.prefs.get('job_id') + '/api/json') {
            MashupPlatform.wiring.pushEvent("build-list", build_info);
        } else {
            get_build_info();
        }
    };

    var get_build_info = function get_build_info() {
        previous_url = MashupPlatform.prefs.get('jenkins_server') + 'job/' + MashupPlatform.prefs.get('job_id') + '/api/json';

        MashupPlatform.http.makeRequest(previous_url, {
            method: 'GET',
            parameters: {"depth": 1},
            onSuccess: function (response) {
                var i, j, build, data, user, testResults, revision;

                data = JSON.parse(response.responseText);

                build_info = [];
                for (i = 0; i < data.builds.length; i++) {
                    build = data.builds[i];

                    if (build.building) {
                        continue;
                    }

                    testResults = {passCount: 0, failCount: 0, skipCount: 0, totalCount: 0};
                    revision = null;
                    user = 'aarranz';
                    for (j = 0; j < build.actions.length; j++) {
                        if ('causes' in build.actions[j] && build.actions[j].causes[0] && 'userId' in build.actions[j].causes[0]) {
                            user = build.actions[j].causes[0].userId;
                        } else if ('failCount' in build.actions[j]) {
                            testResults = {
                                passCount: build.actions[j].totalCount - build.actions[j].failCount - build.actions[j].skipCount,
                                failCount: build.actions[j].failCount,
                                skipCount: build.actions[j].skipCount,
                                totalCount: build.actions[j].totalCount
                            };
                        } else if ('lastBuiltRevision' in build.actions[j]) {
                            revision = build.actions[j].lastBuiltRevision.SHA1;
                        }
                    }
                    var monthFilter = new Date(build.timestamp);
                    monthFilter = monthFilter.getMonth() + " - " + monthFilter.getFullYear();

                    build_info.push({
                        id: build.id,
                        link: build.url, //Compatibility with the issues harvesters / open website operator
                        buildURL: build.url,
                        result: build.result,
                        duration: build.duration || 0,
                        timestamp: build.timestamp,
                        month: monthFilter,
                        revision: revision,
                        user: user,
                        changes: build.changeSet.items,
                        testResults: testResults
                    });
                }

                build_info.sort(function (a, b) {return a.timestamp - b.timestamp;});

                //Add some metadata
                build_info.metadata = {};
                build_info.metadata.type = "list";
                build_info.metadata.tag = "Builds";
                build_info.metadata.verbose = "Jenkins builds";
                //filter metadata
                var filters = [];
                filters.push({name: "Date", property: "month", display: "month"});
                filters.push({name: "User", property: "user", display: "user"});
                filters.push({name: "Result", property: "result", display: "result"});
                filters.push({name: "Build id", property: "id", display: "id"});
                build_info.metadata.filters = filters;

                MashupPlatform.wiring.pushEvent("build-list", build_info);
            },
            on404: function (response) {
                MashupPlatform.operator.log("Error 404: Not Found");
            },
            on401: function (response) {
                MashupPlatform.operator.log("Error 401: Authentication failed");
            },
            onFailure: function (response) {
                MashupPlatform.operator.log("Unexpected response from the server");
            }
        });
    };

    pushData();
    MashupPlatform.wiring.registerStatusCallback(pushData);

})();
