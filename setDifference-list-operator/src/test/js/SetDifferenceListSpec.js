/*global $, MashupPlatform, MockMP, SetDifferenceList, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    //jasmine.getFixtures().fixturesPath = 'src/test/fixtures/';

    var dependencyList = [
        'script',
        'div',
    ];

    var clearDocument = function clearDocument() {
        $('body > *:not(' + dependencyList.join(', ') + ')').remove();
    };

    describe("Test SetDifferenceList", function () {
        var widget;
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
            //widget = new SetDifferenceList();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

    });
})();
