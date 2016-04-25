## Introduction

The Jenkins project build list table operator is a WireCloud operator that provides the ability to show on a table the list of Jenkins builds.

## Wiring

### Input Endpoints

- `Build List`: The jenkins builds to be shown on the table.

### Output Endpoints

- `Table Data Model`: The table configuration and data to be plotted. This should be passed to the `data table viewer widget`.

## Usage

Connect the builds to be shown on the table to the `Issues` endpoint and plug the `Data and Structure` endpoint to the `data table viewer widget`.
