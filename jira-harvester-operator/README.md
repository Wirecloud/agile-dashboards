Jira harvester operator operator
======================

This operator allows you to harvest Jira issue data.

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

- `Jira server URL`: The Jira instance URI.
- `Jira project key`: The key of the Jira project.
- `Jira project component`:  The name of the component.
- `Jira username`: Your Jira username.
- `Jira password`: Your Jira password.

## Wiring

### Output Endpoints

- `Jira Issues`: A list of Jira issues associated to the target component.

## Copyright and License

Copyright (c) 2016 Conwet
