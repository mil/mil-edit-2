var mil_edit = (function(my) {
  var globals   = my.globals;
  var util      = my.util; 
  var focus     = my.focus;
  var interface = my.interface;
  var state     = my.state;
  var tree      = my.tree;
  var history   = my.history;
  var user_actions = my.user_actions;

  var event_handlers = new Object();
  var drag_target = null;
  var old_state;

  event_handlers.drag = function(ev) { 
    if (drag_target) { return false; }
    var associated_parent, associated_nest;
    old_state = state.dump_state();

    // Set within the event_handlers scope
    drag_target = ev.target;

    tree.clean_tree();
    if ($("div.collapse-expand", ev.target).length) { // Dragging the associated_parent
      associated_nest = $(drag_target).next();
      associated_parent = $(ev.target);
    } else if ($($(ev.target).children()[0]).is("ul")) { // Dragging the actual list
      associated_nest = $(ev.target);
      associated_parent = $(associated_nest).prev();
    } else if (!$("li", ev.target).length) { // Just dragging a single list item
      associated_nest = null;
      associated_parent = $(drag_target);
    }

    $(associated_parent).wrap("<div id='wrapped'></div>");
    if (associated_nest != null) { $("#wrapped").append(associated_nest); }
    ev.dataTransfer.setDragImage($("#wrapped")[0],0,0);
    ev.dataTransfer.setData("text/html", null);

    return true;
  }
  event_handlers.drop = function(ev) {
    var mouse_top = ev.y + $(window).scrollTop();
    var closest = null;
     _.each($("#editor li"), function(e) {
       var x = $(e).offset().top;
       if (closest == null || Math.abs(x - mouse_top) < Math.abs(closest[0] - mouse_top)) {
         closest = [$(e).offset().top, $(e)];
       }
    });

    var source  = drag_target;
    var saved_state = old_state;
    var destination = closest[1];
    if (destination.has(".collapse-expand").length != 0) { 
      destination = $(destination.next().children()[0]).children().last();
    }

    try {
      history.do_action({
        undo : function() { return state.load_state(saved_state); },
        redo : function() {
          if ($(destination).next().length == 0) {
            $(destination).after($("#wrapped"));
          } else {
            $(destination).before($("#wrapped"));
          }
          $("#wrapped").children().unwrap();

          tree.clean_tree();
          focus.browser_focus_reset();
          interface.recurrent(); // need undo/redo icon
          drag_target = false;
          return true;
        }
      });
    } catch(err) { $("#wrapped").children().unwrap(); /* DOM Hierarchy Error */ return false; }

    return false;
  }


  event_handlers.simulate_key = function(k) {
    var textarea = $("#active textarea"); 
    // Simulate a Backspace
    if (typeof k == "object" && (k.keyCode == 46 || k.keyCode == 8)) { 
      var pos = textarea[0].selectionStart - 1;
      textarea.val(util.remove_at(
        textarea.val(), 
        textarea[0].selectionStart - 1, 
        textarea[0].selectionEnd - textarea[0].selectionStart
      ));
      focus.position_cursor(pos);
    } else {
      var to_insert = "";
      if (typeof k == "string") {
        to_insert = k;
      } else {
        k = k || window.event;
        var charCode = k.charCode || k.keyCode,
        to_insert = String.fromCharCode(charCode);
        to_insert = k.shiftKey ? to_insert.toUpperCase() : to_insert.toLowerCase();
      }
      textarea.val(util.insert_at(textarea.val(), textarea[0].selectionEnd, to_insert));
    }
    return true;
  }

  event_handlers.key_down = function(k) {
    if (!util.is_focused()) { if (!focus.browser_focus_reset()) { return true; } }

    // Convert k to mutable object with only properties needed
    if (util.type(k) == "[object KeyboardEvent]") {
      k = { keyCode : k.keyCode, shiftKey : k.shiftKey, ctrlKey : k.ctrlKey };
    }
    var bindings = [
      { key : { key_code  : 89, ctrl_key : true, shift_key : false  },  handler : user_actions.undo },
      { key : { key_code  : 90, ctrl_key : true, shift_key : false  },  handler : user_actions.redo },

      { key : { key_code  : 9,  ctrl_key  : false, shift_key : true },  handler : user_actions.indent_right }, // right tab
      { key : { key_code  : 37, ctrl_key  : false, shift_key : true },  handler : user_actions.indent_right }, // right ->

      { key : { key_code  : 9, ctrl_key : false, shift_key : false  },  handler : user_actions.indent_left }, // left tab
      { key : { key_code  : 39, ctrl_key : false, shift_key : true  },  handler : user_actions.indent_left }, // left <-

      { key : { key_code  : 69, ctrl_key : true, shift_key : false  },  handler : user_actions.fold }, // ctrl e

      { key : { key_code  : 46, ctrl_key : false, shift_key : false },  handler : user_actions.backspace },
      { key : { key_code  : 8, ctrl_key : false, shift_key : false  },  handler : user_actions.backspace },

      { key : { key_code : 38, ctrl_key : false, shift_key : false  },  handler : user_actions.focus_up }, // up key
      { key : { key_code : 38, ctrl_key : false, shift_key : true   },  handler : user_actions.shift_up },  // shift up

      { key : { key_code : 40, ctrl_key : false, shift_key : false  },  handler : user_actions.focus_down }, // down key
      { key : { key_code : 40, ctrl_key : false, shift_key : true   },  handler : user_actions.shift_down }, // shift down

      { key : { key_code : 13, ctrl_key : false, shift_key : false  },  handler : user_actions.enter }, // enter key

      { key : { key_code : 191, ctrl_key : true, shift_key : false  },  handler : user_actions.sidebar }, // ctrl ? (shift /)

      { key : { key_code : 73, ctrl_key : true, shift_key : false   },  handler : user_actions.italic }, // ctrl i
      { key : { key_code : 66, ctrl_key : true, shift_key : false   },  handler : user_actions.bold }, // ctrl b
      { key : { key_code : 37, ctrl_key : false, shift_key : false  },  handler : user_actions.left_arrow }, // <-
      { key : { key_code : 39, ctrl_key : false, shift_key : false  },  handler : user_actions.right_arrow }, // -> 

      //{ key_code : 89, ctrl_key : true, shift_key : false } : handlers[link], // ctrl u
      { key : { key_code : 88, ctrl_key : true, shift_key : true    }, handler : user_actions.clear }//ctrl x
    ];

    var passthrough_keys = _.union(61, 173, _.range(48,58), _.range(65, 91), 32, _.range(186,193), _.range(219, 223));

    // Check to see if we fill any of the bindings
    var binding_return = -1;
    _.each(bindings, function(b) {
      if (b.key.key_code == k.keyCode && b.key.ctrl_key == k.ctrlKey && b.key.shift_key == k.shiftKey) {
        binding_return = b.handler(); // will set binding return to true or false
        return;
      }
    }); 
    if (binding_return != -1) { 
      return binding_return; 
    } else if (_.contains(passthrough_keys, k.keyCode)) {
      if (k.ctrlKey) { return true; } // Dont add C-V and C-C to history handled by custom events
      history.add_action({
        undo: function() { return event_handlers.simulate_key({ keyCode : 46 }); },
        redo: function() { return event_handlers.simulate_key(k); }
      });
      return true;
    } else {
      return false;
    }
  };

  event_handlers.key_up = function(e) { 
    if (!util.is_focused()) { return true; }
    focus.adjust_rows(); 
    interface.ensure_input_in_view(); 
    tree.fix_collapse_expand_buttons();
    interface.recurrent(); 
    focus.browser_focus_reset(true);
  };

  event_handlers.mouse_down = function(e) {  // records for undo events on click / dbl click 
    //if (!util.is_focused()) { return true; }
    if (!globals.clicking) { mouse_down_focus_state = state.dump_focus_state(); }
    if (e.detail == 1) { return true; }
    if ($(e.target).is("textarea")) { return globals.clicking; }
  };
  event_handlers.mouse_up = function(e) { 
    //if (!util.is_focused()) { return true; }
    var t = $(e.target);
    if (t.is("a")) { return false; } // click link
    if (t.is("textarea")) { return true; } 

    var the_li = this, old_state = state.dump_state();
    if (t.is(".collapse-expand")) { 
      history.do_action({
        undo : function() { state.load_state(old_state); return true; },
        redo : function() { interface.toggle_expand_collapse(the_li); return true; }
      });
      interface.recurrent();
      return false; 
    }
    if (!t.length) { return false; }
    if (!util.is_editable(t)) {
      if (util.is_editable(t.parent())) { 
        t = t.parent(); 
      } else {
        while (!util.is_editable(t)) { 
          if (!t.children().length) { break; }
          t = t.children().first(); 
        }
      }
    }

    var focus_state = state.dump_focus_state();
    history.do_action({
      undo : function() { return state.load_focus_state(focus_state); },
      redo : function() { return focus.set(t, true); }
    })
    interface.recurrent(); 

    return true;
  };

  event_handlers.click_textarea = function(e) {
    if (!util.is_focused()) { return true; }
    globals.clicking = true;

    var current_focus_state = state.dump_focus_state();
    var old_focus_state     = mouse_down_focus_state;
    history.add_action({
      undo : function() { return state.load_focus_state(old_focus_state); },
      redo : function() { return state.load_focus_state(current_focus_state); }
    });
    if (e.detail == 3) { 
      globals.clicking = false; 
      clearTimeout(globals.clicking_falsify_callback);
    } else {
      globals.clicking_falsify_callback = setTimeout(
        function() { globals.clicking = false; }, 
        300 
      );
    }
    interface.recurrent();
    return false;
  };

  event_handlers.cut = function(e)  { if (!util.is_focused()) { return true; } };
  event_handlers.copy = function(e) { if (!util.is_focused()) { return true; } };
  event_handlers.paste = function(e) { 
    if (!util.is_focused()) { return true; }
    var old_state = state.dump_state();
    history.add_action({
      undo : function() { return load_state(old_state); },
      redo : function() { }
    });
  }
  event_handlers.font_size_change = function(e) {
    interface.set_size(parseInt($("#size input").val()));
  }
  //event_handlers.timed_interval = function(e) { }

  event_handlers.install = function() {
    $(document).on('keydown', event_handlers.key_down);
    $(document).on('keyup', event_handlers.key_up );
    $(document).on('mousedown', "li", event_handlers.mouse_down);
    $(document).on('mouseup', "li", event_handlers.mouse_up);
    $(document).on('click', "textarea", event_handlers.click_textarea);
    $(document).on('cut', "textarea", event_handlers.cut);
    $(document).on('copy', "textarea", event_handlers.copy);
    $(document).on('paste', "textarea", event_handlers.paste);
    $(document).on('scroll', event_handlers.scroll);
    $("#size input").on('change', event_handlers.font_size_change);
    //setInterval(event_handlers.timed_interval, 500);
  }

  event_handlers.uninstall = function() {
    $(document).off('keydown', event_handlers.key_down);
    $(document).off('keyup', event_handlers.key_up );
    $(document).off('mousedown', "li", event_handlers.mouse_down);
    $(document).off('mouseup', "li", event_handlers.mouse_up);
    $(document).off('click', "textarea", event_handlers.click_textarea);
    $(document).off('cut', "textarea", event_handlers.cut);
    $(document).off('copy', "textarea", event_handlers.copy);
    $(document).off('paste', "textarea", event_handlers.paste);
  }

  return _.extend(my, { event_handlers : event_handlers });
}(mil_edit || {})); 
