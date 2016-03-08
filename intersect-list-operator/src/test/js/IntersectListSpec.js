/*global $, MashupPlatform, MockMP, beforeAll, afterAll, beforeEach, checkEqual, calculate_intersection*/
(function () {
    "use strict";
    jasmine.getFixtures().fixturesPath = 'src/test/fixtures/';

    var dependencyList = [
        'script',
        'div',
    ];

    var clearDocument = function clearDocument() {
        $('body > *:not(' + dependencyList.join(', ') + ')').remove();
    };

    describe("Test IntersectList", function () {
        var widget;
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        //BASIC TYPES COMPARISON
        it("Number comparison", function () {
            expect(checkEqual(1, 1)).toBe(true);
        });

        it("Number comparison", function () {
            expect(checkEqual(1, 2)).toBe(false);
        });

        it("String comparison", function () {
            expect(checkEqual("1", "1")).toBe(true);
        });

        //OBJECT COMPARISON
        it("Same Object comparison", function () {
            expect(checkEqual({a: "1", b: "2"}, {a: "1", b: "2"})).toBe(true);
        });

        it("Different Object comparison", function () {
            expect(checkEqual({a: "1", b: "2"}, {a: "1", b: "3"})).toBe(false);
        });

        it("Different keys Object comparison", function () {
            expect(checkEqual({a: "1", c:"2"}, {a: "1", b:"2"})).toBe(false);
        });

        //LIST COMPARISON
        it("Basic List", function () {
            expect(checkEqual(["1"], ["1"])).toBe(true);
        });

        it("Different lenght lists", function () {
            expect(checkEqual(["1"], ["1","1"])).toBe(false);
        });

        //NESTED LISTS
        it("Same nested lists", function () {
            expect(checkEqual(["1","2",["1","2"]], ["1","2",["1","2"]] )).toBe(true);
        });

        it("Different nested lists", function () {
            expect(checkEqual(["1","2",["1","2"]], ["1","2",["1","3"]] )).toBe(false);
        });        

        it("Nested lists with different lenghts", function () {
            expect(checkEqual(["1","2",["1","2"]], ["1","2",["1"]] )).toBe(false);
        });




        //BASIC INTERSECT

        it("Equal lists intersection", function () {
            expect(calculate_intersection(["1","2",["1","2"]], ["1","2",["1","2"]] )).toEqual(["1","2",["1","2"]]);
        });

        it("Basic lists intersection with different length and one nested list, disordered", function () {
            expect(calculate_intersection( ["1",["1","2"],"3", "4"], ["1","2",["1","2"]] )).toEqual(["1",["1","2"]]);
        });

        it("Thats not a list!!", function () {
            expect(calculate_intersection(5, ["1","2",["1","2"]])).toEqual([]);
        });

    });
})();
