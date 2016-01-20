/* global StyledElements */
/* exported JenkinsProjectBuildList */

var JenkinsProjectBuildList = (function () {

    "use strict";

    var JenkinsProjectBuildList = function JenkinsProjectBuildList () {

        /* Context */
        MashupPlatform.widget.context.registerCallback(function (newValues) {
            if (this.layout && ("heightInPixels" in newValues || "widthInPixels" in newValues)) {
                this.layout.repaint();
            }
        }.bind(this));

        MashupPlatform.wiring.registerCallback("build-list", function (data) {
            if (!Array.isArray(data) || !data.every(is_build)) {
                throw new MashupPlatform.wiring.EndpointTypeError('Expecting a build list');
            }

            this.table.source.changeElements(data);
            this.layout.getCenterContainer().enable();
        }.bind(this));

        this.layout = null;
        this.table = null;
    };

    JenkinsProjectBuildList.prototype.init = function init() {
        this.layout = new StyledElements.BorderLayout();
        createTable.call(this);

        this.layout.getCenterContainer().addClassName('loading');
        this.layout.insertInto(document.body);
        this.layout.repaint();

        this.layout.getCenterContainer().disable();
    };

    var is_build = function is_build(build) {
        return typeof build === 'object' && 'id' in build && 'duration' in build;
    };

    var onRowClick = function onRowClick(row) {
        if (this.selection.length > 0 && this.selection[0] === row.id) {
            this.select();
            MashupPlatform.wiring.pushEvent('condition-list', []);
        } else {
            this.select(row.id);
            MashupPlatform.wiring.pushEvent('condition-list', [{type: 'eq', attr: 'id', value: row.id}]);
        }
    };

    var createTable = function createTable() {
        // Create the table
        var fields = [
            {field: 'result', label: '', sortable: true},
            {field: 'id', label: 'Id', sortable: true},
            {field: 'timestamp', label: 'Date', type: 'date', sortable: true}
        ];

        this.table = new StyledElements.ModelTable(fields, {
            id: 'id',
            pageSize: 0,
            'class': 'table-striped',
            initialSortColumn: 'id',
            initialDescendingOrder: true,
            stateFunc: function (entry) {
                switch (entry.result) {
                case "SUCCESS":
                    return "success";
                case "FAILURE":
                    return "danger";
                }
            }
        });
        this.table.addEventListener("click", onRowClick);
        this.table.reload();
        this.layout.center.clear();
        this.layout.center.appendChild(this.table);
    };

    return JenkinsProjectBuildList;

})();
