var test;
var meth = "ET";
describe("tree", function() {
  // setup and teardown
  beforeEach(function() {
    $("body").append(make_dom(["div#editor", [["div#area", [["div#list", [["ul", [
      ["li#a", "Ah"],
      ["li#b", "Woah"],
      ["li#c", [
        ["div#n1", [
          ["div#way-nest", "Legit"]
        ]],
        ["div#n2", "Thats"],
        ["div#n3", "It"]
      ]],
      ["li", ""],
      ["li#g", ""],
      ["li", [["ul", [
        ["li#within-nest", "a nested item"]
      ]]]],
      ["li", [["ul", [
        ["li", "wee"]
      ]]]]
    ]]]]]]]]));
  });
  afterEach(function() {
    $("#editor").remove();
  });

  it("are_brothers with consecutive nodes", function() { 
    expect(mil_edit.tree.are_brothers($("#a"), $("#b"))).toBe(true);
  });
  it("are_brothers with non-consecutive nodes", function() { 
    expect(mil_edit.tree.are_brothers($("#a"), $("#c"))).toBe(true);
  });
  it("levels_to_root 2", function() {
    expect(mil_edit.tree.levels_to_root($("#a"))).toBe(2);
  });
  it("levels_to_root 3", function() {
    expect(mil_edit.tree.levels_to_root($("#n1"))).toBe(3);
  });
  it("levels_to_root 4", function() {
    expect(mil_edit.tree.levels_to_root($("#way-nest"))).toBe(4);
  });
  it("directional_find from consecutive node", function() {
    expect(
      mil_edit.tree.directional_find("li", $("#a"), 1).attr('id')
    ).toBe("b")
  });
  it("directional_find in nest", function() {
    expect(
      mil_edit.tree.directional_find("li", $("#g"), 1).attr('id')
    ).toBe("within-nest")
  });

  it("delete_empties", function() {
    mil_edit.tree.delete_empties();
    expect(dom_comparison(
      $("#editor")[0], 
      make_dom(["div#editor", [["div#area", [["div#list", [["ul", [
        ["li#a", "Ah"],
        ["li#b", "Woah"],
        ["li#c", [
          ["div#n1", [
            ["div#way-nest", "Legit"]
          ]],
          ["div#n2", "Thats"],
          ["div#n3", "It"]
        ]],
        ["li", [["ul", [
          ["li#within-nest", "a nested item"]
        ]]]],
        ["li", [["ul", [
          ["li", "wee"]
        ]]]]
      ]]]]]]]])
    )).toBeTruthy();
  });
  it("merge_seperate_lists", function() {
    mil_edit.tree.merge_seperate_lists();
    expect(dom_comparison(
      $("#editor")[0],
      make_dom(["div#editor", [["div#area", [["div#list", [["ul", [
      ["li#a", "Ah"],
      ["li#b", "Woah"],
      ["li#c", [
        ["div#n1", [
          ["div#way-nest", "Legit"]
        ]],
        ["div#n2", "Thats"],
        ["div#n3", "It"]
      ]],
      ["li", ""],
      ["li#g", ""],
      ["li", [["ul", [
        ["li#within-nest", "a nested item"],
        ["li", "wee"]
      ]]]]
    ]]]]]]]])
    )).toBeTruthy();
  });

  it("clean_tree", function() {

  });

});
