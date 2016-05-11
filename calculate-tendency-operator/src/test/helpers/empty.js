/* global MockMP */
window.MashupPlatform = new MockMP.MockMP();
MashupPlatform.wiring.registerStatusCallback = function () {};
MashupPlatform.operator = {};
MashupPlatform.operator.outputs = {};
MashupPlatform.operator.outputs.median = {connected: true};
MashupPlatform.operator.outputs.mode = {connected: true};
MashupPlatform.operator.outputs["standard-deviation"] = {connected: true};