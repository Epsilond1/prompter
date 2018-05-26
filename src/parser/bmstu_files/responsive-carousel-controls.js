(function($){
	offset = $('.carousel-bauman').width() - $('.carousel-bauman .container:first').width();
	$('a.carousel-control').width(offset/2);
	$controls = $('a.carousel-control');

	if ($controls.size() > 0) {
		var resizeCarouselControls = function(){
			offs = $('.carousel-bauman').width() - $('.carousel-bauman .container:first').width();
			offs = offs/2;
			
			$arrow = $('span.carousel-nav-arrow', $controls);
			if (offs < 80)
				$arrow.addClass('small');
			else
				$arrow.removeClass('small');
				
			$controls.width(offs);
			topOffs = $controls.eq(0).height()/2 - $arrow.eq(0).height()/2;			
			$('center.j-valign-center', $controls).css('padding-top', topOffs+'px');
		};	resizeCarouselControls();
	}

	if ($controls.size() > 0) {
		$(window).resize(resizeCarouselControls);
	}
})(jQuery);