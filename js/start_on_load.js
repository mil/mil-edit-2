Zepto(function($){
  var defaultMarkdown = "- What is this?\n\
  * An **Embedable** Markdown List Editor\n\
- What about features?\n\
  * Button and Key Controls\n\
  * **Bold**, _Italics_, and Links\n\
  * Exports to **Markdown**\n\
- Hacker?\n\
  * Source on [Github](http://github.com/mil/mil-edit2)";
  mil_edit.initialize();
  mil_edit.load_markdown(defaultMarkdown);
});
