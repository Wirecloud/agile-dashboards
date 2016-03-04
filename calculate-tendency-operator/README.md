Calculate Tendency operator
======================

This operator allows you to calculate different trend tendencies from a list of values.

It supports:

- Maximum
- Minimum
- Arithmetic mean
- Median
- Mode
- Standard Deviation
- Count
- Sum


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

- `Value List`: A list of numeric values.

### Output Endpoints

- `Minimum`: The minimun value of `Value List`.
- `Maximum`: The maximun value of `Value List`.
- `Arithmetic Mean`: The mean of `Value List`.
- `Median`: The median value of `Value List`.
- `Mode`: The mode value of `Value List`.
- `Standard Deviation`: The standard deviation of `Value List`.
- `Count`: Lenght of the `Value List`.
- `Sum`: Sum of the values of `Value List`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2015 CoNWeT
Licensed under the Apache2 license.
