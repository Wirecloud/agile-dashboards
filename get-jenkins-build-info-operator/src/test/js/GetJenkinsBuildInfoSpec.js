/*global $, MashupPlatform, MockMP, GetJenkinsBuildInfo, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    var dependencyList = [
        'script',
        'div',
    ];

    describe("Test GetJenkinsBuildInfo", function () {
        var widget;
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

    });
})();
