## v0.3.1

- Added issue webpage link to the normalized issues.

## v0.3.0

- Fixed changelog format to the one expected by wirecloud.

## v0.2.5

- Issues now contain data about the previous milestones it had.
- Data is only harvested once. (For example, when you enter and leave the wiring view data won't be harvested again). To harvest data again, the page must be refreshed.
- Previously harvested data is pushed through the wiring as before, though.

## v0.2.4

- Added creation month data to normalized issues.
- Added creation month filter metadata.
- Added issue title to normalized issues.

## v0.2.3

- Added support for Basic authentication.
- Added username and password preferences to configure the Basic authentication.
- If Oauth2 token is also provided, the operator will use Oauth2.

## v0.2.2

- Normalized commits.
- Added month filter for commits.

## v0.2.1

- Added support for issue filtering by key.
- Added support for issue filtering by label.
- Normalized issues now have the issue key, the issue source (E.g: github) and the issue labels.

## v0.2.0

- Added preferences to change the target repository.
- Added generic metadata.
- Added filter settings metadata.
- Normalized issues.
- Harvest milestones and tries to use them as agile sprints.

## v0.1.8

- Harvest commits.
- Harvest issues.
