var mil_edit = (function(my) {
  // Dependency Imported from mil_edit scope
  var history = my.history;
  var tree    = my.tree;
  var util    = my.util;
  var focus   = my.focus;
  var globals = my.globals;
  var event_handlers = my.event_handlers;
  var interface = new Object();

  interface.sync_ui_buttons = function() {
    util.set_class($("#bold"), "active", focus.is_in_bold());
    util.set_class($("#italic"), "active", focus.is_in_italic());
    util.set_class($("#undo"), "hidden", !history.undo_stack.length);
    util.set_class($("#redo"), "hidden", !history.redo_stack.length);
    util.set_class($("#undo_separator"), "hidden", !(history.redo_stack.length || history.undo_stack.length));
  };

  interface.recurrent = function() {
    tree.clean_tree();
    interface.sync_ui_buttons();

    tree.fix_collapse_expand_buttons();
    interface.ensure_input_in_view();
    //focus.browser_focus_reset();
  };

  interface.collapse_all = function() {
    _.each($(".collapse-expand"), function(c) {
      var associated_li_parent = $(c).parent().next();
      if (!associated_li_parent.hasClass("collapsed")) {
        tree.collapse($(c));
      }
    });
  }
  interface.expand_all = function() {
    _.each($(".collapse-expand"), function(c) {
      var associated_li_parent = $(c).parent().next();
      if (associated_li_parent.hasClass("collapsed")) {
        tree.expand($(c));
      }
    });
  }


  interface.toggle_expand_collapse_current_position = function() {
    var collapse_expand_selector;
    return interface.toggle_expand_collapse(
      $("#active").children(".collapse-expand").length > 0 ?
        $("#active")[0] :
        $("#active").parent().parent().prev()
    );
  };

  interface.toggle_expand_collapse = function(associated_parent_dom) { 
    if (globals.is_animating) { return false; }

    var associated_nest = $(associated_parent_dom).next();
    var new_focus = $("#active", associated_nest).length ? $(associated_parent_dom) : null;

    setTimeout(function() { globals.is_animating = false; }, 200);
    if ($(associated_nest).hasClass("collapsed")) {
      interface.expand_nest(associated_nest) 
    } else {
      interface.collapse_nest(associated_nest); 
    }

    if (new_focus) { focus.set(new_focus); }
    return true;
  };

  interface.expand_nest = function(nest_dom) {
    globals.is_animating = true;
    $(nest_dom).removeClass("collapsed").animate(
      { opacity : 1 }, { duration: 200, complete : function() { globals.is_animating = false; } }
    );
  };
  interface.collapse_nest = function(nest_dom) {
    globals.is_animating = true;
    $(nest_dom).animate({ opacity: 0 }, { duration : 200,
      complete : function() { 
        $(nest_dom).addClass("collapsed"); 
        tree.fix_collapse_expand_buttons();
        globals.is_animating = false;
      }
    });
  };

  interface.set_size = function(size) {
    if (size > 10) { size == 10; }
    if (size < 1)  { size == 1; }

    _.each(_.range(1,11), function(n) {
      if ($(globals.root).hasClass("size-" + n)) {
        $(globals.root).removeClass("size-" + n);
      }
    });
    $(globals.root).addClass("size-" + size);
  };

  interface.toggle_sidebar = function() {
    if (globals.is_animating) { return false; }
    my.event_handlers.window_resize()

    globals.is_animating = true;
    if (globals.help_enabled) {
      $("#keys").animate({ 'width': 'auto' }, { duration: 150 }).removeClass("enabled"); 
      $("#keys span").text("");
      $("#keybindings", globals.root).animate({ opacity: 0 }, {
        complete : function() { 
          $(globals.root + " #keybindings").removeClass("visible"); 
          $(globals.root).removeClass("viewing-help");
          globals.is_animating = false;
        }
      });
      globals.help_enabled= false;
    } else {
      if (parseInt($("#editor").css("width").split("px")[0]) < 415) {
        $("#keys").addClass('enabled');
      } else {
        $("#keys").animate({ 'width': '225px' }, { duration: 150 }).addClass('enabled');
        $("#keys span").text("Help");
      }
      $("#keybindings", globals.root).addClass("visible").animate({ opacity: 1.0 }, { 
        duration: 600, easing: 'ease-in',
        complete : function() { 
          globals.is_animating = false; 
          $(globals.root).addClass("viewing-help");
        } });
        globals.help_enabled= true;
    }
    focus.browser_focus_reset(false);
    return true;
  };

  interface.ensure_input_in_view = function() {
    if ($("#active").offset().top - globals.cutoff_height < $(window).scrollTop()) {
      window.scrollTo(0,$("#active").offset().top - globals.cutoff_height);
    }
    if ($("#active").offset().top + $("#active").height() > $(window).scrollTop() + $(window).height()) {
      var bottom_diff = ($("#active").offset().top + $("#active").height()) - ($(window).scrollTop() + $(window).height());
      window.scrollTo(0,$(window).scrollTop() + bottom_diff + 10);
    }
  }


  interface.bold = function() {  focus.surround_selection("**", "**"); };
  interface.italic = function() { focus.surround_selection("_", "_"); };
  interface.link = function() { 
    var field = $("#active textarea")[0];
    var selected = field.selectionStart != field.selectionEnd ? true : false;
    focus.surround_selection("[", "]()");
    if (selected) { focus.position_cursor_delta(-1); }
  };
  interface.clear = function() {
    $(root_selector).html($("<ul>").append(li_tag));
    focus.set($("li", root_selector).first());
    return true;
  };

  return _.extend(my, { interface : interface });
}(mil_edit || {}));
