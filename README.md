Miledit 2
=========
Miledit 2 is a list editor in JS featuring basic text styling (bold, italics, links) but stripped of extraneous features of WYSIWYG. It's a list editor not a text editor. Resultingly, its lightweight minimalistic interface.  It imports and exports data as a single markdown list file.

[Demo Link](http://userbound.com/ui/mil-edit-2)

Miledit 2 is heavily adapted and inspired by my former, [mil edit](). The UI code is split into 9 modules and 1's Markdown libraries were as dependencies in favor of regex-based [mil_markdown](). As far as the user-side goes, a history stack is maintained of callback functions for stepping through state.  As far as user functionality goes, the major new features are:
- Foldable Sections
- Drag and Drop
- Undo / Redo

Dependencies
------------
[ZeptoJS](http://zeptojs.com)
[\_.js](http://underscorejs.org)

Tests
-----
Unit tests are in Jasmine, and a work in progress. Definitely not production software yet, but it is close.  I'm open any contributions, to get this to production quality quicker (see below).


TODO
----
- Bugs
    * Undo/Redo stack not entirely consistent
    * mil_markdown bold within bold/italic within italic cancels out
- Clean up CSS
- Make Credits File
- New (Full) Key bindings Documentation
- Should there be JS to trigger CSS themes, or is should this be developer/user implemented?
- Allow Copy and Paste
- Integrate Copy Paste with Undo/Redo stack
- Finish writing unit tests
- Buttons and Keybindings for collapse and expand all
