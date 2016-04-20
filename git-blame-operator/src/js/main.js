/*
 * git-blame
 *
 * Copyright (c) 2016 CoNWet
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var blameResult = [];

    var previousCommitId; //The sha of the latest commit

    var blameTable;
    var harvestsToDo = 0;


    var init = function init () {
        MashupPlatform.wiring.registerStatusCallback(pushInfo);

        MashupPlatform.wiring.registerCallback("commit", function (com) {
            //Only calculate the blame if its a new commit
            if (previousCommitId !== com.sha) {
                previousCommitId = com.sha;
                calculateBlame (com);
            }
        });
    };

    //Push data if available
    var pushInfo = function pushInfo () {
        if (blameTable) {
            MashupPlatform.wiring.pushEvent("blame-table", blameTable);
        }
    };

    var calculateBlame = function calculateBlame(com) {

        harvestsToDo = com.files.length;
        blameResult = [];
        com.files.forEach(function (file) {

            var mod = getDeletedLines(file.patch);
            //If there are no deletions on the file, skip it
            if (mod.length === 0) {
                return;
            }

            var url = com.parents[0].html_url.replace("commit", "blame");
            url = url + "/" + file.filename;

            harvestBlame(url, mod, file.filename);
        });
    };

    //Gets the lineNumber of the deleted lines
    var getDeletedLines = function getDeletedLines(str) {

        var modifiedLines = [];

        var base = str.split("@@");
        //Loop through each set of changes
        for (var i = 1; i < base.length; i+=2) {
            var hunk = base[i]; //Hunk format is " -firstLine,lineCount +firstLine,lineCount "
            var codeLines = base[i + 1].split("\n");

            var currentLine = parseInt(hunk.split(",")[0].substring(2), 10);

            //Look for any deleted line on the current set of changes
            for (var j = 1; j < codeLines.length; j++) {
                //If it starts with a -, its a deleted line (space for untouched and + for additions)
                if (codeLines[j][0] === "-") {
                    modifiedLines.push (currentLine);
                } else if (codeLines[j][0] === "+") {
                    currentLine--;
                }
                currentLine++;
            }
        }

        return modifiedLines;
    };

    //Harvest the github blame data from its website and build the blame result
    var harvestBlame = function harvestBlame (url, mod, file) {
        MashupPlatform.http.makeRequest(url, {
            method: 'GET',
            supportsAccessControl: false,
            onSuccess: function (response) {

                var blame = getBlameFromHTML (response.responseText);

                mod.forEach(function (lineNumber) {
                    blameResult.push ({author: blame[lineNumber], file: file, line: lineNumber});
                });
            },
            onComplete: function (response) {
                if (--harvestsToDo === 0) {
                    //Push the new data
                    createBlameTable();
                }
            }
        });
    };

    //Creates the data model for the output endpoint
    var createBlameTable = function createBlameTable () {

        //Issue table structure
        var structure = [
            {field: "author", label: "Author name", type: "string"},
            {field: "file", label: "File name", type: "string"},
            {field: "line", label: "Line", type: "number"}
        ];

        blameTable = {
            structure: structure,
            data: blameResult,
            id: "author",
        };

        MashupPlatform.wiring.pushEvent('blame-table', blameTable);
    };

    //Harvest the blame of a file scraping it from html
    var getBlameFromHTML = function getBlameFromHTML (html) {

        //This points to the table rows
        html = "<div>" + html.match("<table([^]*)</table>")[0] + "</div>"; // You betrayed me, jquery :C
        var table = $(html).children().children();

        //Pointer to the current row
        var punt = table.first();
        var author;

        var result = {};
        var currentLine = 1;
        //Go through all the rows
        while (punt.length > 0) {

            if (punt.hasClass("blame-commit")) {
                author = punt.find(".blame-commit-meta").find("span").html();
                if (!author) { //Sometimes its not in the span, but in a link
                    author = punt.find(".blame-commit-meta").find("a").html();
                }
            } else if (punt.hasClass("blame-line")) {
                //Gets the modified line
                //var line = punt.find(".blob-num").html();
                result[currentLine++] = author;
                //result[author].push(currentLine++);
            }
            //Next item
            punt = punt.next();
        }
        return result;
    };


    init();



})();
