## Introduction

The Labels to dataserie operator operator is a WireCloud operator that provides the ability to transform a label series into a number series, so it can be used with other components like the `calculate-tendency operator` and the `column-chart-generator operator`.

## Wiring

### Input Endpoints

- `Label list`: The list of labels to be transformed

### Output Endpoints

- `Data serie`: The data serie obtained.
- `Reduced label serie`: The labels for each of the values of the `Data serie`

## Usage

Plug a label list to transform it into a number list.
The output `Data serie` will be a list with the count of appearances for each of the input labels.
The `Reduced label serie` its the labels associated to each of the counts, in the same order as in the `Data serie`. Hence, there won't be any repeated labels.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
