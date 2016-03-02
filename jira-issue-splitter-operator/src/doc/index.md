## Introduction

Splitter for Jira issues.

## Wiring

### Input Endpoints

-`Jira issue list`: A Jira issue list. Can be obtained with the Jira Harvester Operator.

### Output Endpoints

-`Issue status list`: A list of the Jira statuses the issues had.
-`Issue priority list`: A list of the Jira priorities the issues had.
-`Issue assignee list`: A list of the assignees the issues had.
-`Issue type list`: A list of the Jira types the issues had.

## Usage

Plug in a list of Jira issues, which can be obtained with the `Jira Harvester Operator` and filtered with the `Jira Issue Filter` and `And Filter 
Operator`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
