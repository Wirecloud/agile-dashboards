Jira Issue Splitter operator
======================

The Jira Issue Splitter operator is a WireCloud operator that provides the ability to split Jira issue data.

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

-`Jira issue list`: A Jira issue list. Can be obtained with the Jira Harvester Operator.

### Output Endpoints

-`Issue status list`: A list of the Jira statuses the issues had.
-`Issue priority list`: A list of the Jira priorities the issues had.
-`Issue assignee list`: A list of the assignees the issues had.
-`Issue type list`: A list of the Jira types the issues had.

## Usage

Plug in a list of Jira issues, which can be obtained with the `Jira Harvester Operator` and filtered with the `Jira Issue Filter` and `And Filter 
Operator`.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWet
