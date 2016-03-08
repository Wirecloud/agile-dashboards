## Introduction

The Burndown chart generator operator is a WireCloud operator that provides the ability to get the options needed to draw on the Highcharts widget a burndown chart from a sprint. 

## Settings

No preferences needed for this operator to work.

## Wiring

### Input Endpoints

-`Issues`: The issues associated to the sprint you want to plot.

### Output Endpoints

-`Chart Data`: The chart options to be passed to the Highcharts widget.

## Usage

Plug into the `Issues` input endpoint issues from a single sprint and plug the output to the `Highcharts widget`.
You can get a single sprint's issues using the `set-generic-filter-conditions operator` and the `and-filter operator` together with the chosen issue harvester.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
