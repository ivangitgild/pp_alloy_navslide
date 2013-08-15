var platform = Ti.Platform.osname;

var slider = null;

var windows = [];

exports.removeSlider = function() {
    slider = null;
    windows = [];
};

exports.createSlider = function() {
    function showTopCatcher() {
        if (null != tapCatcher) return;
        tapCatcher = Ti.UI.createWindow({
            left: OPEN_LEFT
        });
        tapCatcher.addEventListener("click", function() {
            slider.close();
        });
        tapCatcher.addEventListener("close", function() {
            tapCatcher = null;
        });
        tapCatcher.open();
    }
    var touchStartX = 0;
    var touchRightStarted = false;
    var touchLeftStarted = false;
    var buttonPressed = false;
    var hasSlided = false;
    var direction = "reset";
    var windowWidth = Ti.Platform.displayCaps.platformWidth;
    var windows = [];
    var OPEN_LEFT = .84 * windowWidth;
    "ipad" == platform && (OPEN_LEFT = 250);
    var SLIDER_RIGHT = windowWidth - OPEN_LEFT;
    var visibleWindow = null;
    var STATUS = {
        OPEN: 0,
        CLOSED: 1,
        ANIMATING: 2
    };
    var ANIMATION_DURATION = 300;
    var status = STATUS.OPEN;
    var tapCatcher = null;
    var slider = Ti.UI.createView({
        width: "13dp",
        right: SLIDER_RIGHT
    });
    var border = Ti.UI.createView({
        width: "2dp",
        right: 0,
        backgroundColor: "#333"
    });
    slider.add(border);
    var shadow = Ti.UI.createView({
        width: "11dp",
        left: 0,
        backgroundImage: "/images/shadow.png"
    });
    slider.add(shadow);
    slider.open = function() {
        Ti.API.debug("slider.open");
        if (status == STATUS.CLOSED) {
            status == STATUS.ANIMATING;
            visibleWindow.animate({
                left: OPEN_LEFT,
                duration: ANIMATION_DURATION,
                curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
            }, function() {
                showTopCatcher();
                visibleWindow.left = OPEN_LEFT;
                status = STATUS.OPEN;
                slider.fireEvent("open");
            });
        } else Ti.API.info("slider is already open or animating");
    };
    slider.close = function() {
        Ti.API.debug("slider.close");
        if (status == STATUS.OPEN) {
            status == STATUS.ANIMATING;
            null != tapCatcher && tapCatcher.close();
            Ti.API.debug("closing slider");
            if (visibleWindow) visibleWindow.animate({
                left: 0,
                duration: ANIMATION_DURATION,
                curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
            }, function() {
                visibleWindow.left = 0;
                status = STATUS.CLOSED;
                slider.fireEvent("close");
            }); else {
                status = STATUS.CLOSED;
                slider.fireEvent("close");
            }
        } else Ti.API.debug("slider is already closed or animating");
    };
    slider.back = function() {
        var nav = visibleWindow.nav;
        var windowCount = nav.windowCount();
        Ti.API.debug("windowCount=" + windowCount);
        windowCount > 1 ? nav.closeTopWindow() : slider.open();
    };
    slider.selectAndClose = function(winNumber) {
        slider.showWindow(winNumber, slider.close);
    };
    slider.addWindow = function(params) {
        var proxy = {};
        proxy.window = null;
        proxy.createFunction = params.createFunction;
        if (params.rightNavButton) {
            console.log(params.rightNavButton);
            proxy.rightNavButton = params.rightNavButton;
        }
        windows.push(proxy);
        return windows.length - 1;
    };
    slider.preLoadWindow = function(winNumber) {
        var proxy = windows[winNumber];
        slider.loadWindow(proxy);
    };
    slider.loadWindow = function(proxy) {
        var win = proxy.createFunction();
        win.moving = false;
        win.axis = 0;
        "android" != Ti.Platform.osname && win.addEventListener("swipe", function(e) {
            "right" == e.direction;
        });
        proxy.window = require("navWindow").createNavigationWindow(win);
        win.nav = proxy.window;
        var button = Ti.UI.createButton({
            image: "/images/button.png"
        });
        button.addEventListener("click", function() {
            touchRightStarted || touchLeftStarted || (buttonPressed = true);
            slider.open();
        });
        win.addEventListener("touchstart", function(e) {
            touchStartX = parseInt(e.x);
        });
        win.addEventListener("touchmove", function(e) {
            var newLeft = e.x - touchStartX;
            touchRightStarted && OPEN_LEFT >= newLeft && newLeft >= 0 ? visibleWindow.left = newLeft : touchRightStarted && 0 > newLeft || touchLeftStarted && newLeft > 0 ? visibleWindow.left = 0 : touchRightStarted && newLeft > OPEN_LEFT && (visibleWindow.left = OPEN_LEFT);
            newLeft > 5 && !touchLeftStarted && !touchRightStarted ? touchRightStarted = true : -5 > newLeft && !touchRightStarted && !touchLeftStarted && (touchLeftStarted = true);
        });
        win.addEventListener("touchend", function() {
            if (visibleWindow.left >= OPEN_LEFT / 2 && touchRightStarted) {
                direction = "right";
                visibleWindow.animate({
                    left: OPEN_LEFT,
                    duration: 150,
                    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
                });
                slider.open();
                console.log("open");
                hasSlided = true;
            } else {
                direction = "reset";
                visibleWindow.animate({
                    left: 0,
                    duration: 150,
                    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
                });
                slider.close();
                hasSlided = false;
                console.log("close");
            }
            touchRightStarted = false;
            touchLeftStarted = false;
        });
        if ("android" == Ti.Platform.osname) {
            var titleBar = Ti.UI.createLabel({
                height: "44dp",
                top: 0,
                backgroundColor: "#498BF3",
                textAlign: "center",
                color: "white",
                width: Ti.UI.FILL,
                text: win.title
            });
            win.add(titleBar);
            button.top = "7dp";
            button.left = "7dp";
            button.width = "42dp";
            button.height = "30dp";
            win.add(button);
            win.addEventListener("android:back", function() {
                Ti.API.debug("heard back!");
            });
            win.addEventListener("swipe", function(e) {
                "right" == e.direction && button.fireEvent("click");
            });
        } else {
            win.leftNavButton = button;
            proxy.rightNavButton && (win.rightNavButton = proxy.rightNavButton());
            win.borderRadius = 2;
        }
        proxy.window.left = status == STATUS.CLOSED ? 0 : OPEN_LEFT;
        proxy.window.width = Ti.Platform.displayCaps.platformWidth;
    };
    slider.showWindow = function(winNumber, _nextFunction) {
        if (status == STATUS.ANIMATING) {
            Ti.API.debug("animating, not changing window...");
            return;
        }
        Ti.API.debug("getting window " + winNumber);
        var proxy = windows[winNumber];
        if (null == proxy.window) {
            Ti.API.debug("window " + winNumber + " has not been loaded yet");
            slider.loadWindow(proxy);
            proxy.window.open();
            proxy.window.opened = true;
            addSwipe = true;
        } else if (proxy.window.opened) {
            Ti.API.debug("making " + proxy.window.title + " visible");
            proxy.window.visible = true;
        } else {
            Ti.API.debug("window " + winNumber + " has been loaded, but not opened");
            proxy.window.open();
            proxy.window.opened = true;
        }
        if (visibleWindow == proxy.window) {
            Ti.API.debug("window " + proxy.window.title + " is already visible, exiting");
            _nextFunction && setTimeout(_nextFunction, 100);
            return;
        }
        if (null == visibleWindow) Ti.API.debug("no visible windows"); else {
            var oldVisibleWindow = visibleWindow;
            Ti.API.debug("hiding visible window");
            proxy.window.left = oldVisibleWindow.left;
            oldVisibleWindow.animate({
                opacity: 0,
                duration: 200
            }, function() {
                oldVisibleWindow.fireEvent("blur");
                if ("android" == platform) {
                    Ti.API.debug("closing window " + oldVisibleWindow.title);
                    oldVisibleWindow.close();
                    oldVisibleWindow.opened = false;
                    oldVisibleWindow = null;
                }
            });
        }
        proxy.window.animate({
            opacity: 100,
            duration: 200
        }, function() {
            slider.fireEvent("change", {
                window: winNumber
            });
            _nextFunction && setTimeout(_nextFunction, 50);
        });
        visibleWindow = proxy.window;
        visibleWindow.fireEvent("focus");
        status == STATUS.OPEN && null == tapCatcher && showTopCatcher();
    };
    slider.showNewWindow = function() {
        var newWin = Ti.UI.createWindow({
            modal: true,
            backgroundColor: "#e6e7e8",
            layout: "vertical",
            title: "More Information",
            navBarHidden: false,
            exitOnClose: true
        });
        var nView = Ti.UI.createView();
        var label = Ti.UI.createLabel({
            text: "Test"
        });
        nView.add(label);
        var back = Ti.UI.createButton({
            title: "Back",
            width: "50dp",
            height: "40dp"
        });
        back.addEventListener("click", function() {
            newWin.close();
        });
        newWin.setLeftNavButton(back);
        newWin.add(nView);
        return newWin;
    };
    return slider;
};