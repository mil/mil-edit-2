var key_codes = [
  ["Shift Tab", { shiftKey : true, keyCode : 9 }],
  ["Shift <-", { shiftKey : true, keyCode : 37 }],
  ["Tab", { keyCode : 9 }],
  ["Shift ->", { shiftKey : true, keyCode : 39 }],
  ["Ctrl E", { ctrlKey: true, keyCode : 69 }],

  ["Shift Up", { shiftKey : true, keyCode : 38 }],
  ["Shift Down", { shiftKey : true, keyCode : 40 }],
  ["Enter", { keyCode : 40 }],
  ["Ctrl Shift /", { ctrlKey: true, shiftKey : true, keyCode : 191}],
  ["Ctrl I", { ctrlKey: true, keyCode : 73 }],
  ["Ctrl B", { ctrlKey: true, keyCode : 66 }],
  ["Ctrl X", { ctrlKey: true, keyCode : 88 }],

  ["Down", { keyCode : 40 }],
  ["Up", { keyCode : 38 }]

  //["Backspace", { keyCode : 46 }],
  //["Alternative Backspace ", { keyCode : 8 }],
  //["<-", { keyCode : 37 }],
  //["->", { keyCode : 39 }]
];

describe("History Module", function() {
  // setup and teardown
  beforeEach(function() {
    $("body").append("<div id='editor'></div>");
    mil_edit.initialize();
  });
  afterEach(function() {
    mil_edit.disable();
    $("#editor").remove();
  });

  describe("Keyboard Action", function() {
    beforeEach(function() {
      mil_edit.load_markdown("- one\n- second line\n- three\n  * an indent\n  * another item\n- back to ground");
    });


    // Testing Individual Keycode Actions
    _.each(key_codes, function(i) {
      it(i[0] + " is Undo-able", function() {
        var old_state = mil_state(); 
        mil_edit.fake_key_down(i[1]); 
        mil_edit.fake_key_up(i[1]);
        mil_edit.undo(); 
        var new_state = mil_state();
        expect(mil_comparison(old_state, new_state)).toBeTruthy();
      });

      it(i[0] + " is Redo-able", function() {
        mil_edit.fake_key_down({ keyCode : i[1] });
        mil_edit.fake_key_up({ keyCode : i[1] });
        var old_state = mil_state();
        //if (i[0] == "Tab") { o = old_state; }
        if (i[0] == "Shift ->") { o = old_state; }
        mil_edit.undo();
        mil_edit.redo();
        var new_state = mil_state();
        if (i[0] == "Shift ->") { n = new_state; }
        expect(mil_comparison(old_state, new_state)).toBeTruthy();
      });
    });

    it("A Random Sequence is Un-doable", function() {
      var still_works = true;
      _.times(100, function() {
        var random_key = key_codes[Math.floor(Math.random() * key_codes.length)];
        var old_state = mil_state(); 
        mil_edit.fake_key_down(random_key); 
        mil_edit.fake_key_up(random_key); 
        var new_state = mil_state();

        mil_edit.undo();
        if (mil_state() != old_state) { still_works = false; }
        mil_edit.redo();
        if (mil_state() != new_state) { still_works = false; }
      });
      expect(still_works).toBe(true);
    });

  });

});
