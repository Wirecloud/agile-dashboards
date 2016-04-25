## Introduction

The Issue table generator operator is a WireCloud operator that provides the ability to plot normalized issues on a table.
This creates the expected input for the `data table viewer widget`.

## Wiring

### Input Endpoints

- `Issues`: The normalized issues to be plotted. This can be obtained with any of the normalized issues harvesters.

### Output Endpoints

- `Table Data Model`: The table configuration and data to be plotted. This should be passed to the `data table viewer widget`.

## Usage

Connect the issues to be shown on the table to the `Issues` endpoint and plug the `Data and Structure` endpoint to the `data table viewer widget`. The input issues may be harvested with any of the normalized issues harvesters, such as the `github harvester operator`.
