var mil_edit = (function(my) {
  var globals = {
    root             : "#editor",
    root_selector    : "#editor #area #list",
    initialized      : false,
    help_enabled     : false,
    is_animating     : false,
    li_tag           : "<li draggable='true' ondragstart='mil_edit.drag(event)' ondrop='mil_edit.drop(event)' ondragover='return false;'>",
    mouse_down_focus_state : false,
    clicking : false,
    clicking_falsify_callback : false,
    drag_target : false,
    cutoff_height : 0
  };

  return _.extend(my, { globals : globals });
}(mil_edit || {}));
