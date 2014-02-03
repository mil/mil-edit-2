var o,n;
function make_dom(arr) {
  console.log("making");
  console.log(arr);
  var class_name = arr[0].match(/\.(.+)#?/),
  id_name    = arr[0].match(/#(.+)\.?/);
  class_name  = class_name ? class_name[1] : false;
  id_name = id_name ? id_name[1] : false; 
  tag_name = arr[0].replace(/[.#].+/g, "");

  var selector = $("<" + tag_name + "/>");
  if (id_name) { selector.attr("id", id_name); }
  if (class_name) { selector.addClass(class_name); }
  if (typeof arr[1] == "string") {
    selector.html(arr[1]);
  } else {
    _.each(arr[1], function(child) {
      selector.append(make_dom(child));
    });
  }
  return selector;
}
function object_comparison(object_a, object_b) {
  return json.stringify(object_a) == json.stringify(object_b);
}
function dom_attributes_to_hash(dom) {
  var hash = { };
  _.times(dom.attributes.length, function(i) {
    hash[dom.attributes.item(i).nodename] = dom.attributes.item(i).nodevalue;
  });
  return hash;
}
function dom_comparison(dom_a, dom_b, attributes_and_values) {
  var 
  children_a = $(dom_a).children(),
  children_b = $(dom_b).children();

  if (children_a.length != children_b.length) { return false; }

  var still_same = true;
  _.times(children_a.length, function(i) {
    if (!dom_comparison($(dom_a).children()[i], $(dom_b).children()[i], attributes_and_values)) {
      still_same = false;
      return false;
    }
  });
  if (!still_same) { return false; }

  if ($(dom_a).prop("tagName") != $(dom_b).prop("tagName")) { return false; }
  if (attributes_and_values) {
    if ($(dom_a).html() != $(dom_b).html()) { 
      return false; 
    }
    if (!object_comparison(dom_attributes_to_hash(dom_a), dom_attributes_to_hash(dom_b))) {
      return false;
    }
  }
  return true;
}
function build_li_tag(content) {
  var attributes = {
    "draggable"   : "true",
    "ondragover"  : "return false;",
    "ondrop"      : "mil_edit.drop(event)",
    "ondragstart" : "mil_edit.drag(event)"
  };
  var return_string = "<li";
  _.each(attributes, function(value, attribute) {
    return_string = return_string + ' ' + attribute + '="' + value + '"';
  });
  return_string = return_string + ">" + content + "</li>";
  return return_string;
}

// WIll eventually become state.dump_state and load_state in mil_edit
function mil_state() {
  return [
    $("#editor #area #list").clone()[0],  //DOM
    mil_edit.dump_focus_state()
  ];
}
function mil_comparison(mil_state_a, mil_state_b) {
  console.log("running MIL COMPARISON");
  console.log(mil_state_a, mil_state_b);
  if (!dom_comparison(mil_state_a[0], mil_state_b[0])) { 
    console.log("fail dom comp");
    return false; }
    if (!object_comparison(mil_state_a[1], mil_state_b[1])) { 
      console.log("fail object comp");
      return false; }
      return true;
}
