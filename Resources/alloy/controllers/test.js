function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.testWin = Ti.UI.createWindow({
        id: "testWin",
        backgroundColor: "white"
    });
    $.__views.testWin && $.addTopLevelView($.__views.testWin);
    $.__views.testClick = Ti.UI.createButton({
        id: "testClick",
        title: "Test"
    });
    $.__views.testWin.add($.__views.testClick);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    console.log(args);
    $.testClick.addEventListener("click", function() {
        var resultW = Alloy.createController("new").getView();
        resultW.nav = $.testWin.nav;
        $.testWin.nav.openNextWindow(resultW);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;