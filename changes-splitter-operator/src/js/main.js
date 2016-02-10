/*
 * changes-splitter
 *
 * Copyright (c) 2015 CoNWeT
 * Licensed under the Apache2 license.
 */

(function () {

    "use strict";

    MashupPlatform.wiring.registerCallback("changes-list", function (changes_list) {
        var commit_id_list = [];
        var author_list = [];
        var comment_list = [];
        var files = [];

        changes_list.forEach(function (changes) {
            commit_id_list.push(changes.map(function (change) {return change.commitId;}));
            author_list.push(changes.map(function (change) {return change.author.fullName;}));
            comment_list.push(changes.map(function (change) {return change.author.comment;}));
            files.push(changes.map(function (change) {return change.paths.map(function (path) {return path.file;});}));
        });

        //Adds metadata
        commit_id_list.metadata = {type: "text", tag: "Commit", verbose: "Commit ID"};
        author_list.metadata = {type: "text", tag: "Author", verbose: "Author name"};
        comment_list.metadata = {type: "text", tag: "Comment"};
        files.metadata = {type: "text", tag: "Files", verbose: "Path to files"};

        MashupPlatform.wiring.pushEvent("commit-id-list", commit_id_list);
        MashupPlatform.wiring.pushEvent("author-list", author_list);
        MashupPlatform.wiring.pushEvent("comment-list", comment_list);
        MashupPlatform.wiring.pushEvent("affected-file-matrix", files);
    });

    /* test-code */

    /* end-test-code */

})();
