/*колонки на главной*/
function colsAsideRight(){
    var heightThanksPane = 0;
    var heightActivityPane = $('.calendar').outerHeight() + $('.activity-pane').outerHeight();
    $('.thanks-pane').each(function(){
        heightThanksPane += $(this).outerHeight();
    });
    heightThanksPane += $('.ref-pane').outerHeight() + $('.addres-pane').outerHeight();
    //console.log("право" + heightThanksPane);
    //console.log("лево" + heightActivityPane);
    if(heightThanksPane > heightActivityPane){
        $('.activity-pane').css('padding-bottom', heightThanksPane - heightActivityPane + 21);
    }else{
        $('.activity-pane').css('padding-bottom', 25);
    }
}

var mScroll = null;

var obSKCookies = {
	bUseCookies: false,
	
	checkCookie: function() {
		//$.cookie('MSU_TEST', '4', { expires: 1, path: '/' });
        Cookies.set('MSU_TEST', '4', { expires: 1, path: '/' }); // проверяем работоспособность cookie
        
		if(Cookies.get("MSU_TEST") == 4)
			obSKCookies.bUseCookies = true;
	},
	
	showCookieWarning: function() {
		if($("#cookie_warning_container").size() == 0) {
			$("body").append('<div id="cookie_warning_container" class="cooces__wrap cooces__wrap--visible ">\
	      <div class="cooces__center">\
                <p>Для того, чтобы мы могли качественно предоставить Вам услуги, мы используем cookies, которые сохраняются\
            на Вашем компьютере (сведения о местоположении; ip-адрес; тип, язык, версия ОС и браузера; тип\
            устройства и разрешение его экрана; источник, откуда пришел на сайт пользователь; какие страницы\
            открывает и на какие кнопки нажимает пользователь). Нажимая кнопку «СОГЛАСЕН», Вы подтверждаете то, что\
            Вы проинформированы об использовании cookies на нашем сайте. Отключить cookies Вы можете в настройках\
            своего браузера.</p>\
            <button class="cooces__btn" onclick="obSKCookies.setHideWarning(); return false;">Согласен</button>\
            </div>\
        </div>');
		}
	},
	
	setHideWarning: function() {
        Cookies.set('HIDE_COOKIE_WARN', 'Y', { expires: 3650, path: '/' });
//		$.cookie('HIDE_COOKIE_WARN', 'Y', { expires: 3650, path: '/' });
		$('#cookie_warning_container').hide();
	},
};

var obSKHelper = {
    scrollViewTo: function(strSelector, intTime, intOffset)
    {
        if($(strSelector).size() > 0) {
            if (typeof(intTime) != "number") intTime = 1000; else intTime = parseInt(intTime);
            if (typeof(intOffset) != "number") intOffset = 0; else intOffset = parseInt(intOffset);

            jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: ($(strSelector).offset().top + intOffset)}, intTime);
        }
    },

    confirmAction: function(strText) {
        return confirm(strText);
    }
};

obReportError = {
    init: function() {
        $(".js-show-report-form").on("click", function() {
            var obT = $(this);

            var intID = obT.attr("data-id");
            var strType = obT.attr("data-type");
            $.ajax({
                method: "POST",
                url: "/system/ajax/report-error.php",
                data: { action: "get-form", ID: intID, type:  strType, referer: document.location.href}
            })
                .done(function( strResult ) {
                    if(strResult.length) {
                        $.fancybox(strResult);
                        $("#report-error-select-position").select2({
                            minimumResultsForSearch: Infinity
                        });

                        $("#report-error-submit").on("click", function() {
                            obReportError.submitForm();
                            return false;
                        })
                    }
                });

            return false;
        });
    },

    toggleContactsError: function(obClicked) {
        var obT = $(obClicked);

        if(obT.is(":checked"))
            $("#report-error-select-position-container").show();
        else $("#report-error-select-position-container").hide();
    },

    submitForm: function() {
        $.ajax({
            method: "POST",
            url: "/system/ajax/report-error.php",
            dataType: "json",
            data: $("#report-error-form").serialize()
        })
            .done(function (obResult) {
                var strResultText;
                if (obResult.MESSAGE_TYPE == 'OK')
                    strResultText = '<div class="report-error-ok-massage">'+obResult.MESSAGE+'</div>';
                else {
                    strResultText = '<div class="report-error-bad-massage">'+obResult.MESSAGE+'</div>';
                    $("#report-error-captcha-sid").val(obResult.CAPTHCA_CODE);
                    $("#report-error-captcha-image").attr("src", "/bitrix/tools/captcha.php?captcha_sid="+obResult.CAPTHCA_CODE);
                }

                $("#report-error-message").html(strResultText).show();

                if (obResult.MESSAGE_TYPE == 'OK') $("#report-error-form").hide();
            });
    }
};

$(document).ready(function() {
    // cookie warning
	obSKCookies.checkCookie();
    if(obSKCookies.bUseCookies) {
	    // if($.cookie('HIDE_COOKIE_WARN') != 'Y') {
	    if(Cookies.get('HIDE_COOKIE_WARN') != 'Y') {
		    obSKCookies.showCookieWarning();
	    }
    }
    
    /*---modal-wrap---*/
    /*$('.modal-wrap').each(function(){
     $(this).css('margin-top', - $(this).height() / 2);
     console.log($(this).height());
     console.log($(this).outerHeight());
     });*/

    /*модальное окно*/
    //$('.add-job-btn').on('click', function(e){
    //    e.preventDefault();
    //    $('.modal-wrap-job').show();
    //    $('.fade').show();
    //});

    $('.modal-close, .cancel-btn').on('click', function () {
        $(this).parents('.modal-wrap').hide();
        if($(this).parents('.modal-wrap').hasClass('modal-wrap-job')){
            $('.fade').hide();
        }
    });

    obReportError.init();

    $('.select-checkbox-result-content label').on('click', function (e) {
        var level2 = $(this).parents('.level2');
        if (!level2.length && $(this).parent().siblings('.level2').length) {
            e.preventDefault();
            $(this).parents('li').toggleClass('open').find('.level2').toggle();
        }
    });

    $('.select-checkbox-result-content .level2 input[type=checkbox]').on('change', function(){
        var level2 = $(this).parents('.level2'),
            level1Checkbox = level2.siblings('.field-worker-profile-checkbox').find('span.checkbox input[type=checkbox]');
        if(level2.find('input[type=checkbox]').length == level2.find('input[type=checkbox]:checked').length){
            level1Checkbox.prop('checked', true).refresh();
        } else if(level1Checkbox.is(':checked')){
            level1Checkbox.prop('checked', false).refresh();
        }
    });

    $('.select-checkbox-result-content .field-worker-profile-checkbox span.checkbox').on('click', function () {
        var checkbox = $(this).find('input[type=checkbox]'),
            level2 = $(this).parent().siblings('.level2');
        if(level2.length){
            if(checkbox.is(':checked')){
                level2.find('input[type=checkbox]').prop('checked', true).refresh();
            } else{
                level2.find('input[type=checkbox]').removeAttr('checked').refresh();
            }
        }
    });

    var values = [];
    $('.select-checkbox-result-content label').each(function(){
        values.push({value: $(this).text(), data: $(this).text()});
    })
    if ($('.select-checkbox-result-search-pane input').length) {
        $('.select-checkbox-result-search-pane input').autocomplete({
            lookup: values,
            onSelect: function (suggestion) {
                $('.select-checkbox-result-content .level1 > li').each(function(){
                    var label = $(this).find('label:contains(' + suggestion.value +')');
                    if(label.length){
                        label.parents('li').show().find('li').show();
                        if(label.parents('.level2').length){
                            label.parents('.level2').find('li').each(function(){
                                if(!$(this).find('label:contains(' + suggestion.value +')').length){
                                    $(this).css('display', 'none');
                                }
                            });
                        }
                    } else {
                        $(this).css('display', 'none')
                    }
                });
            }
        });
    }

    $('.select-checkbox-result-btn .result-btn').on('click', function(){
        var selectedValue = false,
            modal = $('.select-checkbox-result-block'),
            vals = [],
            checkbox = modal.find('.level2 input[type=checkbox]:checked');
        if(checkbox.length){
            vals.push(checkbox.val());
            $('#edit-contacts-unit-select').val(vals).trigger("change");
        } else {
            var level1CheckedCheckbox = modal.find('.level1 .field-worker-profile-checkbox input[type=checkbox]:checked').first();
            if(level1CheckedCheckbox.length){
                $('#edit-contacts-unit-select').val(level1CheckedCheckbox.val()).trigger("change");
            }
        }

        //alert($("#edit-contacts-unit-select").val());

        $('.select-checkbox-result-block').hide();
    });

    /*---end modal-wrap---*/


    $('.aside_left').css('min-height', $('body').height() - $('.logo').outerHeight() - $('.footer').outerHeight());

    if ($("select").length) {
    $("select").not('.default_controls select, .select-worker').select2({
        minimumResultsForSearch: -1
    });
    }

    var select2Worker = $(".select-worker");
    if ( select2Worker.length) {
        select2Worker.select2({
            minimumResultsForSearch: -1,
            formatSelection: function(data){
                if(data.css == 'level2'){
                    return $(data.element).prevAll("option.level1:last").text() + ' → ' + data.text;
                }

                return data.text;
            }
        }).on('select2-opening', function () {
            $('.select2-drop').addClass('select-worker-container');
    		$('body > .select2-drop').addClass('select-worker-container');
            showModal();
        }).on('select2-open', function () {
            select2Worker.select2('close');
        });
    }
	$('.select-checkbox .filter-select-btn').on('click', function(e){
        showModal(e);
    });

    if ($('body').width() < 980) {
        $(".select2-search, .select2-focusser").remove();   
    }

    $('.filter-select-checkbox').on('select2-opening', function () {
        $('.select2-drop').addClass('filter-select-checkbox-container');
    });


    if ($('a.fancybox').length) {
        $('a.fancybox').fancybox({

            helpers: { // чтобы при показе попапа не скроллилось к верху страницы
                overlay: {
                    locked: false
                },
                title: {
                    type: 'outside'
                }
            },
            afterLoad: function(current, previous) {
                if (!previous) {
                    return true; // not prev/next btn clicked
                }
                var item = $(previous.element);
                if (!item.hasClass('fancybox-multipage')) { // not first/last item
                    return true;
                }
                var link = item.data('link');

                if (current.index == 1 && previous.index == 0) {
                    return true;
                }
                if (current.index > 0 && previous.index == current.index+1) {
                    return true;
                }

                if (!link || !link.length) {
                    return false;
                }

                $.fancybox.showLoading();
                var isFirst = previous.index > current.index;


                $.get(link, function(data) {
                    $('.fancybox-ajax-container').replaceWith(data);
                    $.fancybox.hideLoading();
                    $('.fancybox-ajax-container .fancybox:'+(isFirst ? 'first' : 'last')).trigger('click');
                    try {
                        history.pushState({}, '', link.replace('&GALLERY_AJAX=Y', '').replace('GALLERY_AJAX=Y', ''));
                    } catch(e) {}

                });

                return false;
            }
        });
    }


    var items = [];
    $('.content a[href$=".jpg"] > img').each(function() {
        var a = $(this).parent()[0];
        if (!$(a).hasClass('fancybox')) {
            $(a).attr('rel', 'static_gallery');
            items.push(a);
        }
    });
    if ( $(items).length) {
        $(items).fancybox({
            helpers: { // чтобы при показе попапа не скроллилось к верху страницы
                overlay: {
                    locked: false
                }
            }
        });
    }

    /*iChek init */
    if ($('input[type="radio"], input[type="checkbox"]').length) {
        $('input[type="radio"], input[type="checkbox"]').iCheck({
         radioClass: 'iradio_ichek',
         checkboxClass: 'icheckbox_ichek'
         });
    }
    $('.mobile-menu-btn, .mobile-menu-close-btn').on('click', function() {

        if ($('.wrap-mobile-menu-scroll').is(':visible')) {
            //  $wrapContent.removeClass('wrap-content_menu-open');
            $('.wrap-mobile-menu-scroll').hide();
        } else {
            //  $wrapContent.addClass('wrap-content_menu-open');
            $('.wrap-mobile-menu-scroll').show();

            if ($('.wrap').height() < $('.mobile-menu-scroll .mobile-menu-scroll-content').height()) {
                if (!mScroll) {
                    mScroll = new iScroll('mobile-menu-scroll');
                }
            }

            if (isMobile()) {

                $('.wrap-mobile-menu-scroll, .mobile-menu-scroll').css( 'height', $(window).height() - 120);
                /*$('.wrap-mobile-menu-scroll, .mobile-menu-scroll').css({
                 'height': $(window).height()
                 });*/
            }
            if (mScroll) {
                mScroll.refresh();
            }
        }
        return false;
    });



    /* tabs */
    $('.calendar-tab-next').on('click', function() {
        var $holder         = $(this).closest('.calendar-tab');
        var $headHolder     = $holder.find('.calendar-tab-head');
        var $activeHeadBtn  = $headHolder.find('.calendar-tab-head_act');
        var $nextItem       = $activeHeadBtn.next();
        var tabId           = '';

        if ($nextItem.length) {
            $activeHeadBtn.removeClass('calendar-tab-head_act');
            $nextItem.addClass('calendar-tab-head_act');
            tabId = $nextItem.data('id');
        } else {
            $activeHeadBtn.removeClass('calendar-tab-head_act');
            $headHolder.find('li:first').addClass('calendar-tab-head_act');
            tabId = $headHolder.find('li:first').data('id');
        }

        $holder.find('.calendar-tab-item').removeClass('calendar-tab-item_act');
        $holder.find('.calendar-tab-item[data-id="'+tabId+'"]').addClass('calendar-tab-item_act');
        return false;
    });

    $('.calendar-tab-prev').on('click', function() {
        var $holder         = $(this).closest('.calendar-tab');
        var $headHolder     = $holder.find('.calendar-tab-head');
        var $activeHeadBtn  = $headHolder.find('.calendar-tab-head_act');
        var $prevItem       = $activeHeadBtn.prev();
        var tabId           = '';

        if ($prevItem.length) {
            $activeHeadBtn.removeClass('calendar-tab-head_act');
            $prevItem.addClass('calendar-tab-head_act');
            tabId = $prevItem.data('id');

        } else {
            $activeHeadBtn.removeClass('calendar-tab-head_act');
            $headHolder.find('li:last').addClass('calendar-tab-head_act');
            tabId = $headHolder.find('li:last').data('id');
        }

        $holder.find('.calendar-tab-item').removeClass('calendar-tab-item_act');
        $holder.find('.calendar-tab-item[data-id="'+tabId+'"]').addClass('calendar-tab-item_act');

        return false;
    });


    $('.thanks-list-next').on('click', function() {
        tabChange.next($(this), 'thanks-pane', 'thanks-list', 'thanks-list_act');
        colsAsideRight();
        return false;
    });

    $('.thanks-list-prev').on('click', function() {
        tabChange.prev($(this), 'thanks-pane', 'thanks-list', 'thanks-list_act');
        colsAsideRight();
        return false;
    });

    $('.calendar-tab-event-next').on('click', function() {
        tabChange.next($(this), 'wrpa-calendar-tab-event', 'calendar-tab-event', 'calendar-tab-event-item_act');
        return false;
    });

    $('.calendar-tab-event-prev').on('click', function() {
        tabChange.prev($(this), 'wrpa-calendar-tab-event', 'calendar-tab-event', 'calendar-tab-event-item_act');
        return false;
    });

    var tabChange = {
        next: function($el, holderClass, headHolderClass, actItemClass)  {
            var $holder         = $el.closest('.'+holderClass);
            var $headHolder     = $holder.find('.'+headHolderClass);
            var $activeHeadBtn  = $headHolder.find('.'+actItemClass);
            var $nextItem       = $activeHeadBtn.next();

            if ($nextItem.length) {
                $activeHeadBtn.removeClass(actItemClass);
                $nextItem.addClass(actItemClass);
            } else {
                $activeHeadBtn.removeClass(actItemClass);
                $headHolder.find('li:first').addClass(actItemClass);
            }

        },
        prev: function($el, holderClass, headHolderClass, actItemClass) {

            var $holder         = $el.closest('.'+holderClass);
            var $headHolder     = $holder.find('.'+headHolderClass);
            var $activeHeadBtn  = $headHolder.find('.'+actItemClass);
            var $prevItem       = $activeHeadBtn.prev();

            if ($prevItem.length) {
                $activeHeadBtn.removeClass(actItemClass);
                $prevItem.addClass(actItemClass);
            } else {
                $activeHeadBtn.removeClass(actItemClass);
                $headHolder.find('li:last').addClass(actItemClass);
            }
        }
    }

    colsAsideRight();

    $(window).resize(function() {
        if ($(this).width() > 768) {
            $('.wrap-content').removeClass('wrap-content_menu-open');
            $('.wrap-mobile-menu-scroll').hide();
        }
        if (isMobile()) {
            $('.wrap-mobile-menu-scroll, .mobile-menu-scroll').css({
                'height': $(this).height()
            });
            if (mScroll) {
                mScroll.refresh();
            }
        }
		
		$('.js--fixed-top').css('width', $('.js--fixed-top').parent('.content').width());
		$('.calculator-filter-top-pane').css('width', $('.js--fixed-top').parent('.content').width());

        setSearchWorkerPanelPosition();
        colsAsideRight();
    });

    function isMobile(){
        return (/iphone|ipod|android|blackberry/).test(navigator.userAgent.toLowerCase());
    }

    $('.item-sort-alphabetically > a').on('click', function(e) {
        //e.preventDefault();
        $('.sort-alphabetically-block').css('display','inline-block');
    });

    $(window).scroll(function () {
        setSearchWorkerPanelPosition();
    });

    if($('.item-sort-alphabetically').hasClass('active')){
        $('.sort-alphabetically-block').css('display', 'inline-block');
    }
    else{
        $('.sort-alphabetically-block').hide();
    }

    $('.item-sorting-workers').on('click', function (e) {
        if(!$(this).hasClass('active')){
            $('.item-sorting-workers.active').removeClass('active');
            $(this).addClass('active');
            if($(this).hasClass('item-sort-alphabetically')){
                //e.preventDefault();
                $('.sort-alphabetically-block').css('display', 'inline-block');
            }
            else{
                $('.sort-alphabetically-block').hide();
            }
        }
    });

    $(".js-more-unit-show").click(function() {
        var obT = $(this);

        var strID = obT.attr("data-id");
        $('#'+strID).show();
        obT.hide();

        return false;
    });
	
	if($('.js--fixed-top').length){
        var topPos = $('.js--fixed-top').offset().top - 20; 
    }
	$(window).on('scroll', function () {
        var top = $(document).scrollTop(),
            limitElementTop = $('.js--fixed-top__limit').offset().top,
            height = $('.js--fixed-top').outerHeight(),
			heightFilter = $('.calculator-filter-top-pane').outerHeight();

        if (top > topPos && top < limitElementTop - height - heightFilter) {
            $('.js--fixed-top').addClass('fixed').removeAttr("style"); 
			$('.js--fixed-top').css('width', $('.js--fixed-top').parent('.content').width());
			$('.calculator-filter-top-pane').css({
				'position': 'fixed',
				'top': $('.js--fixed-top').outerHeight(),
				'width': $('.js--fixed-top').parent('.content').width(),
				'background': '#fff'
			});
			$('.content').css('padding-top', height + heightFilter - 20);
        } else if (top > limitElementTop - height - heightFilter) {
            $('.js--fixed-top').removeClass('fixed').css({
                'position': 'absolute',
                'top': limitElementTop - height - heightFilter
            });
			$('.calculator-filter-top-pane').css({
				'position': 'absolute',				
                'top': limitElementTop - height
			})
			
        } else {
            $('.js--fixed-top').removeClass('fixed');
			$('.calculator-filter-top-pane').removeAttr("style"),
			$('.content').removeAttr("style")
        }
    });
});

function setSearchWorkerPanelPosition(){
    if($('.search-worker-pane').size()) {
        var panel = $('.search-worker-pane'),
            prev = panel.prev(),
            parent = panel.parent(),
            top = prev.length ? (prev.offset().top + prev.outerHeight()) : parent.offset().top,
            isFixed = $(window).scrollTop() > top;

        if (isFixed) {
            panel.next().css('margin-top', panel.outerHeight());
        } else {
            panel.next().css('margin-top', 0);
        }
        console.log(parent.width());

        panel.width(isFixed ? parent.width() : '100%').toggleClass('fixed', isFixed);
    }
}

function showModal(e){
    if(e){
        e.preventDefault();
    }
    $('.select-checkbox-result-block').find('input[type=checkbox]').removeAttr('checked').refresh();
    var i, vals = $('.select-worker').val() || [];
    for(i = 0; i < vals.length; i++){
        var input = $('.select-checkbox-result-block').find('[value=' + vals[i] +']');
        if(input.length){
            input.prop('checked', true).refresh();
            if(!input.parents('.level2').length){
                var level2 = input.parents('li').find('.level2');
                if(level2.length){
                    level2.find('input:checkbox').prop('checked', true).refresh();
                }
            }
        }
    }
	$('.select-checkbox-result-block').show();
}