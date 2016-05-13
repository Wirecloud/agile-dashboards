## Introduction

The Gitlab Harvester Operator provides a list with all the issues and a list with all the commits of a Gitlab project.

## Settings

- `Gitlab URL` : URL to the gitlab server. (https://your.gitlab.server.com)
- `Gitlab project full name` : Name of the gitlab project. This has the following format: username / project name. This can be easily found on the home page of the Gitlab instance.
- `Max`: The ammount of issues and commits to be harvested. If set to a negative number, there's  no limit to the ammount of items harvested, while setting it to 0 shuts down harvesting.
- `Private token` : Private token to be used for authentication
- `Oauth2 token` : Oath2 token to be used for authentication

## Wiring

### Output Endpoints

-`Issue List` : A list with all the issues of the chosen Gitlab project.
-`Commit List` : A list with all the commits of the chosen Gitlab project.

## Usage

This operator needs to have configured the gitlab URL, project name, and the token of at least one of the available authentication methods (Private token or OAuth2).