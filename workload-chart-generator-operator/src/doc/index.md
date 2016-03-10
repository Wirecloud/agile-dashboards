## Introduction

The Workload Chart Generator operator is a WireCloud operator that provides the ability to plot workload charts of a agile project based on assigned issues or the number of commits made by each author.

## Settings

- `Chart Title`: The title for the chart.

## Wiring

### Input Endpoints

- `Issues`: The input issues
- `Commits`: The input commits


### Output Endpoints

- `Chart Data Model`: The chart data model to be passed to the Highcharts widget.

## Usage

Plug in the issues/commits you want analyzed and plug the output to the Highcharts widget.
You can harvest the issues/commits with the github or gitlab harvesters and filter them using the `set-generic-filter-conditions` operator and the `and-filter-operator`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
