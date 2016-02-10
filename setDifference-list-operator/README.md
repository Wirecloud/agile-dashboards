SetDifference List Operator operator
======================

The Intersect List operator is a WireCloud operator that provides the ability to calculate the difference of two lists

The input lists may have nested lists.

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

There are no preferences for this operator.

## Wiring


### Input Endpoints

"Original list": The base list.

"List B": <list> The list to be removed form the "Original list".


### Output Endpoints

"Intersected list": The result of removing "List B" components from "Original list".

## Usage

When connected with two lists, calculates the intersection of both lists and pushes the result of the intersection to the "Intersected list" endpoint.


## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 Vendor
