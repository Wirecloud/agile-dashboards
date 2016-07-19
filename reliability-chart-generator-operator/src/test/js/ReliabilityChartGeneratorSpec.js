/*global expect, it, describe, MashupPlatform, MockMP, ReliabilityChartGenerator, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test ReliabilityChartGenerator", function () {
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

        describe("Should plot pie charts", function () {
            it("Should plot pie charts with open and closed issues", function () {
                var issues = [
                    {assignee: "paco", status: "closed"},
                    {assignee: "paco", status: "closed"},
                    {assignee: "paco", status: "closed"},
                    {assignee: "paco", status: "open"},
                    {assignee: "paco", status: "open"}
                ];

                ReliabilityChartGenerator.issueListCallback(issues);

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series[0].data[0]).toEqual({name: "Closed", y: 3});
                expect(args.series[0].data[1]).toEqual({name: "Pending", y: 2});
            });

            it("Should plot pie charts with only one type of issues", function () {
                var issues = [
                    {assignee: "paco", status: "open"},
                    {assignee: "paco", status: "open"}
                ];

                ReliabilityChartGenerator.issueListCallback(issues);

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series[0].data[0]).toEqual({name: "Closed", y: 0});
                expect(args.series[0].data[1]).toEqual({name: "Pending", y: 2});
            });
        });

        describe("Should plot column charts", function () {
            it("dsa", function () {
                var issues = [
                {assignee: "paco", status: "closed"},
                {assignee: "paco", status: "closed"},
                {assignee: "juan", status: "closed"},
                {assignee: "juan", status: "open"},
                {assignee: "paco", status: "open"},
                {status: "open"}
            ];

                ReliabilityChartGenerator.issueListCallback(issues);

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);

                expect(args.xAxis.categories).toEqual(["paco", "juan"]);

                expect(args.series[0].name).toEqual("Pending");
                expect(args.series[0].data).toEqual([1, 1]);
                expect(args.series[1].name).toEqual("Closed");
                expect(args.series[1].data).toEqual([2, 1]);
            });
            
        });

    });
})();
