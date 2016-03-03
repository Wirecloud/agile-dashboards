Reliability Chart Generator operator
======================

This operator allows you to create the data model needed by chart widgets to show developers' reliability-related data.

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

- `Chart title`: The title to be given to the resulting chart.

## Wiring

### Input Endpoints

- `Issue List`: The list of issues to be analysed.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcharts widget.

## Usage

If all the input issues have the same assignee, a pie chart will be displayed.
If there are multiple assignees, a columch chart for each assignee will be displayed instead.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWeT
Licensed under the Apache2 license.
