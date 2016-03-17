Labels to dataserie operator operator
======================

The Labels to dataserie operator operator is a WireCloud operator that provides the ability to transform a label series into a number series, so it can be used with other components like the `calculate-tendency operator` and the `column-chart-generator operator`.

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

- `Label list`: The list of labels to be transformed

### Output Endpoints

- `Data serie`: The data serie obtained.
- `Reduced label serie`: The labels for each of the values of the `Data serie`

## Usage

Plug a label list to transform it into a number list.
The output `Data serie` will be a list with the count of appearances for each of the input labels.
The `Reduced label serie` its the labels associated to each of the counts, in the same order as in the `Data serie`. Hence, there won't be any repeated labels.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
