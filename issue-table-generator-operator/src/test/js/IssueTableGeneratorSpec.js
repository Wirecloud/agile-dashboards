/*global expect, it, describe, MashupPlatform, MockMP, IssueTableGenerator, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test IssueTableGenerator", function () {
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

        it("Check data is sent correctly", function () {
            MashupPlatform.wiring.pushEvent.calls.reset();
            var fakeIssues = ["doesnt", "matter"];
            IssueTableGenerator.generateDataset(fakeIssues);

            var call = MashupPlatform.wiring.pushEvent.calls.first().args;
            expect(call[0]).toBe("dataset");
            var args = call[1];
            expect(args.data).toEqual(fakeIssues);
            expect(args.id).toEqual("key");
        });

        describe("Should assing state properly", function () {
            it ("Should assing success to closed issues", function () {
                var issue = {status: "ClOsEd"};
                expect(IssueTableGenerator.stateFunc(issue)).toBe("success");
            });
            it ("Should assing info to in progress issues", function () {
                var issue = {status: "in progress"};
                expect(IssueTableGenerator.stateFunc(issue)).toBe("info");
            });
            it ("Should assing success to open issues", function () {
                var issue = {status: "open"};
                expect(IssueTableGenerator.stateFunc(issue)).toBe("danger");
            });
        });

        describe("Should get the due date of the issues",function () {
            it("Should work if the issue has due date", function () {
                var issue = {dueDate:4};

                expect(IssueTableGenerator.contentBuilderDueDate(issue)).toBe(4);
            });

            it("Should work if the issue has version but no due date", function () {
                var issue = {versions: ["testVersion"]};
                IssueTableGenerator.setVersions([{name: "testVersion", endDate: 4}]);
                expect(IssueTableGenerator.contentBuilderDueDate(issue)).toBe(4);
            });

            it("Should be empty if the issue has no version nor set due date", function () {
               expect(IssueTableGenerator.contentBuilderDueDate({versions: []})).toBe(""); 
            });

        });



    });
})();
