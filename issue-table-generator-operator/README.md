Issue table generator operator
======================

The Issue table generator operator is a WireCloud operator that provides the ability to plot normalized issues on a table.
This creates the expected input for the `data table viewer widget`.

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

- `Issues`: The normalized issues to be plotted. This can be obtained with any of the normalized issues harvesters.

### Output Endpoints

- `Data and Structure`: The table configuration and data to be plotted. This should be passed to the `data table viewer widget`.

## Usage

Connect the issues to be shown on the table to the `Issues` endpoint and plug the `Data and Structure` endpoint to the `data table viewer widget`. The input issues may be harvested with any of the normalized issues harvesters, such as the `github harvester operator`.

## Copyright and License

Copyright (c) 2016 CoNWet
Licensed under the MIT license.
