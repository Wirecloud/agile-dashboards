(function () {

    "use strict";

    var get_build_info = function get_build_info() {
        var url = MashupPlatform.prefs.get('jenkins_server') + 'job/' + MashupPlatform.prefs.get('job_id') + '/api/json';

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

                build_info.sort(function (a, b) {return a.timestamp - b.timestamp;});
                MashupPlatform.wiring.pushEvent("build-list", build_info);
            }
        });
    };

    MashupPlatform.wiring.registerStatusCallback(get_build_info);
    get_build_info();

})();
