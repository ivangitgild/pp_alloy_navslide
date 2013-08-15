var tableData = [];
var role = Ti.App.Properties.getString('role');
var ppmoreinfo = require('ppmoreinfo');

$.win.title = 'Propertypond';
var table = null;
var slider = null;
function createSection() {
	slider = require('slider').createSlider();
	
	var ppSection = Ti.UI.createTableViewSection({
		headerTitle:'Your Propertypond'
	});
	
	if (role == 'member' || role == 'user') {
		var account = Ti.UI.createTableViewRow({
			title : 'Account',
			font : { fontSize : 13 }
		});
		var args = {
			title : 'Account',
			//customView : 'view',
			image : "images/ic_search.png"
		};
		ppSection.add(Alloy.createController('menurow', args).getView());
		//ppSection.add(account);
		var args = {
			title : 'My Favorites',
			//customView : 'view',
			image : "images/ic_search.png"
		};
		
		ppSection.add(Alloy.createController('menurow', args).getView());
	} else {
		
		var argsLogin = {
			title : 'Login',
			//customView : 'view',
			image : "images/ic_search.png"
		};
		var argsSignup = {
			title : 'Create Account',
			//customView : 'view',
			image : "images/ic_search.png",
			baseWin : $.win
		};
		
		ppSection.add(Alloy.createController('menurow', argsLogin).getView());
		ppSection.add(Alloy.createController('menurow', argsSignup).getView());

	}
	
	tableData.push(ppSection);
	
	var discoverSection = Ti.UI.createTableViewSection({
		headerTitle : 'Discover'
	});
	
	var argsSearch = {
		title : 'Search Rentals',
		image : "images/ic_search.png"
	};
	
	discoverSection.add(Alloy.createController('menurow',argsSearch).getView());
	tableData.push(discoverSection);
	
	var informationSection = Ti.UI.createTableViewSection({
		headerTitle : 'Information'
	});
	var count = ppmoreinfo.length;
	for (var index = 0; index < count; index++) {
		
		var argsInfo = {
			title : ppmoreinfo[index].title,
			images : "images/ic_search.png"
		};
		
		informationSection.add(Alloy.createController('menurow',argsInfo).getView());
	}
	
	tableData.push(informationSection);
	
	table = Ti.UI.createTableView({
			rowHeight : '44dp',
			top : 100
		});
	table.setData(tableData);
}

function preWindow(){
	slider.addWindow({
			createFunction : function(){
				return Alloy.createController('home').getView();
			}
	});
}

createSection();
preWindow();

slider.preLoadWindow(0);
/* Try Clicking the Search Rentals Menu*/		
table.addEventListener('click', function(e){
	console.log(e.index);
	if (e.index == 2) {
		slider.addWindow({
			createFunction : function(){
				return Alloy.createController('test').getView();
			}
		});
			
		slider.selectAndClose(1);
	}
});

var logoView = Ti.UI.createView({
    top: '24dp',
    height: '70dp',
    width: '121dp',
    left : ((Ti.Platform.displayCaps.platformWidth * 0.84) / 2) - (121/2),
    backgroundImage: "/images/logo-lrg.png"
});
/* Click The Logo to return back in HOME */
logoView.addEventListener('click', function(){
	slider.selectAndClose(0);
});

$.win.add(logoView);
$.win.add(table);
$.win.add(slider);

var started = false;

$.win.addEventListener('open', function() {
	/* Wierd - open event on baseWindow gets fired
	 every time slider fires event 'open'. Using
	 started variabled to make sure this only gets
	 run once */
	if (!started) {
		//slider.showWindow(0);
		slider.selectAndClose(0);
		started = true;
	}

});

function listenForBackButton() {
	slider.back();
}

slider.addEventListener('open', function() {
	Ti.API.debug('baseWindow heard open');
	$.win.removeEventListener('android:back', listenForBackButton);
});

slider.addEventListener('close', function() {
	Ti.API.debug('baseWindow heard close');
	$.win.addEventListener('android:back', listenForBackButton);
});

if (Ti.Platform.osname === 'iphone')
	$.win.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.win.open();