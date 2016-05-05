/*global $, MashupPlatform, MockMP, IssueSplitter, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    var dependencyList = [
        'script',
        'div',
    ];

    describe("Test IssueSplitter", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.wiring.registerStatusCallback = function () {};
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

        describe ("Should split issues", function () {
            beforeEach (function () {
                IssueSplitter.init();
                MashupPlatform.wiring.pushEvent.calls.reset();
            });

            it("Should accept empty lists", function () {
                var issues = [];

                IssueSplitter.issue_list_callback(issues);

                checkWiringCallbacks ([], [], [], [], [], []);
            });

            it("Should split non-jira issue lists", function () {
                var issues = [
                    {status: "open", assignee: "Me", type: "bug", versions: "May", month: "June"},
                    {status: "closed", assignee: "Me", type: "feature", versions: "June", month: "July"}
                ];

                IssueSplitter.issue_list_callback(issues);

                checkWiringCallbacks (["open", "closed"], [], ["Me", "Me"], ["bug", "feature"], ["May", "June"], ["June", "July"]); 
            });

            it("Should split jira issue lists", function () {
                var issues = [
                    {status: "open", jira: {priority: "major"}, assignee: "Me", type: "bug", versions: "May", month: "June"},
                    {status: "closed", jira: {priority: "major"}, assignee: "Me", type: "feature", versions: "June", month: "July"}
                ];

                IssueSplitter.issue_list_callback(issues);

                checkWiringCallbacks (["open", "closed"], ["major", "major"], ["Me", "Me"], ["bug", "feature"], ["May", "June"], ["June", "July"]); 
            });

            it("Should split issues with only some of the target properties", function () {
                var issues =  [{status: "hola"}, {assignee:"mundo"}];

                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();

                IssueSplitter.issue_list_callback(issues);
                var filler = [undefined, undefined];
                checkWiringCallbacks (["hola", undefined], [], [undefined, "mundo"], filler, filler, filler);
            });
        });
    });

    var checkWiringCallbacks = function checkWiringCallbacks (status, priority, assignee, type, sprint, month) {
        expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("status-list", status);
        expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("priority-list", priority);
        expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("assignee-list", assignee);
        expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("type-list", type);
        expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("sprint-list", sprint);
        expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith("month-list", month);
    };
})();
