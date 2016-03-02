Jira filter conditions widget
======================

The Jira filter conditions widget is a WireCloud widget that provides the ability to filter the issues harvested with the Jira harvester operator.

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

## Settings

No settings needed.

## Wiring

### Input Endpoints

-`Jira issues`: The list of issues to be filtered.

### Output Endpoints

-`Filter conditions`:The filter conditions to be passed to the `and-filter-operator`.

## Usage

Select the conditions you want to apply to the list of Jira issues.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
Licensed under the MIT license.
