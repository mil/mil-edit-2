var o, n;

describe("mil_edit", function() {
  // setup and teardown
  beforeEach(function() {
    $("body").append("<div id='editor'></div>");
    mil_edit.initialize();
  });
  afterEach(function() {
    mil_edit.disable();
    $("#editor").remove();
  });


  describe("Mil Edit Loading and Dumping Markdown", function() {
    it("load_markdown with single item", function() {
      mil_edit.load_markdown("- something");
      expect(
        $($("#editor #area #list").children()[0]).children().length
      ).toBe(1);
    });
    it("load_markdown with multiple items", function() {
      mil_edit.load_markdown("- something\n- another thing\n- another thing after that");
      expect(
        dom_comparison($("#editor #area #list")[0], $("<div><ul><li></li><li></li><li><textarea></textarea></li></ul></div>")[0])
      ).toBeTruthy();
    });

    it("dump_markdown with a single item", function() {
      mil_edit.load_markdown("- something");
      expect(mil_edit.dump_markdown()).toBe( "- something");
    });

    it("dump_markdown with a multple item", function() {
      mil_edit.load_markdown("- something\n- another thing\n- another thing after that");
      expect(mil_edit.dump_markdown()).toBe("- something\n- another thing\n- another thing after that");
    });

  });
});
