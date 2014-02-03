var mil_edit = (function(my) {
  // Dependency Imported from mil_edit scope
  var globals = my.globals;
  var history = my.history;
  var util    = my.util;
  var tree = new Object();

  tree.are_brothers = function(zepto_selector_a, zepto_selector_b) { 
    return _.contains(zepto_selector_a.parent().children(), zepto_selector_b[0]); 
  };

  tree.levels_to_root = function(zepto_selector) {
    var level = 0;
    while ($(zepto_selector).attr("id") != "list" && $(zepto_selector).parent().length != 0) {
      zepto_selector = $(zepto_selector).parent();
      level++;
    }
    return level;
  };

  tree.directional_find = function(tag, zepto_selector_origin, direction) {
    // tag to find, zepto selector, and which direction to go in
    if (zepto_selector_origin.length == 0) { return false; }
    var c = zepto_selector_origin;

    brother_children = (direction == 1) ? c.next().size() : c.prev().size();

    while(!brother_children && c.parent()){
      c = c.parent();
      brother_children = (direction == 1) ? c.next().size() : c.prev().size();
      if (brother_children) { break; }
    }

    // At the top or not dealing in li uls anymore
    if (c.is(globals.root_selector) || (!c.is("li") && !c.is("ul"))) { 
      return false; 
    }

    // Search DOWN the tree
    c = (direction == 1) ? c.next() : c.prev();
    while (c.children().size() && !util.is_editable(c)) {
      c = (direction == 1) ? c.children().first(tag) : c.children().last(tag);
    }

    return $(c).is(tag) ? c : false;
  };
  tree.delete_empties = function() {
    /* Remove empty li's and li ul's */
    _.each(_.union($("li", globals.root_selector), $("li ul", globals.root_selector)), function(item) {
      if ($(item).html() == "") { $(item).remove(); } 
    });
  };

  tree.merge_seperate_lists = function() {
    /* Combine ul's un-necessarily "seperate" */
    while ($("ul", globals.root_selector).parent().next().children("ul").size() > 0) {
      _.each($("ul", globals.root_selector), function(item) {
        if ($(item).parent().next().children("ul").size() > 0) {
          $(item).append($(item).parent().next().children("ul").children());
          $(item).parent().next().children("ul").parent().remove();
        }
      });
    }
  };

  tree.clean_tree = function() {  
    // If top UL somehow calls out of place, fix it
    if ($("#list").children().size() != 1 && !$($("#list").children()[0]).is("ul")) {
      $("#list").html("<ul>" + $("#list").html() + "</ul>");
    }
    tree.delete_empties();
    tree.merge_seperate_lists();
    tree.delete_empties();
    if ($("#active").parent().parent().siblings().size() == 0) {
      focus.undent();
    }
    tree.fix_collapse_expand_buttons();
    $("#wrapped").children().unwrap();
  }

  tree.new_brother = function(brother) { return $(globals.li_tag).insertAfter(brother ? brother : "#active"); }
  tree.delete_above = function() { focus.set_delta(-1); tree.clean_tree(); return true; }
  tree.insert_below = function() { return focus.set(tree.new_brother()); };

  tree.fix_collapse_expand_buttons = function() {
    _.each($(".collapse-expand", globals.root_selector), function(btn) {
      $(btn).remove();
    });
    _.each(_.union($(".nest", globals.root_selector), $(".parent", globals.root_selector)), function(s) { 
      $(s).removeClass("nest").removeClass("parent");
    });


    _.each($("ul", globals.root_selector), function(ul) {
      var associated_nest = $(ul).parent();
      if (associated_nest.is(globals.root_selector)) { return; } // root selector
      var associated_parent = associated_nest.prev();
        var d = $("<div>").addClass("collapse-expand");
        if (associated_nest.hasClass("collapsed")) { d.addClass("collapsed"); }
        if (associated_nest.hasClass("collapsed")) { 
          associated_parent.addClass("folded"); 
        } else {
          associated_parent.removeClass("folded"); 
        }
        $(associated_parent).addClass("parent").prepend(d);
        $(associated_nest).addClass("nest");
    });

    _.each($(".scoped", globals.root_selector), function(s) { 
      $(s).removeClass("scoped"); 
    });

    var node = $("#active").parent().parent();
    while(node.is("li")) {
      node.addClass("scoped"); 
      node.prev().addClass("scoped"); 
      node = node.parent().parent();
    }
  };

  tree.clear = function() {
    $(globals.root_selector).html($("<ul>").append(globals.li_tag));
    focus.set($("li", globals.root_selector).first());
    return true;
  };


  var focus = new Object();
  focus.position_cursor =  function(start_position, end_position) {
    if (!end_position) { end_position = start_position; }
    var field = $("#active textarea")[0];
    if (field.createTextRange) {
      var range = field.createTextRange();
      range.move('character', start_position);
      range.moveEnd('character', end_position);
      range.select();
    } else {
      if (field.selectionStart != undefined) {
        field.setSelectionRange(start_position, end_position);
      }
      field.focus();
    }
    return true;
  };

  focus.position_cursor_delta = function(delta) {
    focus.position_cursor($("#active textarea")[0].selectionStart + delta);
    return true;
  };

  focus.adjust_rows = function() {
    var f = $("#active textarea");
    f.css("overflow", "hidden").height("18px");
    f.height(f[0].scrollHeight + "px");
  };

  focus.is_in_bold = function() {
    return util.is_enclosed_by(
      $("#active textarea").val(), $("#active textarea")[0].selectionEnd, "**");
  }
  focus.is_in_italic = function() {
    return util.is_enclosed_by(
      $("#active textarea").val(), $("#active textarea")[0].selectionEnd, "_");
  } 
  focus.surround_selection = function(prepend, append) {
    var field = $("#active textarea")[0];
    var emptySelection = field.selectionStart == field.selectionEnd ? true : false;


    var end = field.selectionEnd + append.length + prepend.length;
    var newText = $(field).val();
    newText = util.insert_at(newText, field.selectionStart, prepend);
    newText = util.insert_at(newText, field.selectionEnd + prepend.length, append);
    $(field).val(newText);
    focus.position_cursor(emptySelection ? end - append.length : end);
  }

  focus.set = function(zepto_selector) {  
    if ($("#active").size() != 0) {
      $("#active").html(
        mil_markdown.htmlify_text_attributes($("#active").children("textarea").val())
      ).removeAttr("id");
    }

    zepto_selector.attr("id", "active").find(".collapse-expand").remove();
    var content = $("<div />").html(mil_markdown.markdownify_text_attributes($("#active").html())).text();
    $("#active").html($("<textarea type='text' placeholder='&nabla;' rows='1'>" + content + "</textarea>"));
    focus.browser_focus_reset();
    //interface.recurrent(); // will add back in collapse/expand
    return true;
  };

  focus.browser_focus_reset = function(dont_reposition_cursor) {
    if (!$(document.activeElement).is("textarea") && !$(document.activeElement).is("input")) {
      if (!dont_reposition_cursor) { focus.position_cursor(10000); }
      focus.adjust_rows();
      $("#active textarea")[0].focus();
      return true;
    } else { return false; }
  };

  focus.set_delta = function(delta) {
    var nextItem = tree.directional_find("li", $("#active"), delta);
    if (!nextItem) { return false; }
    if (nextItem.parent().parent().is("li.collapsed")) {
      while (nextItem.parent().parent().is("li.collapsed")) {
        nextItem = tree.directional_find("li", nextItem.parent(), delta);
      }
    }
    if (!nextItem || !nextItem.is("li")) { return false; }
    return focus.set(nextItem);
  };

  focus.shift = function(delta) {
    var associated_nest = false,
    prepend = $("#active"),
    append  = $("#active");

    if ($($("#active").next().children()[0]).is("ul")) {
      associated_nest = $("#active").next(); 
      append = $("#active").next();
    }

    if (delta == -1) {
      if (!prepend.prev().length) { return false; }
      if ($(prepend.prev().children()[0]).is("ul")) { prepend= $(prepend).prev(); }
      $("#active").insertBefore(prepend.prev());
    } else {
      if (!append.next().length) { return false; }
      if ($(append.next().next().children()[0]).is("ul")) { append = $(append).next(); }
      $("#active").insertAfter(append.next());
    }
    $(associated_nest).insertAfter($("#active"));
    focus.browser_focus_reset();
    return true;
  };

  focus.indent = function(shift_up) {
    // Top of Tree
    if ($("#active").prev().size() == 0) { return false; }

    var nest = null;
    if ($($("#active").next().children()[0]).is("ul")) {
      nest = $("#active").next().wrap(globals.li_tag + "<ul>");
      shift_up = shift_up - 1;
    }

    // Shift up the active and its nest
    $("#active").wrap(globals.li_tag + "<ul>"); 
    tree.clean_tree();


    if (shift_up) { 
      _.times(shift_up, function() {
        $("#active").prev().before($("#active"));
      }); 
    }
    if (nest) { $("#active").after(nest); }

    return true;
  };

  focus.undent = function() {
    // Top of the Tree
    if ($("#active").parent().parent().is("div")) { return false; }

    // Move around the Active and (its) nested list
    var associated_nest = null;
    if ($($("#active").next().children()[0]).is("ul")) { associated_nest = $("#active").next(); }
    $("#active").parent().parent().after($("#active"));
    if(associated_nest) { $("#active").after(associated_nest); }

    tree.clean_tree();
    $("#active textarea")[0].focus();
    return true;
  };

  return _.extend(my, { tree : tree, focus : focus });
}(mil_edit || {}));
