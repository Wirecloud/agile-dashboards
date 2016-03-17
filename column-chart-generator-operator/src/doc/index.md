## Introduction

The Column chart generator operator is a WireCloud operator that provides the ability to plot column chats.

## Settings

- `Chart Title`: The chart title to be used.

## Wiring

### Input Endpoints

- `Data serie`: The data serie to be plotted. It must be a list of numbers
- `Label serie`: The labels for each column of the `Data serie`.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcarts widget.

# Usage

Plug in the serie you want to plot to the `Data serie` endpoint and plug the output to the `Highcharts widget`.

The `Label serie` input endpoint its not required.


## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
