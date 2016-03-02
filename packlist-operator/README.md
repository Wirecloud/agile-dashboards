Packlist operator operator
======================

The Packlist operator operator is a WireCloud operator that packs items into a list or appends items to a packed list. 

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

- No settings needed

## Wiring

### Input Endpoints

- `First input`: Anything.
- `Second inout`: Anything.

## Output Endpoints

- `Intersected List`: This endpoint provides a list with the items of `Original List A` that match the ones of `Original List B`

## Usage

This operator creates a list of elements. Those elements can be any type.

This operator can be used to draw multiple series of data on a single chart, for example.


## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
