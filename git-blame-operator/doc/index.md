## Introduction

The Git blame for bugs operator is a WireCloud operator that provides the ability to get the owners of the deleted lines of code on a commit.

## Wiring

### Input Endpoints

- `Closing commit`: The commit to be analyzed

### Output Endpoints

- `Table Data Model`: The table settings to display the blamed authors. This should be used with the data-viewer operator

## Usage

Plug in a commit to get the blamed authors of the deleted lines of code. For example, this can be used with the get-closing-commit-operator to get the authors of the deleted lines of code in the resolution of a bug.
