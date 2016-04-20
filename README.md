# List of available resources for Agile-Mashup (widgets and operators)

## Harvesters (Harvest phase)

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

* [And-filter-operator](./and-filter-operator)

### List Operators

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

* [Build-splitter-operator](./build-splitter-operator)
* [Changes-splitter-operator](./changes-splitter-operator)
* [Issue-splitter-operator](./issue-splitter-operator)
* [Test-Report-splitter-operator](./test-report-splitter-operator)

## Datamodel Adapter (Visualization Preparation phase)

### Generic

* [Burndown-chart-generator-operator](./burndown-chart-generator-operator)
* [Burndownchart-click-operator](./burndownchart-click-operator)
* [Column-chart-generator-operator](./column-chart-generator-operator)
* [Pie-chart-generator-operator](./pie-chart-generator-operator)
* [Trend-chart-generator-operator](./trend-chart-generator-operator)

### Domain-dependent

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
* [Set-generic-filter-conditions-widget](./set-generic-filter-conditions-widget)

## Old stuff (deprecated)

* [jenkins-project-build-list-widget](./jenkins-project-build-list-widget) (try jenkins-project-build-list-operator)
* [set-filter-conditions-widget](./set-filter-conditions-widget) (try set-generic-filter-conditions-widget)