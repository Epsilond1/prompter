;(function($) {

	var body = $('body');
	var LANG, ORFOMODAL;
	var l10n = {
		'ru' : {
			'modalTitle'	: 'Орфографическая ошибка в тексте',
			'modalQuestion'	: 'Послать сообщение об ошибке автору?<br>Ваш браузер останется на той же странице.',
			'modalCommentPlaceholder'	: 'Комментарий для автора (необязательно)',
			'modalClose'	: 'Отмена',
			'modalOk'		: 'Отправить'
		},
		'en' : {
			'modalTitle'	: 'Spelling mistake or a typo in a text',
			'modalQuestion'	: 'Do you wish to send an error message to the author?<br>Your browser will stay on the same page.',
			'modalCommentPlaceholder'	: 'Comment for the author (optional)',
			'modalClose'	: 'Cancel',
			'modalOk'		: 'Send'
		}
	};

	var label = function (n) {
		return l10n[LANG][n] || l10n.ru[n] || n;
	}
	entityMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;'},
	clearText = function(txt){
		if (/\S/.test(txt)) {
			return txt.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').replace(/[&<>"'\/]/g, function (s) {
				return entityMap[s];
			});
		}
	},
	forbiddenTags = ['script', 'style', 'frame', 'iframe', 'meta', 'link', 'img'],
	extractTextFromNode = function(n){
		for (var j = 0; j < forbiddenTags.length; j++) {
			$(forbiddenTags[j], n).remove();
		}
		var nHtml = n.innerHTML.replace(/</gm, ' <');
		var txt = (new DOMParser()).parseFromString(nHtml, 'text/html').body.innerText || '';
		txt = txt.replace(/(\n|\r)/gm, ' ').replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
		return txt;
	},
	extractTextFromRange = function(range){
		var result = '';
		try {
			var clonedContent = range.cloneContents();
			var nodes = clonedContent.children || clonedContent.childNodes;
			var texts = [];
			for (var i = 0, len = nodes.length; i < len; i++) {
				var txt = extractTextFromNode(nodes[i]);
				if (/\S/.test(txt)) {
					texts.push(txt);
				}
			}
			result = texts.join(' ');
		} catch(e) {
			if (window.console) {
				console.error(e);
			}
			result = clearText(range.toString());
		}
		return result;
	},
	getSelectionText = function() {
		var text = '';
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != 'Control') {
			text = document.selection.createRange().text;
		}
		return clearText(text);
	},
	getSelectedPhrase = function(){
		try{
			var nodes = [], texts = [], selection;
		    if (window.getSelection) {
		    	selection = getSelection();
				for (var i = 0, len = selection.rangeCount; i < len; i++) {
					var rangeObj = selection.getRangeAt(i),
						startContainer = rangeObj.startContainer,
						endContainer = rangeObj.endContainer;
					if (startContainer) {
						nodes.push(startContainer.nodeName === "#text" ? startContainer.parentNode : startContainer);
					}
					if (endContainer) {
						nodes.push(endContainer.nodeName === "#text" ? endContainer.parentNode : endContainer);
					}
				}
				if (nodes.length === 0) {
					nodes = [selection.anchorNode];
				}
		    }
		    if (!nodes.length && document.selection) {
		    	selection = document.selection;
		    	var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
		    	var node = range.commonAncestorContainer ? range.commonAncestorContainer :
		    			range.parentElement ? range.parentElement() : range.item(0);
				if (node) {
					nodes = [node];
				}
		    }

			for (var i = 0, nLen = nodes.length; i < nLen; i++) {
				var node = nodes[i];
				if (node.nodeName == "#text") {
					node = node.parentNode;
				}
				try {
					texts.push(extractTextFromNode(node));
				} catch(e) {
					if (window.console) {
						console.error(e);
					}
					texts.push($(node).text());
				}
			}
			return texts.join(' ');
		} catch (e) {
			if (window.console) {
				console.error(e);
			}
		}
	},
	getAroundSelectedText = function(containerEl){
		// Get all unselected text (return {before:N1,after:N2})
		// http://stackoverflow.com/a/9000719
		if (!containerEl) {
			containerEl = body.get(0);
		}
		var sel, range, tempRange, before = "", after = "";
	    if (typeof window.getSelection != "undefined") {
	        sel = window.getSelection();
	        if (sel.rangeCount) {
	            range = sel.getRangeAt(0);
	        } else {
	            range = document.createRange();
	            range.collapse(true);
	        }
	        tempRange = document.createRange();
	        tempRange.selectNodeContents(containerEl);
	        tempRange.setEnd(range.startContainer, range.startOffset);
	        before = extractTextFromRange(tempRange);

	        tempRange.selectNodeContents(containerEl);
	        tempRange.setStart(range.endContainer, range.endOffset);
	        after = extractTextFromRange(tempRange);
	    } else if ((sel = document.selection) && sel.type != "Control") {
	        range = sel.createRange();
	        tempRange = document.body.createTextRange();
	        tempRange.moveToElementText(containerEl);
	        tempRange.setEndPoint("EndToStart", range);
	        before = clearText(tempRange.text || '');

	        tempRange.moveToElementText(containerEl);
	        tempRange.setEndPoint("StartToEnd", range);
	        after = clearText(tempRange.text || '');
	    }

	    return {'before': before, 'after': after};
	},
	displayModal = function(drama){
		var html = '<div class="orfomodal orfofade orfoin" tabindex="-1" style="display: block;">\
		    <div class="orfomodal-dialog">\
		      <div class="orfomodal-content">\
		        <div class="orfomodal-header">\
		          <h4 class="orfomodal-title">' + label('modalTitle') + '</h4>\
		        </div>\
		        <div class="orfomodal-body">\
					<div class="drama">&laquo;' + drama + '&raquo;</div>\
					<div>' + label('modalQuestion') + '</div>\
					<input placeholder="' + label('modalCommentPlaceholder') + '" name="comment" type="text">\
		        </div>\
		        <div class="orfomodal-footer">\
		          <button type="button" class="btn" role="close">' + label('modalClose') + '</button>\
		          <button type="button" class="btn" role="submit">' + label('modalOk') + '</button>\
		        </div>\
		      </div>\
		    </div>\
		  </div>\
		'.replace(/(\n|\r|\r\n)/gm, '').replace(/\s+/g, ' ');

		ORFOMODAL = $(html);
		body.addClass('orfomodal-open').append(ORFOMODAL);
		return ORFOMODAL;
	},
	hideModal = function(){
		body.removeClass('orfomodal-open');
		if (ORFOMODAL && ORFOMODAL.length > 0) {
			ORFOMODAL.remove();
		}
	};

	$.fn.hseOrfo = function(opt) {
		LANG = (opt || (opt = {})).lang || 'ru';

		if(body.data('hseOrfoDidInit')) return;
		body.data('hseOrfoDidInit', true);

	    /**
		 * Listener 'Ctrl/Cmd + Enter' pressed
		 *		detect selection
		 *		open modal window when
		 *		sending notification
	     */
		body.on('keydown', function (e) {
	        if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
				var text = getSelectionText();
				if (text !== undefined && /\S/.test(text) && text.length > 1) {
					var phrase = getSelectedPhrase(),
						aroundText = getAroundSelectedText(),
						aroundTextStart = aroundText.before.slice(-50),
						aroundTextEnd = aroundText.after.slice(0, 50),
						previewText = '&hellip;' + aroundTextStart + ' <strong>' + text + '</strong> ' + aroundTextEnd + '&hellip;';

						displayModal(previewText).on('click', 'button[role="close"]', function(){
							hideModal();
						}).on('click', 'button[role="submit"]', function(){
							$(this).prop('disable', true);
							var data = {
								'url'		: window.location.toString(),
								'mistake'	: text,
								'phrase'	: phrase,
								'start'		: aroundTextStart,
								'end'		: aroundTextEnd,
								'comment'	: $(this).closest('.orfomodal').find('input[name="comment"]').val()
							};
							$.post('/api/spelling-mistake', data)
							.always(function(){
								hideModal();
							})
							.fail(function(){
								if (window.console) {
									console.error(arguments);
								}
							});
						});
				}
	        }
	    });

		/**
		 * Listener "ESC" pressed
		 *		hide modal window when ESC pressed
		 */
	    body.keyup(function(e) {
			if (e.keyCode == 27) {
				hideModal();
			}
	    });

		//	add specific orfomodal css
		$('head').first().append('<style type="text/css">.orfofade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.orfofade.orfoin{opacity:1}.orfomodal-open{overflow:hidden}.orfomodal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1050;display:none;overflow:hidden;-webkit-overflow-scrolling:touch;outline:0}.orfomodal.orfofade .orfomodal-dialog{-webkit-transition:-webkit-transform .3s ease-out;-o-transition:-o-transform .3s ease-out;transition:transform .3s ease-out;-webkit-transform:translate(0,-25%);-ms-transform:translate(0,-25%);-o-transform:translate(0,-25%);transform:translate(0,-25%)}.orfomodal.orfoin .orfomodal-dialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);-o-transform:translate(0,0);transform:translate(0,0)}.orfomodal-open .orfomodal{overflow-x:hidden;overflow-y:auto}.orfomodal-dialog{position:relative;width:auto;margin:10px}.orfomodal-content{position:relative;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;outline:0;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5)}.orfomodal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;background-color:#000}.orfomodal-backdrop.orfofade{filter:alpha(opacity=0);opacity:0}.orfomodal-backdrop.orfoin{filter:alpha(opacity=50);opacity:.5}.orfomodal-header{min-height:16.42857143px;padding:10px;border-bottom:1px solid #e5e5e5;background-color:#d5d5d5}.orfomodal-title{margin:0;line-height:1.42857143;padding:0}.orfomodal-body{position:relative;padding:10px;font-size:12px;background-color:#f6f6f6}.orfomodal-footer{padding:10px;text-align:right;border-top:1px solid #e5e5e5;background-color:#f6f6f6}.orfomodal-footer .btn + .btn{margin-bottom:0;margin-left:5px}.orfomodal-footer .btn-group .btn + .btn{margin-left:-1px}.orfomodal-footer .btn-block + .btn-block{margin-left:0}.orfomodal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.orfomodal-dialog{width:500px;margin:30px auto}.orfomodal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);box-shadow:0 5px 15px rgba(0,0,0,.5)}.orfomodal-body .drama{font-weight:700;margin-bottom:1em}.orfomodal-body .drama strong{color:red}.orfomodal-body input{display:block;width:95%;margin-top:.5em}.orfomodal-footer .btn{cursor:pointer;background-color:#fff;font-size:12px;border:1px solid #d5d5d5;padding:5px 15px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px}.orfomodal-footer .btn:hover{color:#007ac5}.orfomodal-footer:before,.orfomodal-footer:after{display:table;content:" "}.orfomodal-footer:after{clear:both}</style>');
	};
})(jQuery);
