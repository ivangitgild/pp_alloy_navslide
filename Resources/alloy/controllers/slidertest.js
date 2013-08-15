function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.slidertestWin = Ti.UI.createWindow({
        id: "slidertestWin"
    });
    $.__views.slidertestWin && $.addTopLevelView($.__views.slidertestWin);
    $.__views.__alloyId9 = Ti.UI.createLabel({
        text: "TEST",
        id: "__alloyId9"
    });
    $.__views.slidertestWin.add($.__views.__alloyId9);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;