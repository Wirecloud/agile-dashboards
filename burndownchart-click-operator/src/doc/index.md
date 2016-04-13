## Introduction

The Burndown chart click operator is a WireCloud operator that provides the ability to get, from the burndown chart, the issues closed on the selected day.

## Wiring

### Input Endpoints

- `Selected data`: The data selected from the highcharts widget. 
- `Issues`: The same issues passed to the burndown chart.

### Output Endpoints

- `Selected Issues`: The issues of the selected day.

## Usage

This operator must be used in conjunction with the Burndown chart generator operator and the Highcharts widget. 
To setup this operator, the input of the burndown chart generator must be connected to the input of this operator, same with the output of the highcharts widget.
Once the setup is done, you can click on the highcharts widget to select a point of the graph, and this operator will send through its output the issues that where closed on the chosen day.
