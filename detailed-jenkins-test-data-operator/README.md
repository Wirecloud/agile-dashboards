Detailed Jenkins test report data operator
======================

The Detailed Jenkins test report data operator is a WireCloud operator that provides the ability to harvest detailed data about the test passed by a build. This is usefull for comparing each test duration between two builds using the `jenkins-test-time-difference operator`. 

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

- `Max queries`: Limit the maximun ammount of builds that can receive at a time. This is usefull to prevent misuse of this operator, as large quantities of queries can freeze the browser.

## Wiring

### Input Endpoints

- `Jenkins builds`: The jenkins builds to be analyzed.

### Output Endpoints

- `Test data`: The detailed test data about the input builds.

## Usage

Plug in a build or a list of builds to have it harvested.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
