function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ppMenuSlider/" + s : s.substring(0, index) + "/ppMenuSlider/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function Controller() {
    new (require("alloy/widget"))("ppMenuSlider");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.leftMenu = Ti.UI.createView({
        id: "leftMenu"
    });
    $.__views.leftMenu && $.addTopLevelView($.__views.leftMenu);
    $.__views.logoView = Ti.UI.createView({
        id: "logoView"
    });
    $.__views.leftMenu.add($.__views.logoView);
    $.__views.leftTableView = Ti.UI.createTableView({
        id: "leftTableView"
    });
    $.__views.leftMenu.add($.__views.leftTableView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;