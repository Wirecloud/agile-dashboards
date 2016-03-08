Trend Chart Generator operator
======================

The Trend Chart Generator operator is a WireCloud operator that provides the ability to generate trend charts.

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

- `Chart Title`: The chart title to be used.
- `Maximum value`: Y axis maximum value of the chart.

## Wiring

### Input Endpoints

- `Data Serie`: A list of the numeric values to be used on the series. Can be a packed list to plot multiple series.
- `Timestamp List`: A timestamp list to be used on the x-axis.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcarts widget.

## Usage

Plug a data serie and a timestamp to get it plotted.
The input data serie can be a packed list made through the `packList-operator`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2015 CoNWeT
