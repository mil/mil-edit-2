var mil_edit = (function(my) {
  var history = my.history;
  var state = my.state;
  var focus = my.focus;
  var tree = my.tree;
  var interface = my.interface;
  var event_handlers = my.event_handlers;
  var user_actions = my.user_actions;

  function load_template() { $(my.globals.root).html(editor_template); }
  function initialize(r) {
    if (my.globals.initialized) { return false; }
    if (r != undefined) { my.globals.root = r; }
    load_template();
    event_handlers.install();
    $(my.globals.root_selector).html($("<ul>").append(my.globals.li_tag));
    my.focus.set($("li", my.globals.root_selector).first());
    return my.globals.initialized =  true;
  }

  // Mil Edit Publicly Returned Object
  return {
    history : history,

    set_cutoff_height : function(pixels) { my.globals.cutoff_height = pixels; },
    undo : user_actions.undo,
    redo : user_actions.redo,

    drag : event_handlers.drag,
    drop : event_handlers.drop,

    set_size : interface.set_size,
    collapse_all : interface.collapse_all,
    expand_all: interface.expand_all,

    bold : user_actions.bold, 
    italic : user_actions.italic,
    link : user_actions.link,

    initialize : initialize,
    disable : function() {
      event_handlers.uninstall();
      my.globals.initialized =  false;
    },

    simulate_key : event_handlers.simulate_key,
    fake_key_down: event_handlers.key_down,
    fake_key_up: event_handlers.key_up,
    insert_below: tree.insert_below,

    dump_state: state.dump_state,
    dump_focus_state : state.dump_focus_state,
    load_state: state.load_state,

    // line manipulation
    indent : user_actions.indent,
    undent : user_actions.undent,

    // keybindings/help menu
    keybindings : user_actions.sidebar,

    // load and dump markdown
    dump_markdown : state.dump_markdown,
    load_markdown : state.load_markdown,

    clear : user_actions.clear
  };
}(mil_edit || {}));
