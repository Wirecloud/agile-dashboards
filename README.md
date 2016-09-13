This set of Wirecloud components allow the creation and visualization of agile dashboards where you can easily check the progress and status of agile projects using charts and tables to plot the data.

Currently Github, Gitlab, Jira and Jenkins are supported.

Example dashboard to check Wirecloud's development on Github: [Wirecloud example](https://wirecloud.conwet.fi.upm.es/alex.rodriguez/Example#view=workspace)

# List of available resources for Agile-Mashup (widgets and operators)

## Harvesters (Harvest phase)

This operators harvest data from the online tools, such as Github.

* [Get-coverage-report-coveralls-operator](./get-coverage-report-coveralls-operator)
* [Get-coverage-report-jenkins-operator](./get-coverage-report-jenkins-operator)
* [Get-file-coverage-coveralls-operator](./get-file-coverage-coveralls-operator)
* [Get-file-coverage-jenkins-operator](./get-file-coverage-jenkins-operator)
* [Github-harvester-operator](./github-harvester-operator)
* [Gitlab-harvester-operator](./gitlab-harvester-operator)
* [Jenkins-harvester-operator](./jenkins-harvester-operator)
* [Jenkins-project-build-list-operator](./jenkins-project-build-list-widget)
* [Jira-harvester-operator](./jira-harvester-operator)

## Data operators (Data Transformation phase)

### Filters

These components are used to filter the data obtained through the harvesters.

* [And-filter-operator](./and-filter-operator)
* [Set-generic-filter-conditions-widget](./set-generic-filter-conditions-widget)

### List Operators

These operators perform basic operations on a list.

* [Basic-list-math-operator](./BasicListMathOperator)
* [Intersect-list-operator](./intersect-list-operator)
* [Packlist-operator](./packlist-operator)
* [RemoveDuplicates-list-operator](./removeDuplicates-list-operator)
* [SetDifference-list-operator](./setDifference-list-operator)
* [Union-list-operator](./union-list-operator)

### Statisticals

* [Calculate-tendency-operator](./calculate-tendency-operator)
* [Labels-to-dataserie-operator](./labels-to-dataserie-operator)

### Splitters

These operators are used to get detailed properties of the harvested data.

* [Build-splitter-operator](./build-splitter-operator)
* [Changes-splitter-operator](./changes-splitter-operator)
* [Issue-splitter-operator](./issue-splitter-operator)
* [Test-Report-splitter-operator](./test-report-splitter-operator)

## Datamodel Adapter (Visualization Preparation phase)

This widgets are used to plot charts and tables with the data calculated by the previous components.

### Generic

* [Column-chart-generator-operator](./column-chart-generator-operator)
* [Pie-chart-generator-operator](./pie-chart-generator-operator)
* [Trend-chart-generator-operator](./trend-chart-generator-operator)

### Domain-dependent

* [Burndown-chart-generator-operator](./burndown-chart-generator-operator)
* [File-Coverage-chart-generator-operator](./file-coverage-chart-generator-operator)
* [Issue-table-generator-operator](./issue-table-generator-operator)
* [Detailed-jenkins-test-data-operator](./detailed-jenkins-test-data-operator)
* [Jenkins-test-time-difference-table-operator](./jenkins-test-time-difference-table-operator)
* [Reliability-chart-generator-operator](./reliability-chart-generator-operator)
* [Workload-chart-generator-operator](./workload-chart-generator-operator)
* [Product-backlog-chart-operator](./product-backlog-chart-operator)
* [Open-item-webpage-operator](./open-item-webpage-operator)
* [Get-closing-commit-operator](./get-closing-commit-operator) (Only works with github harvester)
* [Git-blame-operator](./git-blame-operator) (Only works with gituhb harvester)

## Widgets (both viewers and forms)

* [Data-table-viewer-widget](https://github.com/Wirecloud/data-table-viewer-widget)
* [HighCharts-widget](https://github.com/Wirecloud/highcharts-widget)