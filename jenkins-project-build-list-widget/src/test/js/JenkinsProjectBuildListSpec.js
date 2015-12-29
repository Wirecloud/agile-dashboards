/*global $, MashupPlatform, MockMP, JenkinsProjectBuildList, beforeAll, afterAll, beforeEach*/

(function () {
    "use strict";

    var dependencyList = [
        'script',
        'div',
    ];

    var clearDocument = function clearDocument() {
        $('body > *:not(' + dependencyList.join(', ') + ')').remove();
    };

    describe("Test JenkinsProjectBuildList", function () {
        var widget;
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
            widget = new JenkinsProjectBuildList();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

    });
})();
