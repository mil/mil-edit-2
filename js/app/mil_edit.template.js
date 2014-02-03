var template_buttons = ''.concat(
  '<div id="buttons">',

  '<a id="undo" class="hidden" title="Press Ctrl-Z to Undo" onclick="mil_edit.undo()"></a>',
  '<a id="redo" class="hidden" title="Press Ctrl-Y to Redo" onclick="mil_edit.redo()"></a>',

  '<span id="undo_separator" class="hidden separator"></span>',
  '<a id="undent" title="Press [Shift] [Tab] to Undent" onclick="mil_edit.undent()"></a>',
  '<a id="indent" title="Press [Tab] to Indent" onclick="mil_edit.indent()"></a>',
  '<span class="separator"></span>',
  '<a id="bold" title="Press Ctrl-B to **Bold** Text" onclick="mil_edit.bold()"></a>',
  '<a id="italic" title="Press Ctrl-I to _Italicize_ Text" onclick="mil_edit.italic()"></a>', 
  
  '<a id="keys" title="Press Ctrl-? to Toggle Key Controls Panel" onclick="mil_edit.keybindings()"><span></span></a>',

  '</div>'
);

var template_keybindings = ''.concat(
  '<div id="keybindings">',

  '<div class="basic">',

  '<h2>Drag and Drop</h2>',
  'Re-arrange items using <i>drag and drop</i>',

  '<h2>Styling Text</h2>',
  '**<strong>Two Stars</strong>** makes text <strong>Bold</strong><br/>',
  '_<em>Underscores</em>_ makes text <em>Italic</em><br/>',


  '<h2>Key Controls</h2>',
  '<span class="key">Tab</span> to Indent<br/>',
  '<span class="key">Shift</span> <span class="key">Tab</span> to Undent<br/>',
  '<span class="key">&uarr;</span> and <span class="key">&darr;</span> to move between lines<br/>',
  '<span class="key">Shift</span> <span class="key">&uarr;</span> <span class="key">&darr;</span> to shift between lines<br/>',

  '<a id="collapse" title="Hide this Help Pane" onclick="mil_edit.keybindings()">Hide &rarr;</a>',
  '</div>',

  '</div>'
);

var template_list = ''.concat(
  '<div id="area">',
  '<div id="list"></div>',
  template_keybindings,
  '</div>'
  );

var editor_template = ''.concat(
  template_buttons,
  template_list
);
