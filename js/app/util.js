var mil_edit = (function(my) {
  var globals = my.globals;
  var util = new Object();

  util.type = function(x) { return Object.prototype.toString.call(x); };
  // String Helpers and Manipulation
  util.number_of_matches = function(string, substring) {
    return string.split(substring).length - 1;
  };
  util.remove_at = function(str, pos, len) {
    if (!len) { len = 1; }
    return str.slice(0, pos) + str.slice(pos + len);
  }
  util.insert_at = function(str, pos, cha) {
    return str.slice(0, pos) + cha + str.slice(pos)
  }
  util.is_enclosed_by = function(string, position, delimiter) {
    total  = string.split(delimiter).length - 1;
    before = util.number_of_matches(string.slice(0, position), delimiter);
    after  = util.number_of_matches(string.slice(position), delimiter);
    if (total % 2 != 0) { total = total - 1; }
    return before % 2 != 0 && after % 2 != 0;
  } 

  util.brother_elements_to_end = function(zepto_selector) {
    var count = 0;
    while (zepto_selector.next().length != 0) {
      zepto_selector = zepto_selector.next(); count++;
    }
    return count;
  }

  // Building atop Zepto
  util.set_class = function(zepto_selector, class_name, condition) {
    condition ? zepto_selector.addClass(class_name) : zepto_selector.removeClass(class_name);
  }
  util.is_editable = function(zepto_selector) {
    var firstChild = zepto_selector.children().first();
    if (firstChild.is("textarea") || firstChild.is("strong") || firstChild.is("em") || firstChild.is("a") || firstChild.is(".collapse-expand")) {
      return true; } else { return false; }
  }

  util.is_focused = function() {
    return $(globals.root).has(document.activeElement).length > 0 ? true : false;
  }
  
  util.focused_node = function() {
    if (document.selection) {
      return document.selection.createRange().parentElement(); 
    } else {
      var selection = window.getSelection();
      if (selection.rangeCount > 0) {
        return selection.getRangeAt(0).startContainer.parentNode;
      }
    }
  }

  return _.extend(my, { util : util });
}(mil_edit || {}));
