/*global describe, it, expect, MashupPlatform, MockMP, checkEqual, removeDuplicates, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test RemoveDuplicatesList", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

        describe ("Should detect equal elements", function (){
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
        });

        describe("Should remove repeated elements", function () {
            it("Should not touch non-repeated lists", function () {
                var pureList = [1, 2, 3, 0];
                expect(removeDuplicates(pureList)).toEqual(pureList);
            });

            it("Should remove repeated numbers", function () {
                var duplicatedList = [1, 2, 3, 1, 1, 1, 2, 3, 3, 2, 1, 2, 3, 0, 0];
                var pureList = [1, 2, 3, 0];
                expect(removeDuplicates(duplicatedList)).toEqual(pureList);
            });

            it("Should remove repeated strings", function () {
                var duplicatedList = ["hello", "hello", "world"];
                var pureList = ["hello", "world"];
                expect(removeDuplicates(duplicatedList)).toEqual(pureList);
            });

            it("Should remove repeated objects", function () {
                var duplicatedList = [{text:"hello"}, {text:"hello"}, {different: "world"}];
                var pureList = [{text: "hello"}, {different: "world"}];
                expect(removeDuplicates(duplicatedList)).toEqual(pureList);
            });


            it("Should remove repeated items in mixed lists", function () {
                var duplicatedList = [1, 2, "hello", 2, 2, "hello", {text:"hello"}, {text:"hello"}, {different: "world"}, "hello"];
                var pureList = [1, 2, "hello", {text: "hello"}, {different: "world"}];
                expect(removeDuplicates(duplicatedList)).toEqual(pureList);
            });
        });

    });
})();
