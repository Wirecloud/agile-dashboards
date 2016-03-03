## Introduction

The issue-splitter-operator is a WireCloud operator that provides the ability to split normalized issue data obtained with the agile harvesters.

## Wiring

### Input Endpoints

-`Issue list`: A normalized issue list. Can be obtained with any agile issue harvester operators.

### Output Endpoints

-`Issue status list`: A list of the statuses the issues had.
-`Issue priority list`: A list of the priorities the issues had.
-`Issue assignee list`: A list of the assignees the issues had.
-`Issue type list`: A list of the types the issues had.

## Usage

Plug in a list of normalized issues, which can be obtained with any agile issue harvester operator, such as the `jira-harvester-operator` and filtered with the `set-generic-filter-conditions` and the `and-filter-operator`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
