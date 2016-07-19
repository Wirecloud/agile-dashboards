/*global expect, it ,describe , MashupPlatform, CalculateTendency, beforeAll, beforeEach*/
(function () {
    "use strict";

    describe("Test CalculateTendency", function () {
        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

        it("Should work with empty lists", function () {
            MashupPlatform.wiring.pushEvent.calls.reset();
            CalculateTendency.valuesCallback([]);
            expectWiringCallback("count", 0);
        });

        describe("Should calculate outputs for numeric lists", function () {
            beforeAll (function () {
                MashupPlatform.wiring.pushEvent.calls.reset();
                var values = [ 2 ,4 ,3, 1];
                CalculateTendency.valuesCallback(values);
            });

            it("Should calculate minimum", function () {
                expectWiringCallback("minimum", 1);
            });

            it("Should calculate maximum", function () {
                expectWiringCallback("maximum", 4);
            });

            it("Should calculate arithmetic-mean", function () {
                expectWiringCallback("arithmetic-mean", 2.5);
            });

            it("Should calculate count", function () {
                expectWiringCallback("count", 4);
            });

            it("Should calculate sum", function () {
                expectWiringCallback("sum", 10);
            });

            it("Should calculate median", function () {
                expectWiringCallback("median", 2.5);
            });

            it("Should calculate mode", function () {
                expectWiringCallback("mode", 2);
            });

            it("Should calculate standard-deviation", function () {
                expectWiringCallback("standard-deviation", 1.118033988749895);
            });

            it("Should calculate median when ", function () {
                MashupPlatform.wiring.pushEvent.calls.reset();
                var values = [ 2 ,2, 5, 3, 1];
                CalculateTendency.valuesCallback(values);
                expectWiringCallback("median", 2);
            });

            it("Should calculate mode when multiple values are repeated", function () {
                MashupPlatform.wiring.pushEvent.calls.reset();
                var values = [ 2 ,2, 5, 3, 3, 2];
                CalculateTendency.valuesCallback(values);
                expectWiringCallback("mode", 2);
            });
        });

        describe ("Should calculate outputs non-numeric lists", function () {
            it("Should calculate count", function () {
                MashupPlatform.wiring.pushEvent.calls.reset();
                var values = [ "hello", "world", "bye"];
                CalculateTendency.valuesCallback(values);
                expectWiringCallback("count", 3);
            });
        });
        
    });

    var expectWiringCallback = function expectWiringCallback (name, value) {
        expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith(name, JSON.stringify({value: value}));
    };

})();
