Gitlab Harvester Operator operator
======================

The Gitlab Harvester Operator provides a list with all the issues and a list with all the commits of a Gitlab project.

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

- `Gitlab URL` : URL to the gitlab server. (https://your.gitlab.server.com)
- `Gitlab project full name` : Name of the gitlab project. This has the following format: username / project name. This can be easily found on the home page of the Gitlab instance.
- `Max`: The ammount of issues and commits to be harvested. If set to a negative number, there's  no limit to the ammount of items harvested, while setting it to 0 shuts down harvesting.
- `Private token` : Private token to be used for authentication
- `Oauth2 token` : Oath2 token to be used for authentication

Only one of both tokens is needed in order to harvest data.

## Wiring

### Output Endpoints

-`Issue List` : A list with all the issues of the chosen Gitlab project.
-`Commit List` : A list with all the commits of the chosen Gitlab project.

## Usage

This operator needs to have configured the gitlab URL, project name, and the token of at least one of the available authentication methods (Private token or OAuth2).

## Copyright and License

Copyright (c) 2016 Conwet
