## Introduction

The Jenkins test time difference widget widget is a WireCloud widget that provides the ability to show the time difference on the test passed to two different builds.

## Wiring

### Input Endpoints

- `Build Test List`: List of the tests passed by builds. Can be obtained through the `detailed-jenkins-test-data operator`.

### Output Endpoints

This widget has no outputs.

## Usage

To use this operator plug in a test list from the `detailed-jenkins-test-data operator`. To gather the tests passed by two builds, as required for this widget to work, two and filters can be used, merging together both builds before passing it to the `detailed-jenkins-test-data operator` by using the `union-list operator`.

If the time it took to pass the test is lower in the first build, the row will be displayed green, otherwise, it'll be red.

Input should be ordered before going to the `detailed-jenkins-test-data operator`, being the first build the newest one for the colors to display its colors properly.

If more than two build test lists are passed as input, only the first two will be used.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
