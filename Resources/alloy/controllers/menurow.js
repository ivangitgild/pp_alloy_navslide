function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.row = Ti.UI.createTableViewRow({
        height: "25dp",
        id: "row"
    });
    $.__views.row && $.addTopLevelView($.__views.row);
    $.__views.__alloyId6 = Ti.UI.createView({
        id: "__alloyId6"
    });
    $.__views.row.add($.__views.__alloyId6);
    $.__views.title = Ti.UI.createLabel({
        color: "#666",
        font: {
            fontSize: "13"
        },
        left: "2dp",
        id: "title"
    });
    $.__views.__alloyId6.add($.__views.title);
    $.__views.icon = Ti.UI.createImageView({
        width: "38dp",
        right: 0,
        id: "icon"
    });
    $.__views.row.add($.__views.icon);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.icon.image = args.image;
    $.title.text = args.title || "";
    $.row.customView = args.customView || "";
    $.row.customTitle = $.title;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;