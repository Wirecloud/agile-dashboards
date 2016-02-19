## Introduction

The Burndown chart generator operator is a WireCloud operator that provides the ability to get the options needed to draw on the Highcharts widget a burndown chart from a Jira sprint. 

## Settings

No preferences needed for this operator to work.

## Wiring

### Input Endpoints

-`Sprint`: The sprint you want to draw.

### Output Endpoints

-`Chart Data`: The chart options to be passed to the Highcharts widget.

## Usage

Plug in a sprint harvested with the Jira Harvester operator to the `Sprint` endpoint, and then connect the output endpoint `Chart Data` to the Highcharts widget.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
