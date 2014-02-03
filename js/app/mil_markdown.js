var mil_markdown = (function() {
  var li_tag = "<li draggable='true' ondragover='return false;' ondrop='mil_edit.drop(event)' ondragstart='mil_edit.drag(event)'>";
  var tabSize = 2;

  function regex_substitute(payload, regexp, delimStart, delimEnd) {
    if (!delimEnd) { delimEnd = delimStart; }
    return payload.replace(  
      regexp,
      function(a, s, capture, e) { return delimStart + capture + delimEnd }
    );
  };
  function replace_bolds_to_md(payload) {
    var expression = new RegExp(/(\<strong\>)([^>]+)(\<\/strong\>)/ig);
    return regex_substitute(payload, expression, "**");
  }
  function replace_italics_to_md(payload) {
    var expression = new RegExp(/(\<em\>)([^>]+)(\<\/em\>)/ig);
    return regex_substitute(payload, expression, "_");
  }
  function replace_links_to_md(payload) {
    return payload.replace( 
      new RegExp(/(\<a\s+href=\")([^"]+)(\"\>)([^<]+)(\<\/a\>)/ig),
      function(a,b,href,d,content,f) { 
        return "[" + content + "](" + href + ")";
      }
    );
  } 
  function replace_bolds_to_html(payload) {
    // Use of regex_substitute for all fns would be ideal
    var expression = new RegExp(/(\*\*)(([^*][^*]|[^*])+)(\*\*)/ig);
    return payload.replace(
      expression,
      function(a,open_delim,content,d,close_delim,f) {
        return "<strong>" + content + "</strong>";
      }
    );
  }
  function replace_italics_to_html(payload) {
    var expression = new RegExp(/(_)([^_]+)(_)/ig);
    return regex_substitute(payload, expression, "<em>", "</em>");
  }
  function replace_links_to_html(payload) {
    return payload.replace( 
      new RegExp(/(\[)([^\]]+)(\]\()([^)]+)(\))/ig),
      function(all, a,content,c,url,e) { 
        return "<a href='" + url + "'>" + content + "</a>";
      }
    );
  } 

  function strip_junk_tags(payload) {
    var strip_p = new RegExp(/(\<p\>)(.+)?(\<\/p\>)/ig);
    var strip_div = new RegExp(/(\<div[^>]+?\>)()(\<\/div\>)/ig);
    return regex_substitute(regex_substitute(payload, strip_p, ""), strip_div, "");
  }

  function markdownify_text_attributes(payload) {
    if (!payload) { payload = "" }
    return strip_junk_tags(replace_italics_to_md(replace_bolds_to_md(replace_links_to_md(payload))));
  }
   /* Dump */
  function markdownify(payload) {
    var ret = "";
    _.each($("li", payload), function (l, i) {
      if ($(l).children("ul").size() != 0) { return; } // wrapper li
      var text = "", pre = "", level = $(l).parents("ul").size() -1;
      _.times(level * tabSize, function () { pre = pre + " "; });
      pre += (level % 2 === 0) ?  "- " : "* ";
      text = $(l).html();
      ret += pre + text;
      if (i + 1 != $("li", payload).length) { ret += "\n"; }
    });
    return markdownify_text_attributes(ret);
  };

  function htmlify_text_attributes(payload) {
    // convert links, a and bold
    return strip_junk_tags(replace_italics_to_html(replace_bolds_to_html(replace_links_to_html(payload))));
  }
  function htmlify(payload) {
    var lines = payload.split("\n"), root = $("<ul>"), parent = root, last_indent = 0;

    _.each(lines, function(line, index) {
      if (line == "") { return; }
      var matches = line.match(new RegExp("(\s\s)*[-*] (.+)"));
      if (!matches) { return; }
      var leading = matches.index, content = matches[2];

      if (leading - 2 == last_indent) {
        parent.append($(li_tag).append("<ul>")); 
        parent = $(parent.children().last().children()[0]);
      } else if (last_indent -leading > 0) {
        _.times((last_indent - leading) / 2, function() { 
          parent = parent.parent().parent(); 
        });
      } 

      parent.append(li_tag + content + "</li>");
      last_indent = leading;
    });
    if ($(root).children().size() == 0) {
      return false;
    } else {
      _.each($("li", root), function(a) {
        if ($(a).children("ul").size() != 0) { return; }
        $(a).html(htmlify_text_attributes($(a).html()));
      });
      return $(root);
    }
  }


  return {
    markdownify : markdownify,
    markdownify_text_attributes : markdownify_text_attributes,
    htmlify : htmlify,
    htmlify_text_attributes : htmlify_text_attributes
  }
}());
