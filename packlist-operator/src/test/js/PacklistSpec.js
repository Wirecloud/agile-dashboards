/*global describe, expect, it, MashupPlatform, MockMP, inputACallback, inputBCallback, beforeAll, afterAll, beforeEach*/
(function () {
    "use strict";

    describe("Test Packlist", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

        describe("Should pack items", function () {
            beforeEach(function () {
                inputACallback (null);
                inputBCallback (null);
            });

            it("Should pack two lists", function () {
                var a = [1, 2];
                var b = [3];
                var result = [a, b];
                result.metadata = {type: "packedList", tag: undefined, verbose: undefined};
                inputACallback(a);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                inputBCallback(b);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("packed-list");
                expect(call[1]).toEqual(result);
            });

            it("Should pack two non-list items", function () {
                var a = 1;
                var b = 2;
                var result = [a, b];
                result.metadata = {type: "packedList", tag: undefined, verbose: undefined};
                inputACallback(a);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                inputBCallback(b);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("packed-list");
                expect(call[1]).toEqual(result);
            });

            it("Should pack two non-list items with list items", function () {
                var a = 1;
                var b = [2];
                var result = [a, b];
                result.metadata = {type: "packedList", tag: undefined, verbose: undefined};
                inputACallback(a);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                inputBCallback(b);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("packed-list");
                expect(call[1]).toEqual(result);
            });

            it("Should append to packed lists", function () {
                var a = 1;
                var b = [2,3];
                b.metadata = {type: "packedList"};
                var result = [2, 3, 1];
                result.metadata = {type: "packedList"};
                inputACallback(a);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                inputBCallback(b);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("packed-list");
                expect(call[1]).toEqual(result);
            });

            it("Should merge packed lists", function () {
                var a = [1, 2];
                var b = [2, 3];
                a.metadata = {type: "packedList"};
                b.metadata = {type: "packedList"};
                var result = [1, 2, 2, 3];
                result.metadata = {type: "packedList"};
                inputACallback(a);
                expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
                inputBCallback(b);
                expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalled();

                var call = MashupPlatform.wiring.pushEvent.calls.first().args;
                expect(call[0]).toBe("packed-list");
                expect(call[1]).toEqual(result);
            });

        });

    });
})();
