/*global describe, it, expect, MashupPlatform, MockMP, labelListCallback, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test LabelsToDataserie", function () {
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

        it("Should create label and data series", function () {
            var list = ["label1", "label1", "label2", "label1"];
            labelListCallback (list);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("data-serie", [3, 1]);
            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("label-serie", ["label1", "label2"]);
        });
    });
})();
