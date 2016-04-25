Jenkins project build list table operator
======================

The Jenkins project build list table operator is a WireCloud operator that provides the ability to show on a table the list of Jenkins builds.

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

- `Build List`: The jenkins builds to be shown on the table.

### Output Endpoints

- `Table Data Model`: The table configuration and data to be plotted. This should be passed to the `data table viewer widget`.

## Usage

Connect the builds to be shown on the table to the `Issues` endpoint and plug the `Data and Structure` endpoint to the `data table viewer widget`.

## Copyright and License

Copyright (c) 2016 CoNWet
Licensed under the MIT license.
