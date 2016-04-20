Get issue closing commit operator
======================

The Get issue closing commit operator is a WireCloud operator that provides the ability to get the commit that close an issue.

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

- `OAuth2 token`: The token to authenticate on Github. This is the primary way of authentication.
- `Github login username`: Your Github user to use Basic authentication.
- `Github login password`: Your Github password to use Basic authentication.

## Wiring

### Input Endpoints

- `Target issue`: The issue whose closing commit is to be harvested. Can be a list (Will get the first issue) or an issue.

### Output Endpoints

- `Closing commit`: The commit that closed the input issue

## Usage

Send in an issue to get its closing commit. The authentication settings are needed if the repository is private.

This operator is useful when used with the `git-blame-operator`

## Copyright and License

Copyright (c) 2016 CoNWeT
Licensed under the MIT license.
