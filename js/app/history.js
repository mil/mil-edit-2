var mil_edit = (function(my) {
  var history = new Object();
  history.stack_limit = 200;
  history.undo_stack = [], history.redo_stack = [];

  history.push_to_stack = function(stack, action) {
    stack.push(action);
    if (stack.length > history.stack_limit) { stack.shift(); }
  }

  history.add_action = function(action) { 
    if (typeof action == "function") { var a = action; action = { undo: a, redo : a}; }
    history.push_to_stack(history.undo_stack, action);
    history.redo_stack = [];
  }
  history.do_action = function(action) {
    if (typeof action == "function") { var a = action; action = { undo: a, redo : a}; }
    history.push_to_stack(history.redo_stack, action);
    history.redo();
  }
  history.undo = function() { 
    var command = history.undo_stack.pop(); 
    if (command && command.undo()) { 
      history.push_to_stack(history.redo_stack, command);
    }
  };
  history.redo = function() {
    var command = history.redo_stack.pop();
    if (command && command.redo()) { 
      history.push_to_stack(history.undo_stack, command);
    }
  }

  return _.extend(my, { history : history });
}(mil_edit || {}));
