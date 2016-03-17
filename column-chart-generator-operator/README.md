Column chart generator operator
======================

The Column chart generator operator is a WireCloud operator that provides the ability to plot column chats.

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

## Wiring

### Input Endpoints

- `Data serie`: The data serie to be plotted. It must be a list of numbers
- `Label serie`: The labels for each column of the `Data serie`.

### Output Endpoints

- `Chart Data Model`: The data model to be passed to the highcarts widget.

# Usage

Plug in the serie you want to plot to the `Data serie` endpoint and plug the output to the `Highcharts widget`.

The `Label serie` input endpoint its not required.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
