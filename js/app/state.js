var mil_edit = (function(my) {
  var globals   = my.globals;
  var focus     = my.focus;
  var tree      = my.tree;
  var interface = my.interface;
  var state = new Object();

  /* Dumping and Loading */
  state.dump_markdown = function() {
    var x = $("ul", globals.root_selector).clone()[0];
    $("#active", x).html($("#active textarea").val());
    return mil_markdown.markdownify(x);
  };
  state.load_markdown = function(markdownString) {
    var html = mil_markdown.htmlify(markdownString);
    $(globals.root_selector).html(html ? html : "<ul><li></li></ul>");
    focus.set($("li", globals.root_selector).last());
    interface.recurrent();
    return true;
  };
  state.dump_focus_state = function() { 
    if ($("#active textarea").length == 0) { return false; }
    var end_cursor_max = $("#active textarea").clone().val().length;
    var selection_start = $("#active textarea")[0].selectionStart;
    var selection_end = $("#active textarea")[0].selectionEnd;
    if (selection_start > end_cursor_max) { selection_start = end_cursor_max; }
    if (selection_end > end_cursor_max) { selection_end = end_cursor_max; }

    return [
      parseInt($("li", globals.root_selector).index("#active")),
      parseInt(selection_start),
      parseInt(selection_end),
      String($("#active textarea").clone().val())
    ];
  };
  state.load_focus_state = function(dumped_state) {
    focus.set($($("li", globals.root_selector)[dumped_state[0]]), true);
    $("#active textarea").val(dumped_state[3]);
    focus.position_cursor(dumped_state[1], dumped_state[2]);
    tree.fix_collapse_expand_buttons();
    return true;
  };
  state.dump_state = function() {
    tree.clean_tree();
    if ($("#active textarea").length == 0) { return false; }
    return [ 
      $(globals.root_selector).clone().html(), 
      $("#active textarea")[0].value,
      state.dump_focus_state()
    ];
  };
  state.load_state = function(h) {
    tree.clean_tree();
    $(globals.root_selector).html(h[0]);
    $("#active textarea").val(h[1]); 
    state.load_focus_state(h[2]);
    return true;
  };

  return _.extend(my, { state : state });
}(mil_edit || {}));
