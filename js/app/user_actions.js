var mil_edit = (function(my) {
  var globals        = my.globals;
  var util           = my.util; 
  var focus          = my.focus;
  var interface      = my.interface;
  var state          = my.state;
  var tree           = my.tree;
  var history        = my.history;

  var user_actions = new Object();

  user_actions.redo = function() { 
    history.redo(); 
    return false; 
  };
  user_actions.undo = function() { 
    history.undo(); 
    return false; 
  };
  user_actions.undent = function() {
    var restore_position = util.brother_elements_to_end($("#active"));
    history.do_action({undo: function() { return focus.indent(restore_position); }, redo: focus.undent});
    return false;
  };
  user_actions.indent = function() {
    history.do_action({undo: focus.undent, redo: focus.indent});
    focus.browser_focus_reset(true);
    return false;
  };
  user_actions.fold = function() {
    var old_state = state.dump_focus_state();
    history.do_action({ 
      undo : function() { 
        if (interface.toggle_expand_collapse_current_position()) {
          state.load_focus_state(old_state);
          return true;
        } else { return false; }
      },
      redo : function() { return interface.toggle_expand_collapse_current_position(); }
    });

    return false;
  };
  user_actions.backspace = function() {      
    if ($("#active").children("textarea").val() == "") { 
      // we're all emptied out
      if ($(globals.root_selector).children().children().size() == 0) { return; }
      if ($("#active").parent().parent().is("div")) {
        var old_state = state.dump_state();
        history.do_action({ 
          undo : function() { state.load_state(old_state); },  //TODO inefficient
          redo : tree.delete_above 
        });
      } else {
        var restore_position = util.brother_elements_to_end($("#active"));
        history.do_action({undo: function() { return focus.indent(restore_position); }, redo: focus.undent});
      }
      return false; 
    } else {
      var focus_state = state.dump_state();
      history.do_action({
        undo : function() { return state.load_state(focus_state); },
        redo : function() { return my.event_handlers.simulate_key({ keyCode : 46 }); }
      });
      return true;
    }
  };

  user_actions.focus_up = function() {
    history.do_action({
      undo : function()  { return focus.set_delta(1); }, 
      redo : function() { return focus.set_delta(-1); }
    });
    return false;
  };
  user_actions.focus_down = function() {
    history.do_action({
      undo : function()  { return focus.set_delta(-1); }, 
      redo : function() { return focus.set_delta(1); }
    });
    return false;
  };
  user_actions.shift_up = function() {
    history.do_action({
      undo: function()  { return focus.shift(1);  },
      redo : function() { return focus.shift(-1); }
    });
    return false;
  };
  user_actions.shift_down = function() {
    history.do_action({
      undo : function()  { return focus.shift(-1);  },
      redo : function() { return focus.shift(1); }
    });
    return false;
  };
  user_actions.enter = function() {
    if ($($("#active").next().children()[0]).is("ul")) { // no action!
      // create a new brother under the nest
      var created_brother = null;
      var collapsed_nest = null;
      var focus_state = state.dump_focus_state();
      history.do_action({
        undo : function() {
          interface.expand_nest(collapsed_nest);
          $(created_brother).remove();
          return state.load_focus_state(focus_state);
        },
        redo : function() {
          collapsed_nest = $("#active").next();
          interface.collapse_nest(collapsed_nest);
          created_brother = tree.new_brother($("#active").next())
          return focus.set(created_brother);
        }
      });
    } else if ($("#active textarea").val() == "") { 
      history.do_action({undo : focus.undent, redo : focus.indent}); 
    } else  {
      var focus_state = state.dump_focus_state();
      history.do_action({
        undo : function() { 
          tree.delete_above(); 
          return state.load_focus_state(focus_state); 
        },
        redo : function() { 
          tree.insert_below(); 
          tree.clean_tree(); 
          return true; 
        }
      });
    }
    return false;
  };
  user_actions.sidebar = function() {
    //history.do_action(interface.toggle_sidebar);
    interface.toggle_sidebar();
    return false;
  };
  user_actions.bold = function() {
    var focus_state = state.dump_focus_state();
    history.do_action({
      undo : function() { return state.load_focus_state(focus_state); },
      redo : function() { interface.bold(); return true; }
    });
    return false;
  };
  user_actions.italic = function() {
    var focus_state = state.dump_focus_state();
    history.do_action({
      undo : function() { return state.load_focus_state(focus_state); },
      redo : function() { interface.italic(); return true; }
    });
    return false;
  };
  user_actions.link = function() {
    var focus_state = state.dump_focus_state();
    history.do_action({
      undo : function() { return state.load_focus_state(focus_state); },
      redo : function() { interface.link(); return true; }
    });
    return false;
  };
  user_actions.clear = function() {
    var old_state = state.dump_state();
    history.do_action({
      undo : function() { return state.load_state(old_state); },
      redo : tree.clear
    });
    return false;
  };
  user_actions.right_arrow = function() {
    history.add_action({
      undo : function() { return focus.position_cursor_delta(-1);},
      redo : function() { return focus.position_cursor_delta(1); }
    });
    return true;
  };
  user_actions.left_arrow = function() {
    history.add_action({
      undo : function() { return focus.position_cursor_delta(1);  },
      redo : function() { return focus.position_cursor_delta(-1); }
    });
    return true;
  };

  // Buttons updated on each user action
  // Don't need to account for keybindings/ui buttons seperatly
  _.each(user_actions, function(old_callback,fn) {
    user_actions[fn] = function() {
      old_callback();
      interface.sync_ui_buttons();
    };
  });

  return _.extend(my, { user_actions : user_actions });
}(mil_edit || {})); 
