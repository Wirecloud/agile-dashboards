Product backlog chart operator
======================

The Product backlog chart operator is a WireCloud operator that provides the ability to plot a product backlog chart based on the input issues.

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

- `Chart title`: The title of the resulting chart.

## Wiring

### Input Endpoints

- `Issues`: The set of issues to generate the chart from.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcharts widget.

## Usage

Generates a product backlog chart from the input issues.
Plots the creation, update and resolve line charts and the progress column chart for each month.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
