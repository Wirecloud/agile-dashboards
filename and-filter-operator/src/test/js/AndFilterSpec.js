/*global $, MashupPlatform, MockMP, AndFilter, filtered, original_list, EQ_FILTER, IN_FILTER, RANGE_FILTER, SOME_FILTER, getProperty, beforeAll, afterAll, beforeEach*/
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

    describe("Test AndFilter", function () {
        var widget;
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

        describe ("Should get any property", function () {

            it("Should get a normal property", function () {
                expect(AndFilter.getProperty({hello: "world"}, "hello")).toBe("world");
            });

            it("Should get a nested propert", function () {
                expect(AndFilter.getProperty({hello: {bye: "world"}}, "hello.bye")).toBe("world");
            });

            it("Should return input if no attribute to look for", function () {
               expect(AndFilter.getProperty("world", "")).toBe("world");
               expect(AndFilter.getProperty("world")).toBe("world");
            });

            it("Should return null if no value", function () {
               expect(AndFilter.getProperty({hello: null}, "hello")).toBe(null);
            });
        });

        describe ("Should filter values", function () {

            it("Should filter with the EQ_FILTER", function () {
                expect(AndFilter.EQ_FILTER("", "world", "world")).toBeTruthy();
                expect(AndFilter.EQ_FILTER("", "hello", "world")).not.toBeTruthy();
            });

            it("Should filter with the IN_FILTER", function () {
                expect(AndFilter.IN_FILTER("", ["hello", "world"], "world")).toBeTruthy();
                expect(AndFilter.IN_FILTER("", ["world", "hello"], "world")).toBeTruthy();
                expect(AndFilter.IN_FILTER("", ["hello", "bye"], "world")).not.toBeTruthy();
            });

            it("Should filter with the RANGE_FILTER", function () {
                expect(AndFilter.RANGE_FILTER("", 3, 6, 5)).toBeTruthy();
                expect(AndFilter.RANGE_FILTER("", 1, 2, 5)).not.toBeTruthy();
                expect(AndFilter.RANGE_FILTER("", 5, 6, 5)).toBeTruthy();
                expect(AndFilter.RANGE_FILTER("", 3, 5, 5)).toBeTruthy();
            });

            it("Should filter with the SOME_FILTER", function () {
                expect(AndFilter.SOME_FILTER("", "world", ["world", "hello"])).toBeTruthy();
                expect(AndFilter.SOME_FILTER("", "hello", ["bye", "world"])).not.toBeTruthy();
            });
        });
    });
})();
