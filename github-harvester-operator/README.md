GitHub Harvester operator
======================

The GitHub Harvester operator is a WireCloud operator that provides the ability to harvest issues and commits from Github.

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

- `Repository owner username`: The Github username of the repository owner.
- `Repository name`: The name of the target repository.
- `Max`: The ammount of issues and commits to be harvested. If set to a negative number, there's  no limit to the ammount of items harvested, while setting it to 0 shuts down harvesting.
- `OAuth2 token`: The token to authenticate on Github. This is the primary way of authentication.
- `Github login username`: Your Github user to use Basic authentication.
- `Github login password`: Your Github password to use Basic authentication.

## Wiring

### Output Endpoints

- `Issue List`: List of the Github issues and the available milestones. (Milestones are considered agile sprints if possible).
- `Commit List`: List of the Github commits.

## Usage

Configure the needed settings and connect the issue / commit list to the desired operator/widget.

Oauth2 authentication takes preference, therefore, if both means of authentication are provided, only Oauth2 will be used.

If the repository is public, it can be accessed without authentication. Github may restrict the number of queries done while not authenticated, though.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 CoNWeT
Licensed under the Apache2 license.
