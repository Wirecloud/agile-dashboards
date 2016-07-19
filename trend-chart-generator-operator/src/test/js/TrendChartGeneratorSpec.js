/*global it, expect, describe, MashupPlatform, MockMP, timestampCallback, dataserieCallback, beforeAll, afterAll, beforeEach*/

(function () {
    "use strict";

    describe("Test TrendChartGenerator", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

        describe("Should create a trend chart", function () {
            beforeEach (function () {
                timestampCallback(null);
                dataserieCallback(null);
            });
            it("Should work with one series", function() {
                var data = [1, 2 ,3 ,1];
                var stamps = [1, 2, 3, 4];

                timestampCallback(stamps);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                dataserieCallback(data);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series).toEqual([{name: "values", data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 1}]}]);
            });

            it("Should work with multiple series", function() {
                var data = [[1, 2 ,3 ,1], [1, 2, 1, 2]];
                data[0].metadata = {verbose: "things"};
                var stamps = [1, 2, 3, 4];
                stamps.metadata = {tag: "days"};

                timestampCallback(stamps);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                dataserieCallback(data);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series).toEqual([{name: "things", data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 1}]}, {name: "values", data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 1}, {x: 4, y: 2}]}]);
            });

            it("Should exit if timestamps length its not the same as the dataserie length", function () {
                var data = [1, 2];
                var stamps = [1];

                timestampCallback(stamps);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                dataserieCallback(data);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();
            });
        });
    });
})();
