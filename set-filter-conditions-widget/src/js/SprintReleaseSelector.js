/*
 * set-filter-conditions
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

    var to_js_range = function to_js_range(period_info) {
        return {
            type: 'range',
            attr: 'timestamp',
            start: period_info.range.start.valueOf(),
            end: period_info.range.end.valueOf()
        };
    };

    var to_milestone_range = function to_milestone_range(period_info) {
        return {
            type: 'in',
            attr: 'milestone',
            values: 'sprints' in period_info ? period_info.sprints.map(function (sprint) {return sprint.id;}) : [period_info.id]
        };
    };

    var SprintReleaseSelector = function SprintReleaseSelector() {
        var title;

        // Project section
        title = new StyledElements.Fragment('<h4>Project</h4>');
        title.insertInto(document.body);

        this.project_select = new StyledElements.Select({
            initialEntries: [
                {label: 'WireCloud', value: 'wirecloud-pip-develop-python2.7'}
            ]
        });
        this.project_select.insertInto(document.body);

        // Release/Sprint section
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

        // User section
        title = new StyledElements.Fragment('<h4>User</h4>');
        title.insertInto(document.body);

        this.user_select = new StyledElements.Select({
            initialEntries: [
                {label: 'All users', value: ''},
                {label: 'Álvaro Arranz (aarranz)', value: 'aarranz'},
                {label: 'Jaime Pajuelo (jpajuelo)', value: 'jpajuelo'},
            ]
        });
        this.user_select.addEventListener('change', this.sendEvents.bind(this));
        this.user_select.insertInto(document.body);

        // Update initial values
        this.RELEASES.forEach(this.buildSprintList, this);
        this.updateSprintSelect();

        // Resend filter configuration if the wiring status changes
        MashupPlatform.wiring.registerStatusCallback(this.sendEvents.bind(this));

    };

    SprintReleaseSelector.prototype.RELEASES = [
        {label: 'Release 4.4', id: '4.4', range: {start: moment('2015-07-01').startOf('month'), end: moment('2015-09-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.1', id: '5.1', range: {start: moment('2015-10-01').startOf('month'), end: moment('2015-12-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.2', id: '5.2', range: {start: moment('2016-01-01').startOf('month'), end: moment('2016-03-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.3', id: '5.3', range: {start: moment('2016-04-01').startOf('month'), end: moment('2016-06-01').endOf('month')}, toString: to_string_id},
        {label: 'Release 5.4', id: '5.4', range: {start: moment('2016-07-01').startOf('month'), end: moment('2016-09-01').endOf('month')}, toString: to_string_id}
    ];

    SprintReleaseSelector.prototype.buildSprintList = function buildSprintList(release) {
        var i, label;

        var current_moment = moment(release.range.start);
        release.sprints = [];
        for (i = 1; current_moment < release.range.end; i++) {
            label = current_moment.format("MMM YYYY");
            release.sprints.push({
                label: label,
                id: label,
                range: {
                    start: current_moment.clone().startOf('month'),
                    end: current_moment.clone().endOf('month')
                },
                toString: to_string_id
            });
            current_moment.add(1, 'month');
        }
    };

    SprintReleaseSelector.prototype.buildSprintOptions = function buildSprintOptions(release) {
        return release.sprints.map(function (sprint) {
            return {
                label: sprint.label,
                value: sprint
            };
        });
    };

    SprintReleaseSelector.prototype.updateSprintSelect = function updateSprintSelect() {
        var entries, i;
        var release = this.release_select.getValue();
        var old_sprint = this.sprint_select.getValue();

        if (release === '') {
            entries = [{label: 'All sprints', value: ''}];
            for (i = 0; i < this.RELEASES.length; i++) {
                entries = entries.concat(this.buildSprintOptions(this.RELEASES[i]));
            }
        } else {
            entries = [{label: 'All sprints of release ' + release.id, value: ''}];
            entries = entries.concat(this.buildSprintOptions(release));
        }

        this.sprint_select.clear();
        this.sprint_select.addEntries(entries);
        this.sprint_select.setValue(old_sprint);

        this.sendEvents();
    };

    SprintReleaseSelector.prototype.sendEvents = function sendEvents() {
        var sprint, release, user, period, build_filters, issues_filters;

        sprint = this.sprint_select.getValue();
        release = this.release_select.getValue();
        user = this.user_select.getValue();

        if (sprint !== '') {
            period = sprint;
        } else if (release !== '') {
            period = release;
        } else {
            period = '';
        }

        build_filters = [];
        if (period !== '') {
            build_filters.push(to_js_range(period));
        }
        if (user !== '') {
            build_filters.push({type: 'eq', attr: 'user', value: user});
        }
        MashupPlatform.wiring.pushEvent('build-filter-list', build_filters);

        issues_filters = period !== '' ? [to_milestone_range(period)] : [];
        if (user !== '') {
            issues_filters.push({type: 'eq', attr: 'assignee', value: user});
        }
        MashupPlatform.wiring.pushEvent('issue-filter', issues_filters);
    };

    return SprintReleaseSelector;

})();
