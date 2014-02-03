describe("mil_markdown", function() {
  it("htmlify_text_attributes", function() {
    expect(
      mil_markdown.htmlify_text_attributes("**hello** good _world_")
    ).toBe(
      "<strong>hello</strong> good <em>world</em>"
    );
  });
  it("markdownify_text_attributes", function() {
    expect(
      mil_markdown.markdownify_text_attributes("<strong>hello</strong> good <em>world</em>")
    ).toBe(
      "**hello** good _world_"
    );
  });

  var mappings = [
    {
      title : "single item",
      markdown   : "- test",
      dom        : ["ul", [ ["li", "test"] ]]
    },
    {
      title : "multiple items",
      markdown : "- test one\n- test two\n- test three",
      dom : ["ul", [
        ["li", "test one"],
        ["li", "test two"],
        ["li", "test three"]
      ]]
    },
    {
      title : "multiple items of varied nesting",
      markdown : "- test one\n  * woo\n  * i'm indented\n- test two\n- test three",
      dom : ["ul", [
        ["li", "test one"],
        ["li", [[ "ul", [
          ["li", "woo"],
          ["li", "i'm indented"]
        ]]]],
        ["li", "test two"],
        ["li", "test three"]
      ]]
    },
    {
      title : "markdownify with multiple items of varies nesting with text attributes",
      markdown: "- test one\n  * **wo**o\n  * i'm _indented_\n- test two\n- test three",
      dom: ["ul", [
        ["li", "test one"],
        ["li", [[ "ul", [
          ["li", "<strong>wo</strong>o"],
          ["li", "i'm <em>indented</em>"]
        ]]]],
        ["li", "test two"],
        ["li", "test three"]
      ]]
    }
  ];
  _.each(mappings, function(item) {
    it("markdownify with " + item.title, function(e) {
      expect(mil_markdown.markdownify(make_dom(item.dom))).toBe(item.markdown);
    });
    it("htmlify with " + item.title, function(e) { 
      expect(dom_comparison(
        mil_markdown.htmlify(item.markdown),
        make_dom(item.dom)
      )).toBeTruthy();
    });
  });
});
