Test time difference widget
======================

The Jenkins test time difference widget widget is a WireCloud widget that provides the ability to show the time difference on the test passed to two different builds.

Build
-----

Be sure to have installed [Node.js](http://node.js) and [Bower](http://bower.io) in your system. For example, you can install it on Ubuntu and Debian running the following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g bower
```

If you want the last version of the widget, you should change to the `develop` branch:

```bash
git checkout develop
```

Install other npm dependencies by running: (need root because some libraries use applications, check package.json before to be sure)

```bash
sudo npm install
```

For build the widget you need download grunt:

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

- `Build Test List`: List of the tests passed by builds. Can be obtained through the `detailed-jenkins-test-data operator`.

### Output Endpoints

This widget has no outputs.

## Usage

To use this operator plug in a test list from the `detailed-jenkins-test-data operator`. To gather the tests passed by two builds, as required for this widget to work, two and filters can be used, merging together both builds before passing it to the `detailed-jenkins-test-data operator` by using the `union-list operator`.

If the time it took to pass the test is lower in the first build, the row will be displayed green, otherwise, it'll be red.

Input should be ordered before going to the `detailed-jenkins-test-data operator`, being the first build the newest one for the colors to display its colors properly.

If more than two build test lists are passed as input, only the first two will be used.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
Licensed under the MIT license.
