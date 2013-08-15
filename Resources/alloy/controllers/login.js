function Controller() {
    function closeWindow() {
        $.loginWin.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.loginWin = Ti.UI.createWindow({
        id: "loginWin"
    });
    $.__views.loginWin && $.addTopLevelView($.__views.loginWin);
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Back",
        id: "__alloyId2"
    });
    closeWindow ? $.__views.__alloyId2.addEventListener("click", closeWindow) : __defers["$.__views.__alloyId2!click!closeWindow"] = true;
    $.__views.loginWin.rightNavButton = $.__views.__alloyId2;
    $.__views.loginContainer = Ti.UI.createView({
        backgroundColor: "#f4f4f4",
        layout: "vertical",
        id: "loginContainer"
    });
    $.__views.loginWin.add($.__views.loginContainer);
    $.__views.__alloyId3 = Ti.UI.createTableViewRow({
        id: "__alloyId3"
    });
    var __alloyId4 = [];
    __alloyId4.push($.__views.__alloyId3);
    $.__views.usernameTxt = Ti.UI.createTextField({
        right: "10dp",
        height: "45dp",
        width: "250dp",
        hintText: "Username",
        textAlign: "right",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderColor: "transparent",
        id: "usernameTxt"
    });
    $.__views.__alloyId3.add($.__views.usernameTxt);
    $.__views.__alloyId5 = Ti.UI.createTableViewRow({
        id: "__alloyId5"
    });
    __alloyId4.push($.__views.__alloyId5);
    $.__views.passwordTxt = Ti.UI.createTextField({
        right: "10dp",
        hintText: "Password",
        height: "45dp",
        width: "250dp",
        textAlign: "right",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        passwordMask: true,
        backgroundColor: "transparent",
        borderWidth: 0,
        borderColor: "transparent",
        id: "passwordTxt"
    });
    $.__views.__alloyId5.add($.__views.passwordTxt);
    $.__views.loginTable = Ti.UI.createTableView({
        width: "250dp",
        height: "120dp",
        scrollable: false,
        data: __alloyId4,
        id: "loginTable"
    });
    $.__views.loginContainer.add($.__views.loginTable);
    $.__views.loginButton = Ti.UI.createButton({
        top: "10dp",
        left: "10dp",
        width: "200dp",
        height: "45dp",
        theme: "white",
        buttonLabelTop: "10dp",
        buttonLabelSize: "17dp",
        id: "loginButton"
    });
    $.__views.loginContainer.add($.__views.loginButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.loginButton.title = "Login";
    $.loginWin.title = "Login to Propertypond";
    $.loginWin.navBarHidden = false;
    __defers["$.__views.__alloyId2!click!closeWindow"] && $.__views.__alloyId2.addEventListener("click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;