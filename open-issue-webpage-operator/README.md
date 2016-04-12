Open issue webpage operator
======================

The Open issue webpage operator is a WireCloud operator that provides the ability to open browser tabs with the input issue website.
It opens the `link` property of the input item, so it can be used with anything that has said property.

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

- `Maximum tabs`: The maximum number of tabs to be opened. If there are more input issues, only the `Maximum tabs` first ones will be opened.
- `Block previous links`: Blocks the last input links from being opened again. This can be useful to stop components that send the same data multiple times from flooding the browser with tabs.

## Wiring

### Input Endpoints

- `Agile issue`: The issue whose website is to be opened.

## Usage

Plug in any agile issue harvested with the agile issues harvesters such as the Github harvester and the website will open.

## Copyright and License

Copyright (c) 2016 CoNWet
Licensed under the MIT license.
