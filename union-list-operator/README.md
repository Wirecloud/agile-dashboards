Union List Operator operator
======================

The Union List Operator operator is a WireCloud operator that provides the ability to calculate the union between two lists.
The input lists may have nested elements.

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

No settings needed for this operator to work.

## Wiring

### Input Endpoints

- `List A`: List to be joined with List B`
- `List B`: List to be joined with List A`

### Output Endpoints

- `Union List`: This endpoint provides a list containing the union between `List A` and `List B` items.

## Usage

When connected with two lists, calculates the union of both lists and pushes the result to the "Union List" endpoint.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNwet
