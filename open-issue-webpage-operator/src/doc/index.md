## Introduction

The Open issue webpage operator is a WireCloud operator that provides the ability to open browser tabs with the input issue website.
It opens the `link` property of the input item, so it can be used with anything that has said property.

## Settings

- `Maximum tabs`: The maximum number of tabs to be opened. If there are more input issues, only the `Maximum tabs` first ones will be opened.
- `Block previous links`: Blocks the last input links from being opened again. This can be useful to stop components that send the same data multiple times from flooding the browser with tabs.

## Wiring

### Input Endpoints

- `Agile issue`: The issue whose website is to be opened.

## Usage

Plug in any agile issue harvested with the agile issues harvesters such as the Github harvester and the website will open.
