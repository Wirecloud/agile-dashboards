## v0.3.6

- Fix issue pagination repeating issues.
- Add secure preferences.

## v0.3.5

Updated IssueTracker and webpage

## v0.3.4

- Fixed Jira queries not adding their parameters.

## v0.3.3

- Fixed harvesting issues from other projects.
- Issues and commits are now ordered from oldest to newest so that in graphs latest issues are shown on the right.
- Added pagination.

## v0.3.2

- Added max preference to set the amount of issues to be harvested.
- Can now harvest without a set component (harvests any issues of the project).
- Added component filter.

## v0.3.1

- Added issue webpage link to the normalized issues.

## v0.3.0

- Fixed changelog format to the one expected by wirecloud.

## v0.2.3

- Changed type of the password preference to `"password"`.
- Removed unused Oauth2 preference.

## v0.2.2

- Added creation month data to normalized issues.
- Added creation month filter metadata.
- Added issue title to normalized issues.

## v0.2.1

- Added support for issue filtering by key.
- Added support for issue filtering by jira-type.
- Normalized issues now have the issue key, the issue source (E.g: jira) and the issue labels (empty for Jira issues).


## v0.2.0 

- Harvest issue data.
- Adds generic metadata.
- Normalizes issues
- Adds available filters metadata.
- Basic auth support.
