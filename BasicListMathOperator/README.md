Basic List Arithmetic Operator
======================

This operator provides basic arithemtic operations that can be used between lists and non-list
- Addition
- Subtraction
- Multiplication
- Division

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

- `Input A`: First input. Can be a list or a string or number.
- `Input B`: First input. Can be a list or a string or number.

### Output Endpoints

- `Addition`: Result of the addition of both inputs. Its a list if any of the inputs was a list.
- `Subtraction`: Result of the subtraction of `Input A` minus `Input B`. Its a list if any of the inputs was a list.
- `Multiplication`: Result of the multiplication of both inputs. Its a list if any of the inputs was a list.
- `Division`: Result of the division of `Input A` divided by `Input B`. Its a list if any of the inputs was a list.

## Usage

Plug into the operator the items you want to operate and connect to the desired output endpoints.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
