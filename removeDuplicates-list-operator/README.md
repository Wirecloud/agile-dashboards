Remove Duplicates List Operator
======================

The Remove Duplicates List Operator operator is a WireCloud operator that provides the ability to remove any duplicated item of a list.
This operator can use any kind of list.

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

No settings needed for this operator to work

## Wiring

### Input Endpoints

-`Original list`: The list whose duplicates are to be removed.

### Output Endpoints

-`Output list`: The `Original list` with no duplicated items. 

## Usage

Plug&play

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
