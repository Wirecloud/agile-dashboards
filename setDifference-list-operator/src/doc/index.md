## Introduction

The Intersect List operator is a WireCloud operator that provides the ability to calculate the difference of two lists.

The input lists may have nested lists.

## Settings

There are no preferences for this operator.

## Wiring

### Input Endpoints

- `Original list`: The base list.

- `List B`: The list to be removed form the `Original list`.


### Output Endpoints

- `Intersected list`: The result of removing `List B` components from `Original list`.

## Usage

When connected with two lists, calculates the intersection of both lists and pushes the result of the intersection to the `Intersected list` endpoint.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
