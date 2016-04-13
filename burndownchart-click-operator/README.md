My project name operator
======================

The Burndown chart click operator is a WireCloud operator that provides the ability to get, from the burndown chart, the issues closed on the selected day.


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

## Wiring

### Input Endpoints

- `Selected data`: The data selected from the highcharts widget. 
- `Issues`: The same issues passed to the burndown chart.

### Output Endpoints

- `Selected Issues`: The issues of the selected day.

## Usage

This operator must be used in conjunction with the Burndown chart generator operator and the Highcharts widget. 
To setup this operator, the input of the burndown chart generator must be connected to the input of this operator, same with the output of the highcharts widget.
Once the setup is done, you can click on the highcharts widget to select a point of the graph, and this operator will send through its output the issues that where closed on the chosen day.

## Copyright and License

Copyright (c) 2016 CoNWet
Licensed under the MIT license.
