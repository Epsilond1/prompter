function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

(function($){


	$(function() {
	
		//	Fix bug with non-justified navbar in android native browser
		if (bowser.android && bowser.mobile) {
			$('.navbar-collapse .navbar-nav').addClass('android-mobile');
		}
		
		//	Init: IE-buggy no support message
		if (!parseInt(readCookie('ie_alert'))) {

			v = bowser.version.split('.');
			v = parseInt(v[0]);
			
			if (bowser.msie && v < 9) {
				$ie_alert = $('#ie-alert');
				$('h3', $ie_alert).append(' '+v);
				$('button', $ie_alert).click(function(){
					createCookie('ie_alert', 1, 30);
				});				
				$('#message').prepend($ie_alert).show();
			}
		}
		
		
		//	Init: Sidebar Affix
		//	* if sidebar exists
		
		$sidebar = $('#bauman-sidebar');
		
		if ($sidebar.size()) {
			$sidebar.affix({
				offset: {
					top: function(){
						offsetTop = 0;
						$sidebar.parents('.bauman-content:first').prevAll('div').each(function(index){
							offsetTop += $(this).outerHeight(true);
						});
						return (this.top = offsetTop);
					},
					bottom: function () {
						return (this.bottom = $('#footer').outerHeight(true)+20)
					}
				}
				
			});
			$sidebar.width($sidebar.parent().width());
			$(window).resize(function(){
				$sidebar.width($sidebar.parent().width());
			});
		}
		
		
		
		//	Init video play if its home page 
		
		if ($('#video').size() > 0){
			
			$('a.btn-video').click(function(event){

				$(this).parents('.b-newsitem:first')
					.find('.b-video-iframe:first iframe')
					.clone().appendTo(
						$('#video .b-video:first').empty()
					);

				event.preventDefault();			
			});

			$('#video').on('hidden.bs.modal', function (event) {
				$(this).find('.b-video:first').empty();
			})
		}

	});

	
})(jQuery);