/*global it, describe, expect, MashupPlatform, MockMP, ColumnChartGenerator, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test ColumnChartGenerator", function () {
        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

        describe("Should generate the column chart", function () {
            beforeEach (function () {
                MashupPlatform.wiring.pushEvent.calls.reset();
            });

            it ("Should accept empty data series", function () {
                ColumnChartGenerator.dataSerieCallback(null);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("chart-options", {});
            });

            it ("Should accept data series", function () {
                var serie = [1, 4, 2];
                ColumnChartGenerator.dataSerieCallback(serie);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = call[1];
                expect(args.series).toEqual([{data: [1, 4, 2]}]);
                expect(args.xAxis).toEqual({categories: ""});
                expect(args.yAxis).toEqual({title: {text: ""}});
            });

            it ("Should accept data series with labels", function () {
                var serie = [1, 4, 2];
                var labels = ["2", "3", "4"];
                ColumnChartGenerator.dataSerieCallback(serie);
                MashupPlatform.wiring.pushEvent.calls.reset();
                ColumnChartGenerator.labelSerieCallback(labels);

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = call[1];
                expect(args.series).toEqual([{data: [1, 4, 2]}]);
                expect(args.xAxis).toEqual({categories: labels});
                expect(args.yAxis).toEqual({title: {text: ""}});
            });

            it ("Should accept data series with labels and metadata", function () {
                var serie = [1, 4, 2];
                serie.metadata = {};
                serie.metadata.verbose = "name";
                var labels = ["2", "3", "4"];
                ColumnChartGenerator.dataSerieCallback(serie);
                MashupPlatform.wiring.pushEvent.calls.reset();
                ColumnChartGenerator.labelSerieCallback(labels);

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = call[1];
                expect(JSON.stringify(args.series[0].data)).toEqual(JSON.stringify([1, 4, 2]));
                expect(args.xAxis).toEqual({categories: labels});
                expect(args.yAxis).toEqual({title: {text: "name"}});
            });

        });
    });
})();
