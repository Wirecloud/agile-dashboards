Pie Chart Generator operator
======================

The Pie Chart Generator operator is a WireCloud operator that provides the ability to draw pie charts.

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

-`Chart Title`: The title for the chart.

## Wiring

### Input Endpoints

-`Number Data Serie`: A data series made of numeric values. 
-`Label Data Serie`: A data series made of labels.

### Output Endpoints

-`Chart Data Model`: The chart data model to be passed to the Highcharts widget.

## Usage

Plug in one of the inputs (`Label Data Serie` takes preference) and plug the output to the Highcharts widget.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
