/*global expect, it, describe, MashupPlatform, MockMP, checkEqual, calculate_union, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test UnionList", function () {
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

        describe ("Should calculate the union of two lists", function() {
            it("Should work with number lists", function (){
                var listA = [1, 2, 3];
                var listB = [2, 3, 4];
                var result = [1, 2, 3, 4];

                expect(calculate_union(listA, listB)).toEqual(result);
            });

            it("Should work with string lists", function (){
                var listA = ["hello", "world"];
                var listB = ["hello", "bye"];
                var result = ["hello", "world", "bye"];

                expect(calculate_union(listA, listB)).toEqual(result);
            });

            it("Should work with object lists", function (){
                var listA = [{text: "hello"}, {text: "world"}];
                var listB = [{text: "hello"}, {text: "bye"}];
                var result = [{text: "hello"}, {text: "world"}, {text: "bye"}];

                expect(calculate_union(listA, listB)).toEqual(result);
            });

            it("Should work with mixed lists", function (){
                var listA = [1, 2, 3, {text: "hello"}, {text: "world"}, "hello"];
                var listB = [2, 3, 4, {text: "hello"}, {text: "bye"}, "hello", "world"];
                var result = [1, 2, 3, {text: "hello"}, {text: "world"}, "hello", 4, {text: "bye"}, "world"];

                expect(calculate_union(listA, listB)).toEqual(result);
            });
        });

    });
})();
