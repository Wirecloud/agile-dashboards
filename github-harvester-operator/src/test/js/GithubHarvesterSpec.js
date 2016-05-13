/*global $, MashupPlatform, MockMP, GithubHarvester, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test GithubHarvester", function () {
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
