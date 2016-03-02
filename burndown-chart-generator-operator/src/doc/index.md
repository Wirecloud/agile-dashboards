## Introduction

The Burndown chart generator operator is a WireCloud operator that provides the ability to get the options needed to draw on the Highcharts widget a burndown chart from a Jira sprint. 

## Settings

No preferences needed for this operator to work.

## Wiring

### Input Endpoints

-`Jira Issues`: The issues associated to the sprint you want to draw

### Output Endpoints

-`Chart Data`: The chart options to be passed to the Highcharts widget.

## Usage

Get a single sprint issues from the Jira harvester and the Jira issue filter and plug it into the Jira Issues endpoint. The connect the output to the Highcharts widget.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
