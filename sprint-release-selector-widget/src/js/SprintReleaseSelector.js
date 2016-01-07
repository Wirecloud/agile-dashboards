/*
 * sprint-release-selector
 * https://repo.conwet.fi.upm.es/wirecloud/agile-dashboards
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

/* global moment, StyledElements */
/* exported SprintReleaseSelector */

var SprintReleaseSelector = (function () {

    "use strict";

    var to_string_id = function to_string_id() {
        return this.id;
    };

    var to_js_range = function to_js_range(range) {
        return {
            timerange: {
                start: range.start.valueOf(),
                end: range.end.valueOf()
            }
        };
    };

    var SprintReleaseSelector = function SprintReleaseSelector() {
        var title;

        moment.locale(MashupPlatform.context.get('language'));

        title = new StyledElements.Fragment('<h4>Project</h4>');
        title.insertInto(document.body);

        this.project_select = new StyledElements.Select({
            initialEntries: [
                {label: 'WireCloud', value: 'wirecloud-pip-develop-python2.7'}
            ]
        });
        this.project_select.insertInto(document.body);

        title = new StyledElements.Fragment('<h4>Release/Sprint</h4>');
        title.insertInto(document.body);

        this.release_select = new StyledElements.Select({
            initialEntries: [
                {label: 'All releases', value: ''},
            ].concat(this.RELEASES.map(function (release) {return {label: release.label, value: release};}))
        });
        this.release_select.insertInto(document.body);
        this.release_select.addEventListener('change', this.updateSprintSelect.bind(this));

        this.sprint_select = new StyledElements.Select();
        this.sprint_select.insertInto(document.body);
        this.sprint_select.addEventListener('change', this.sendEvents.bind(this));

        this.updateSprintSelect();
    };

    SprintReleaseSelector.prototype.RELEASES = [
        {label: 'Release 4.4', id: '4.4', range: {start: moment('2015-07-01').startOf('month'), end: moment('2015-09-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.1', id: '5.1', range: {start: moment('2015-10-01').startOf('month'), end: moment('2015-12-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.2', id: '5.2', range: {start: moment('2016-01-01').startOf('month'), end: moment('2016-03-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.3', id: '5.3', range: {start: moment('2016-04-01').startOf('month'), end: moment('2016-06-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.4', id: '5.4', range: {start: moment('2016-07-01').startOf('month'), end: moment('2016-09-01').endOf('month')}, toString: to_string_id}
    ];

    SprintReleaseSelector.prototype.buildSprintList = function buildSprintList(release) {
        var i, label, list = [];

        var current_moment = moment(release.range.start);
        for (i = 1; current_moment < release.range.end; i++) {
            label = current_moment.format("MMM YYYY");
            list.push({
                label: label,
                value: {label: label, id: release.id + '.' + i, range: {start: current_moment.clone().startOf('month'), end: current_moment.clone().endOf('month')}, toString: to_string_id}
            });
            current_moment.add(1, 'month');
        }

        return list;
    };

    SprintReleaseSelector.prototype.updateSprintSelect = function updateSprintSelect() {
        var entries, i;
        var release = this.release_select.getValue();
        var old_sprint = this.sprint_select.getValue();

        if (release === '') {
            entries = [{label: 'All sprints', value: ''}];
            for (i = 0; i < this.RELEASES.length; i++) {
                entries = entries.concat(this.buildSprintList(this.RELEASES[i]));
            }
        } else {
            entries = [{label: 'All sprints of release ' + release.id, value: ''}];
            entries = entries.concat(this.buildSprintList(release));
        }

        this.sprint_select.clear();
        this.sprint_select.addEntries(entries);
        this.sprint_select.setValue(old_sprint);

        this.sendEvents();
    };

    SprintReleaseSelector.prototype.sendEvents = function sendEvents() {
        var sprint = this.sprint_select.getValue();
        var release = this.release_select.getValue();

        if (sprint !== '') {
            MashupPlatform.wiring.pushEvent('build-filter-list', to_js_range(sprint.range));
        } else if (release !== '') {
            MashupPlatform.wiring.pushEvent('build-filter-list', to_js_range(release.range));
        } else {
            MashupPlatform.wiring.pushEvent('build-filter-list', '');
        }
    };

    return SprintReleaseSelector;

})();
