/*global describe, it, expect, MashupPlatform, MockMP, BurndownChartGenerator, beforeAll, beforeEach*/
(function () {
    "use strict";

    describe("Test BurndownChartGenerator", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

        describe("Should generate the burndown chart", function () {
            beforeEach (function () {
                BurndownChartGenerator.init();
                MashupPlatform.wiring.pushEvent.calls.reset();
            });

            it ("Should accept empty data", function () {
                BurndownChartGenerator.issueCallback([]);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args).toEqual({title: {text: "Input data is empty :("}});
            });

            it ("Should accept wrong sprint issues and warn it", function (){
                BurndownChartGenerator.issueCallback([{versions: ["hola"]}, {versions: ["mundo"]}]);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args).toEqual({title: {text: "All input issues must be from the same sprint"}});
            });

            it ("Should work with normal sprints", function () {
                var issues = createFakeIssueSet (6, "2016/05/1" , "2016/05/7", [0,0,3,0,0,2,1] );
                BurndownChartGenerator.issueCallback(issues.issues);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series.length).toBe(3);
                expect(args.series[0].data).toEqual(issues.closed);
                expect(args.series[2].data).toEqual(issues.progress);
            });

            it ("Should work with filtered sprints", function () {
                var issues = createFakeIssueSet (6, "2016/05/1" , "2016/05/7", [0,0,3,0,0,2,1]);
                issues.issues.metadata.filtered = {Sprints: "testVersion"};
                BurndownChartGenerator.issueCallback(issues.issues);
                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("chart-options");
                var args = JSON.parse(call[1]);
                expect(args.series.length).toBe(3);
                expect(args.series[0].data).toEqual(issues.closed);
                expect(args.series[2].data).toEqual(issues.progress);
            });

        });
    });

    // Creates a fake set of issues with just the data used by the Burndown chart generator
    // Returns the input issue list and the expected burndown outputs
    var createFakeIssueSet = function createFakeIssueSet (issueCount, firstDate, lastDate, closingDays) {
        var issues = [];
        var version = {
            name: "testVersion", 
            startDate: firstDate, 
            endDate: lastDate
        };
        firstDate = Date.parse(firstDate);
        issues.metadata = {};
        issues.metadata.versions = [version];
        for (var i = 0; i < issueCount; i++) {
            var issue = {
                versions: ["testVersion"]
            };
            issues.push(issue);
        }

        i = 0;
        var DAY_LENGTH = 86400000;

        var progress = [];
        var progressCount = 0;
        var closed = [];
        for(var j = 0; j < closingDays.length; j++) {
            var timestamp = j * DAY_LENGTH + firstDate;
            for (var k = 0; k < closingDays[j]; k++) {
                issues[i++].resolutionDate = new Date(timestamp);
            }
            closed.push([j + 1, closingDays[j]]);
            progressCount += closingDays[j];
            progress.push([j + 1, issueCount - progressCount]);
        }

        return {issues: issues, progress: progress, closed: closed};
    };
})();
