## Introduction

The Detailed Jenkins test report data operator is a WireCloud operator that provides the ability to harvest detailed data about the test passed by a build. This is usefull for comparing each test duration between two builds using the `jenkins-test-time-difference operator`. 


## Settings

- `Max queries`: Limit the maximun ammount of builds that can receive at a time. This is usefull to prevent misuse of this operator, as large quantities of queries can freeze the browser.

## Wiring

### Input Endpoints

- `Jenkins builds`: The jenkins builds to be analyzed.

### Output Endpoints

- `Test data`: The detailed test data about the input builds.

## Usage

Plug in a build or a list of builds to have it harvested.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
