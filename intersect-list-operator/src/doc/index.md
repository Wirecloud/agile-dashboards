## Introduction

This operator helps you to filter lists, based on a list of provided AND-conditions.

## Settings



## Wiring

### Input Endpoints

- `Original List`: List with the original values
- `Condition List`: List of conditions to be fulfilled by the values of the original list to pass the filter. Supported filters:
    - `in`: checks if the value of a given attribute is equal to a list of provided values. E.g.: `{"type": "in", "attr": "milestone", "values": ["Nov 2015", "Dec 2015", "Jan 2016"]}`.
    - `range`: checks if the value of a given attribute is within a range of numbers. E.g.: `{"type": "range", "attr": "level", "start": 1, "end": 4}`.
    - `eq`: checks if the value of a given attribute is equal to a given value. E.g.: `{"type": "eq", "attr": "state", "value": "closed"}`.

### Output Endpoints

- `Filtered List`: This endpoint provides a list with the values of `Original List` passing the conditions indicated by the `Condition List`.

