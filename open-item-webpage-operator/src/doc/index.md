## Introduction

The Open item webpage operator is a WireCloud operator that provides the ability to open browser tabs with the input item website.
It opens the `link` property of the input item, so it can be used with anything that has said property.

## Settings

- `Maximum tabs`: The maximum number of tabs to be opened. If there are more input items, only the `Maximum tabs` first ones will be opened.
- `Block previous links`: Blocks the last input links from being opened again. This can be useful to stop components that send the same data multiple times from flooding the browser with tabs.

## Wiring

### Input Endpoints

- `Item`: The item whose website is to be opened.

## Usage

Plug in any item or list of items to open their websites.

The input items must have a link field, being this field the website to be opened.
