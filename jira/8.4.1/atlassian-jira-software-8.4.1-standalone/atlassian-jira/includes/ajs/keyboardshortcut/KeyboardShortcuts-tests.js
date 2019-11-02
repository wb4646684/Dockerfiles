AJS.test.require(["jira.webresources:key-commands"], function () {
    'use strict';

    var keyboardShortcuts = require('jira/ajs/keyboardshortcut/keyboard-shortcut');

    test("Loading KeyboardShortcuts resolves keyboardShortcutInit.init promise", function () {
        var isInit = false;

        keyboardShortcuts.initialised.then(function () {
            isInit = true;
        });

        equal(isInit, false, "KeyboardShortcuts init promise should not yet be resolved");

        keyboardShortcuts.fromJSON();

        equal(isInit, true, "KeyboardShortcuts init promise should be resolved");
    });
});