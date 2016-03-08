## Introduction

The GitHub Harvester operator is a WireCloud operator that provides the ability to harvest issues and commits from Github.

## Settings

- `Username`: The Github username of the repository owner.
- `Repository name`: The name of the target repository.
- `OAuth2 token`: The token to authenticate on the Github repository.

## Wiring

### Output Endpoints

- `Issue List`: List of the Github issues and the available milestones. (Milestones are considered agile sprints if possible).
- `Commit List`: List of the Github commits.

## Usage

Configure the needed settings and connect the issue / commit list to the desired operator/widget.

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)
