Burndown chart generator operator
======================

The Burndown chart generator operator is a WireCloud operator that provides the ability to get the options needed to draw on the Highcharts widget a burndown chart from a sprint. 

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

No preferences needed for this operator to work.

## Wiring

### Input Endpoints

-`Issues`: The issues associated to the sprint you want to plot.

### Output Endpoints

-`Chart Data`: The chart options to be passed to the Highcharts widget.

## Usage

Plug into the `Issues` input endpoint issues from a single sprint and plug the output to the `Highcharts widget`.
You can get a single sprint's issues using the `set-generic-filter-conditions operator` and the `and-filter operator` together with the chosen issue harvester.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
