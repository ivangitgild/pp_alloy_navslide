var args = arguments[0] || {};
console.log(args);
// args.baseWin.nav = Ti.UI.iPhone.createNavigationGroup({
		// window : $.testWin
	// });
	// args.baseWin.add(args.baseWin.nav);
// 
$.testClick.addEventListener('click', function(){
	var resultW = Alloy.createController('new').getView();
	resultW.nav = $.testWin.nav;
	$.testWin.nav.openNextWindow(resultW);
});
