## Introduction

The Product backlog chart operator is a WireCloud operator that provides the ability to plot a product backlog chart based on the input issues.

## Settings

- `Chart title`: The title of the resulting chart.

## Wiring

### Input Endpoints

- `Issues`: The set of issues to generate the chart from.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcharts widget.

## Usage

Generates a product backlog chart from the input issues.
Plots the creation, update and resolve line charts and the progress column chart for each month.


## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
