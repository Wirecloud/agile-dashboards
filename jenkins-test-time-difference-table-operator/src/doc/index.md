## Introduction

Generates a table to see the time difference betweent the tests of two Jenkins builds.

## Settings

- `Number of decimals`: This preference allows to change the number of decimals to be displayed on the table. Defaults to 3 decimals.

## Wiring

### Input Endpoints

- `Build Test List`: List of the tests passed by builds. Can be obtained through the `detailed-jenkins-test-data operator`.

### Output Endpoints

- `Data and Structure`: The table configuration and data to be plotted. This should be passed to the `data table viewer widget`.

## Usage

To use this operator plug in a test list from the `detailed-jenkins-test-data operator`. To gather the tests passed by two builds, as required for this widget to work, two and filters can be used, merging together both builds before passing it to the `detailed-jenkins-test-data operator` by using the `union-list operator`.

Rows will be displayed with colors: danger color (red by default) when the test time increased, info color (blue by default) when there's no change in test time, and success color (green by default) when the test time decreased.

Input should be ordered before going to the `detailed-jenkins-test-data operator`, being the first build the newest one for the row colors to be displayed properly.

If more than two build test lists are passed as input, only the first two will be used.