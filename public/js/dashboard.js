$(function () {
	// browser window scroll (in pixels) after which the "back to top" link is shown
    var offset = 70
        , //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
        offset_opacity = 1200
        , //duration of the top scrolling animation (in ms)
        scroll_top_duration = 700

    $(window).scroll(function () {
        ($(this).scrollTop() > 36) ? $('.header').addClass('fixed'): $('.header').removeClass('fixed');
    });
});