var mil_edit = (function(my) {
  var user_actions = my.user_actions;

  var keybindings = [
    { key : { key_code  : 89, ctrl_key : true, shift_key : false  },  handler : user_actions.redo },
    { key : { key_code  : 90, ctrl_key : true, shift_key : false  },  handler : user_actions.undo },

    { key : { key_code  : 9,  ctrl_key  : false, shift_key : true },  handler : user_actions.undent }, // right tab
    { key : { key_code  : 37, ctrl_key  : false, shift_key : true },  handler : user_actions.undent }, // right ->

    { key : { key_code  : 9, ctrl_key : false, shift_key : false  },  handler : user_actions.indent }, // left tab
    { key : { key_code  : 39, ctrl_key : false, shift_key : true  },  handler : user_actions.indent }, // left <-

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

  return _.extend(my, { keybindings : keybindings });
}(mil_edit || {}));
