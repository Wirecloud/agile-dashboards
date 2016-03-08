Generic Filter Conditions widget
======================

The Generic Filter Conditions widget is a WireCloud widget that provides the ability to choose the filters to be applied to the input data by a filter operator like the `and-filter-operator`.

Build
-----

Be sure to have installed [Node.js](http://node.js) and [Bower](http://bower.io) in your system. For example, you can install it on Ubuntu and Debian running the following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g bower
```

If you want the last version of the widget, you should change to the `develop` branch:

```bash
git checkout develop
```

Install other npm dependencies by running: (need root because some libraries use applications, check package.json before to be sure)

```bash
sudo npm install
```

For build the widget you need download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `dist` folder.

## Settings

No settings needed for this operator to work.

## Wiring

### Input Endpoints

- `Input data`: The source data to be filtered. Must be compatible.

### Output Endpoints

- `Filter conditions`: The filter conditions to be passed to a filter operator.

## Usage

After giving as input a compatible data source, you can select the filters you want at the workspace view.

The output should be connected to a filter operator like the `and-filter-operator`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
Licensed under the MIT license.
