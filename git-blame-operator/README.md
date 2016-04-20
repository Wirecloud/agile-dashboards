Git blame for bugs operator
======================

The Git blame for bugs operator is a WireCloud operator that provides the ability to get the owners of the deleted lines of code on a commit.

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

- `Closing commit`: The commit to be analyzed

### Output Endpoints

- `Blame table`: The table settings to display the blamed authors. This should be used with the data-viewer operator

## Usage

Plug in a commit to get the blamed authors of the deleted lines of code. For example, this can be used with the get-closing-commit-operator to get the authors of the deleted lines of code in the resolution of a bug.

## Copyright and License

Copyright (c) 2016 CoNWeT
Licensed under the MIT license.
