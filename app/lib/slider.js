var platform = Ti.Platform.osname;
var slider = null;
var windows = [];



exports.removeSlider = function(){
	slider = null;
	windows = [];
};

exports.createSlider = function() {
	var touchStartX = 0;
	var touchRightStarted = false;
	var touchLeftStarted = false;
	var buttonPressed = false;
	var hasSlided = false;
	var direction = "reset";

	var windowWidth = Ti.Platform.displayCaps.platformWidth;
	var windows = [];
	var OPEN_LEFT = windowWidth * 0.84;
	if (platform == 'ipad') {
		OPEN_LEFT = 250;
	}
	var SLIDER_RIGHT = windowWidth - OPEN_LEFT;
	var visibleWindow = null;
	var STATUS = {
		OPEN : 0,
		CLOSED : 1,
		ANIMATING : 2
	};
	var ANIMATION_DURATION = 300;
	var status = STATUS.OPEN;
	var tapCatcher = null;

	var slider = Ti.UI.createView({
		width : '13dp',
		right : SLIDER_RIGHT
	});
	var border = Ti.UI.createView({
		width : '2dp',
		right : 0,
		backgroundColor : '#333'
	});
	slider.add(border);
	var shadow = Ti.UI.createView({
		width : '11dp',
		left : 0,
		backgroundImage : '/images/shadow.png'
	});
	slider.add(shadow);

	function showTopCatcher() {
		if (tapCatcher != null) {
			// don't load again if showing
			return;
		}
		tapCatcher = Ti.UI.createWindow({
			left : OPEN_LEFT,
		});
		tapCatcher.addEventListener('click', function() {
			slider.close();
		});
		tapCatcher.addEventListener('close', function() {
			tapCatcher = null;
		});
		tapCatcher.open();
	};

	slider.open = function() {
		Ti.API.debug('slider.open');
		if (status == STATUS.CLOSED) {
			status == STATUS.ANIMATING;
			visibleWindow.animate({
				left : OPEN_LEFT,
				duration : ANIMATION_DURATION,
				curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
			}, function() {
				showTopCatcher();
				visibleWindow.left = OPEN_LEFT;
				status = STATUS.OPEN;
				slider.fireEvent('open');
			});
		} else {
			Ti.API.info('slider is already open or animating');
		}
	};

	slider.close = function() {
		Ti.API.debug('slider.close');
		if (status == STATUS.OPEN) {
			status == STATUS.ANIMATING;
			if (tapCatcher != null) {
				tapCatcher.close();
			}
			Ti.API.debug('closing slider');
			if (visibleWindow) {
				visibleWindow.animate({
					left : 0,
					duration : ANIMATION_DURATION,
					curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
				}, function() {
					visibleWindow.left = 0;
					status = STATUS.CLOSED;
					slider.fireEvent('close');
				});
			} else {
				status = STATUS.CLOSED;
				slider.fireEvent('close');
			}
		} else {
			Ti.API.debug('slider is already closed or animating');
		}
	};

	slider.back = function() {
		// Close the most recent windows in the visibleWindow
		// nav stack until you get to the base, then open
		// the slider
		var nav = visibleWindow.nav;
		var windowCount = nav.windowCount();
		Ti.API.debug('windowCount=' + windowCount);
		if (windowCount > 1) {
			nav.closeTopWindow();
		} else {
			slider.open();
		}
	}

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
		// return the window number
		return (windows.length - 1);
	};

	slider.preLoadWindow = function(winNumber) {
		var proxy = windows[winNumber];
		slider.loadWindow(proxy);
	}

	slider.loadWindow = function(proxy) {
		// Window has not been created yet
		var win = proxy.createFunction();
		win.moving = false;
		win.axis = 0;
		if (Ti.Platform.osname != 'android') {
			win.addEventListener('swipe', function(e) {
				if (e.direction == 'right') {
					//slider.open();
				}
			});
		}
		
		proxy.window = require('navWindow').createNavigationWindow(win);
		win.nav = proxy.window;
		
		var button = Ti.UI.createButton({
			image : "/images/button.png"
		});
		button.addEventListener('click', function() {
			if (!touchRightStarted && !touchLeftStarted) {
				buttonPressed = true;
			}
			slider.open();
		});
		
		win.addEventListener('touchstart', function(e){
			touchStartX = parseInt(e.x);
		});
		win.addEventListener('touchmove', function(e){
			var newLeft = e.x - touchStartX;
			if (touchRightStarted && newLeft <= OPEN_LEFT && newLeft >= 0 ) {
				visibleWindow.left = newLeft;
			}
			else {
				// Sometimes newLeft goes beyond its bounds so the view gets stuck.
				// This is a hack to fix that.
				if ((touchRightStarted && newLeft < 0) || (touchLeftStarted && newLeft > 0)) {
					visibleWindow.left = 0;
				}
				else if (touchRightStarted && newLeft > OPEN_LEFT) {
					visibleWindow.left = OPEN_LEFT;
				}
			}
			if (newLeft > 5 && !touchLeftStarted && !touchRightStarted) {
				touchRightStarted = true;
				// Ti.App.fireEvent("sliderToggled", {
					// hasSlided : false,
					// direction : "right"
				// });
			}
			else if (newLeft < -5 && !touchRightStarted && !touchLeftStarted) {
				touchLeftStarted = true;
				// Ti.App.fireEvent("sliderToggled", {
					// hasSlided : false,
					// direction : "left"
				// });
			}
			// // Subtracting current position to starting horizontal position
		    // var coordinates = parseInt(e.x) - e.source.axis;
		    // // Detecting movement after a 20px shift
		    // if(coordinates > 0 || coordinates < -40){
		        // e.source.moving = true;
		    // }
		    // // Locks the window so it doesn't move further than allowed
		    // if(e.source.moving == true && coordinates <= OPEN_LEFT && coordinates >= 0){
		        // // This will smooth the animation and make it less jumpy
		        // visibleWindow.animate({
		            // left:coordinates,
		            // duration : 150,
					// curve : Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		        // });
		        // // Defining coordinates as the final left position
		        // visibleWindow.left = coordinates;
		    // }
		});
		
		win.addEventListener('touchend', function(e){
			
			if (visibleWindow.left >= (OPEN_LEFT/2) && touchRightStarted) {
				direction = "right";
				visibleWindow.animate({
					left : OPEN_LEFT,
					duration : 150,
					curve : Ti.UI.ANIMATION_CURVE_EASE_OUT
				});
				slider.open();
				console.log('open');
				hasSlided = true;
			} else {
				direction = "reset";
				visibleWindow.animate({
					left : 0,
					duration : 150,
					curve : Ti.UI.ANIMATION_CURVE_EASE_OUT
				});
				slider.close();
				hasSlided = false;
				console.log('close');
			}
			// Ti.App.fireEvent("sliderToggled", {
				// hasSlided : hasSlided,
				// direction : direction
			// });
			touchRightStarted = false;
			touchLeftStarted = false;
		    // // No longer moving the window
		    // e.source.moving = false;
		    // console.log(e);
		    // if(visibleWindow.left >= 150 && visibleWindow.left < OPEN_LEFT){
		        // // Repositioning the window to the right
		        // button.fireEvent('click');
		        // //menuButton.toggle = true;
		    // }else{
		        // // Repositioning the window to the left
		        // status = STATUS.OPEN;
		        // slider.close();
		        // //menuButton.toggle = false;
		    // }
		});

		
		
		if (Ti.Platform.osname == 'android') {
			/* You might want to do your own stuff here.
			 * I usually have my own special Android window
			 * with a titleBar, and this is where I set the
			 * menu button in it
			 */
			var titleBar = Ti.UI.createLabel({
				height : '44dp',
				top : 0,
				backgroundColor : '#498BF3',
				textAlign : 'center',
				color : 'white',
				width : Ti.UI.FILL,
				text : win.title
			});
			win.add(titleBar);
			button.top = '7dp';
			button.left = '7dp';
			button.width = '42dp';
			button.height = '30dp';
			win.add(button);
			win.addEventListener('android:back', function() {
				Ti.API.debug('heard back!');
			});
			win.addEventListener('swipe', function(e){
				if (e.direction == 'right') {
					button.fireEvent('click');
				}
			});
		} else {
			win.leftNavButton = button;
			if (proxy.rightNavButton)
				win.rightNavButton = proxy.rightNavButton();
			win.borderRadius = 2;
			
			
			//Can't do in both because causes crash in Android
			// When you try to animate it
		}
		if (status == STATUS.CLOSED) {
			proxy.window.left = 0;

		} else {
			proxy.window.left = OPEN_LEFT;
		}
		proxy.window.width = Ti.Platform.displayCaps.platformWidth;
	}

	slider.showWindow = function(winNumber, _nextFunction) {
		if (status == STATUS.ANIMATING) {
			Ti.API.debug('animating, not changing window...');
			return;
		}
		Ti.API.debug('getting window ' + winNumber);
		var proxy = windows[winNumber];
		if (proxy.window == null) {
			Ti.API.debug('window ' + winNumber + ' has not been loaded yet');
			slider.loadWindow(proxy);
			proxy.window.open();
			proxy.window.opened = true;
			addSwipe = true;
		} else if (!proxy.window.opened) {
			Ti.API.debug('window ' + winNumber + ' has been loaded, but not opened');
			proxy.window.open();
			proxy.window.opened = true;
		} else {
			Ti.API.debug("making " + proxy.window.title + " visible");
			proxy.window.visible = true;
		}
		if (visibleWindow == proxy.window) {
			// Nothing else to do here
			Ti.API.debug('window ' + proxy.window.title + " is already visible, exiting");
			if (_nextFunction) {
				setTimeout(_nextFunction, 100);
			}
			return;
		}
		if (visibleWindow == null) {
			Ti.API.debug('no visible windows');
		} else {
			var oldVisibleWindow = visibleWindow;
			Ti.API.debug('hiding visible window');
			proxy.window.left = oldVisibleWindow.left;
			oldVisibleWindow.animate({
				opacity : 0,
				duration : 200
			}, function() {
				oldVisibleWindow.fireEvent('blur');
				if (platform == 'android') {
					Ti.API.debug('closing window ' + oldVisibleWindow.title);
					oldVisibleWindow.close();
					oldVisibleWindow.opened = false;
					oldVisibleWindow = null;
				}
			});
		}
		proxy.window.animate({
			opacity : 100,
			duration : 200
		}, function() {
			// Fire an event to let everyone know you have changed
			slider.fireEvent('change', {
				window : winNumber
			});
			if (_nextFunction) {
				setTimeout(_nextFunction, 50);
			}
		});
		visibleWindow = proxy.window;
		visibleWindow.fireEvent('focus');
		if (status == STATUS.OPEN && tapCatcher == null) {
			showTopCatcher();
		}
	};
	
	slider.showNewWindow = function(){
		var newWin = Ti.UI.createWindow({
			modal : true,
	        backgroundColor: '#e6e7e8',
	        layout: 'vertical',
	        title: 'More Information',
	        navBarHidden: false,
	        exitOnClose: true
	        //orientationModes: [Ti.UI.PORTRAIT]
		});
		var nView = Ti.UI.createView();
		var label = Ti.UI.createLabel({
			text : 'Test'
		});
		nView.add(label);
		var back = Ti.UI.createButton({
		    title: "Back",
		    width:'50dp',
            height:'40dp'
		});
		back.addEventListener("click", function() {
		    newWin.close();
		});
		newWin.setLeftNavButton(back);
		newWin.add(nView);
		
		return newWin;
	};

	return slider;
}
