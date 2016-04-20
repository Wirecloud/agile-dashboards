## Introduction

The Get issue closing commit operator is a WireCloud operator that provides the ability to get the commit that close an issue.

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
