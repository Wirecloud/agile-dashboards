## v0.3.3

Updated IssueTracker and webpage

## v0.3.2

- Added query pagination, allowing to get more than 100 items.
- Added the `Max issues` preference that controls the ammount of issues harvested.
- Issues and commits are now ordered from oldest to newest so that in graphs latest issues are shown on the right.

## v0.3.1

- Added issue webpage link to the normalized issues.

## v0.3.0

- Fixed changelog format to the one expected by wirecloud.

## v0.2.3

- Added creation month data to normalized issues.
- Added creation month filter metadata.
- Added issue title to normalized issues.

## v0.2.2

- Normalized commits.
- Added month filter for commits.

## v0.2.1

- Added support for issue filtering by key.
- Added support for issue filtering by label.
- Normalized issues now have the issue key, the issue source (E.g: gitlab) and the issue labels.

## v0.2.0

- Harvests Gitlab issues.
- Harvests Gitlab commits.
- Can authenticate with OAuth2 or with a private token.
- Adds generic metadata.
- Adds available filters metadata.
