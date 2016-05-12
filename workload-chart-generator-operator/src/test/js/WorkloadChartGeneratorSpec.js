/*global describe, it ,expect , MashupPlatform, MockMP, issuesCallback, commitsCallback, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test WorkloadChartGenerator", function () {
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

        describe("Should calculate issue workload", function () {
            it("Should calculate pie chart when only one month of data", function () {
                var issues = [
                    {assignee: "juan", creationDate: "month1"},
                    {assignee: "juan", creationDate: "month1"},
                    {assignee: "paco", creationDate: "month1"},
                    {creationDate: "month1"}
                ];
                issuesCallback (issues);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);

                expect(args.series[0].data).toEqual([{name: "juan", y:2}, {name: "paco", y:1}]);
            });

            it("Should calculate column chart when more than one month of data", function () {
                var issues = [
                    {assignee: "juan", creationDate: "month1"},
                    {assignee: "juan", creationDate: "month1"},
                    {assignee: "paco", creationDate: "month1"},
                    {assignee: "paco", creationDate: "month2"},
                    {assignee: "paco", creationDate: "month2"},
                ];
                issuesCallback (issues);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);

                expect(args.series).toEqual([{name:"juan", data: [2]}, {name: "paco", data: [1, 2]}]);
            });
        });

        describe("Should calculate commit workload", function ()  {
            it("Should calculate pie chart when only one month of data", function () {
                var commits = [
                    {author: "juan", month: "month1"},
                    {author: "paco", month: "month1"},
                    {author: "juan", month: "month1"},
                    {month: "month1"}
                ];

                commitsCallback(commits);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series[0].data).toEqual([{name:"juan", y: 2}, {name:"paco", y: 1}]);
            });

            it("Should calculate column chart when more than one month of data", function () {
                var commits = [
                    {author: "juan", month: "month1"},
                    {author: "paco", month: "month1"},
                    {author: "juan", month: "month1"},
                    {author: "paco", month: "month2"},
                    {author: "paco", month: "month2"}
                ];

                commitsCallback(commits);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series).toEqual([{name:"juan", data: [2]}, {name: "paco", data: [1, 2]}]);
            });
        });

    });
})();
