function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.newWin = Ti.UI.createWindow({
        id: "newWin",
        navBarHidden: "false",
        exitOnClose: "false",
        backgroundColor: "white"
    });
    $.__views.newWin && $.addTopLevelView($.__views.newWin);
    $.__views.__alloyId7 = Ti.UI.createView({
        id: "__alloyId7"
    });
    $.__views.newWin.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createLabel({
        text: "TEST",
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;