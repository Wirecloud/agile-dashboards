## Introduction

The Gitlab Harvester Operator provides a list with all the issues and a list with all the commits of a Gitlab project.

## Settings

- `Gitlab URL` : URL to the gitlab server. (https://your.gitlab.server.com)
- `Gitlab project name` : Name of the gitlab project.
- `Private token` : Private token to be used for authentication
- `Oauth2 token` : Oath2 token to be used for authentication

## Wiring

### Output Endpoints

-`Issue List` : A list with all the issues of the chosen Gitlab project.
-`Commit List` : A list with all the commits of the chosen Gitlab project.

## Usage

This operator needs to have configured the gitlab URL, and project name and the token of at least one of the available authentication methods (Private token or OAuth2).

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)