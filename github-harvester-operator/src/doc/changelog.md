## v0.3.5

- Add secure preferences
- Add REST queries error logs

## v0.3.4

Updated IssueTracker and webpage

## v0.3.3

- Added issue and commit query pagination, allowing to get more than 100 items.
- Added the `Max issues` preference that controls the ammount of issues harvested.
- Issues and commits are now ordered from oldest to newest so that in graphs latest issues are shown on the right.

## v0.3.2

- Added clossing commit to the harvested issues.
- Added sha property to the normalized commits.
- Added sha filter condition for the commits.

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
