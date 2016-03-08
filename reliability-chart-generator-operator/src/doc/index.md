## Introduction

This operator allows you to create the data model needed by chart widgets to show developers' reliability-related data.

## Settings

- `Chart title`: The title to be given to the resulting chart.

## Wiring

### Input Endpoints

- `Issue List`: The list of issues to be analysed.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcharts widget.

## Usage

If all the input issues have the same assignee, a pie chart will be displayed.
If there are multiple assignees, a columch chart for each assignee will be displayed instead.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
