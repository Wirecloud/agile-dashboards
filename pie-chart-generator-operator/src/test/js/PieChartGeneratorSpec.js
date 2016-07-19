/*global expect, it, describe, MashupPlatform, MockMP, labelSerieCallback, numberSerieCallback, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test PieChartGenerator", function () {
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

        it("Should accept null lists", function () {
            numberSerieCallback(null);
            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
            labelSerieCallback(null);
            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("Should accept empty number lists", function () {
            numberSerieCallback([]);
            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();
        });

        it("Should accept empty label lists", function () {
            labelSerieCallback([]);
            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();
        });

        it("Should work with number series", function () {
            var series = [1, 2, 3 ,1];
            numberSerieCallback(series);

            var call = MashupPlatform.wiring.pushEvent.calls.first().args;
            expect(call[0]).toBe("chart-options");
            var args = JSON.parse(call[1]);
            expect(args.series[0].data).toEqual([{name: "0", y: 1}, {name: "1", y: 2}, {name: "2", y: 3}, {name: "3", y: 1}]);
        });

        it ("Should work with label series", function () {
            var labels = ["label1", "label2", "label1"];
            labelSerieCallback(labels);

            var call = MashupPlatform.wiring.pushEvent.calls.first().args;
            expect(call[0]).toBe("chart-options");
            var args = JSON.parse(call[1]);
            expect(args.series[0].data).toEqual([{name: "label1", y: 2}, {name: "label2", y: 1}]);
        });
    });
})();
