## Introduction

The Trend Chart Generator operator is a WireCloud operator that provides the ability to generate trend charts.

## Settings

- `Chart Title`: The chart title to be used.
- `Maximum value`: Y axis maximum value of the chart.

## Wiring

### Input Endpoints

- `Data Serie`: A list of the numeric values to be used on the series. Can be a packed list to plot multiple series.
- `Timestamp List`: A timestamp list to be used on the x-axis.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcarts widget.

## Usage

Plug a data serie and a timestamp to get it plotted.
The input data serie can be a packed list made through the `packList-operator`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Apache2
