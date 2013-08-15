var args = arguments[0] || {};
$.icon.image = args.image;
$.title.text = args.title || '';
$.row.customView = args.customView || '';
$.row.customTitle = $.title;

$.icon.applyProperties({
	left : (Ti.Platform.displayCaps.platformWidth * 0.84) - 45
});
