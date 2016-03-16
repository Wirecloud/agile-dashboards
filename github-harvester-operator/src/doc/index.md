## Introduction

The GitHub Harvester operator is a WireCloud operator that provides the ability to harvest issues and commits from Github.

## Settings

- `Repository owner username`: The Github username of the repository owner.
- `Repository name`: The name of the target repository.
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
