AND Filter operator
======================

The AND Filter operator is a WireCloud operator that provides the ability to filter a source list with a set of conditions defined by the user. 
The resulting list's items will fulfill all the chosen conditions.

Build
-----

Be sure to have installed [Node.js](http://node.js) in your system. For example, you can install it on Ubuntu and Debian running the following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
```

If you want the last version of the operator, you should change to the `develop` branch:

```bash
git checkout develop
```

Install other npm dependencies by running: (need root because some libraries use applications, check package.json before to be sure)

```bash
sudo npm install
```

For build the operator you need download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `dist` folder.

## Settings

No settings needed for this operator to wortk.

## Wiring

### Input Endpoints

- `Original List`: List with the original values
- `Condition List`: List of conditions to be fulfilled by the values of the original list to pass the filter. Supported filters:
    - `in`: checks if the value of a given attribute is equal to a list of provided values. E.g.: `{"type": "in", "attr": "milestone", "values": ["Nov 2015", "Dec 2015", "Jan 2016"]}`.
    - `range`: checks if the value of a given attribute is within a range of numbers. E.g.: `{"type": "range", "attr": "level", "start": 1, "end": 4}`.
    - `eq`: checks if the value of a given attribute is equal to a given value. E.g.: `{"type": "eq", "attr": "state", "value": "closed"}`.
    - `not`: checks if the value of a given attribute is not equal to a given value. E.g.: `{"type": "not", "attr": "state", "value": "closed"}`.
    - `some`: checks if any of the values of a given attribute is equal to a given value. E.g.: `{type: "some", "attr": changesList, "value": "change"}`

### Output Endpoints

- `Filtered List`: This endpoint provides a list with the values of `Original List` passing the conditions indicated by the `Condition List`.

## Usage

Plug in any kind of data and a set of conditions (for example, the `jira-harvester operator` and the conditions provived by the `set-generic-filter-conditions widget`).

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWeT
Licensed under the Apache2 license.
