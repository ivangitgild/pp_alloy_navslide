function Controller() {
    function createSection() {
        slider = require("slider").createSlider();
        var ppSection = Ti.UI.createTableViewSection({
            headerTitle: "Your Propertypond"
        });
        if ("member" == role || "user" == role) {
            Ti.UI.createTableViewRow({
                title: "Account",
                font: {
                    fontSize: 13
                }
            });
            var args = {
                title: "Account",
                image: "images/ic_search.png"
            };
            ppSection.add(Alloy.createController("menurow", args).getView());
            var args = {
                title: "My Favorites",
                image: "images/ic_search.png"
            };
            ppSection.add(Alloy.createController("menurow", args).getView());
        } else {
            var argsLogin = {
                title: "Login",
                image: "images/ic_search.png"
            };
            var argsSignup = {
                title: "Create Account",
                image: "images/ic_search.png",
                baseWin: $.win
            };
            ppSection.add(Alloy.createController("menurow", argsLogin).getView());
            ppSection.add(Alloy.createController("menurow", argsSignup).getView());
        }
        tableData.push(ppSection);
        var discoverSection = Ti.UI.createTableViewSection({
            headerTitle: "Discover"
        });
        var argsSearch = {
            title: "Search Rentals",
            image: "images/ic_search.png"
        };
        discoverSection.add(Alloy.createController("menurow", argsSearch).getView());
        tableData.push(discoverSection);
        var informationSection = Ti.UI.createTableViewSection({
            headerTitle: "Information"
        });
        var count = ppmoreinfo.length;
        for (var index = 0; count > index; index++) {
            var argsInfo = {
                title: ppmoreinfo[index].title,
                images: "images/ic_search.png"
            };
            informationSection.add(Alloy.createController("menurow", argsInfo).getView());
        }
        tableData.push(informationSection);
        table = Ti.UI.createTableView({
            rowHeight: "44dp",
            top: 100
        });
        table.setData(tableData);
    }
    function preWindow() {
        slider.addWindow({
            createFunction: function() {
                return Alloy.createController("home").getView();
            }
        });
    }
    function listenForBackButton() {
        slider.back();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        id: "win",
        navBarHidden: "true",
        backgroundColor: "white"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var tableData = [];
    var role = Ti.App.Properties.getString("role");
    var ppmoreinfo = require("ppmoreinfo");
    $.win.title = "Propertypond";
    var table = null;
    var slider = null;
    createSection();
    preWindow();
    slider.preLoadWindow(0);
    table.addEventListener("click", function(e) {
        console.log(e.index);
        if (2 == e.index) {
            slider.addWindow({
                createFunction: function() {
                    return Alloy.createController("test").getView();
                }
            });
            slider.selectAndClose(1);
        }
    });
    var logoView = Ti.UI.createView({
        top: "24dp",
        height: "70dp",
        width: "121dp",
        left: .84 * Ti.Platform.displayCaps.platformWidth / 2 - 60.5,
        backgroundImage: "/images/logo-lrg.png"
    });
    logoView.addEventListener("click", function() {
        slider.selectAndClose(0);
    });
    $.win.add(logoView);
    $.win.add(table);
    $.win.add(slider);
    var started = false;
    $.win.addEventListener("open", function() {
        if (!started) {
            slider.selectAndClose(0);
            started = true;
        }
    });
    slider.addEventListener("open", function() {
        Ti.API.debug("baseWindow heard open");
        $.win.removeEventListener("android:back", listenForBackButton);
    });
    slider.addEventListener("close", function() {
        Ti.API.debug("baseWindow heard close");
        $.win.addEventListener("android:back", listenForBackButton);
    });
    "iphone" === Ti.Platform.osname ? $.win.open({
        transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
    }) : $.win.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;