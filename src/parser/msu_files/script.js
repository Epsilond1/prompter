$(function() {
	//var obCalendarContainer = $(".aside_right #calendar-tab-head");
	//obCalendarContainer.find("li").removeClass("calendar-tab-head_act");
	//
	//var intMonthLiCnt = obCalendarContainer.find("li").size();
	//var intRand = getRandomInt(0, intMonthLiCnt-1);
	//
	//var obHeadLi = obCalendarContainer.find("li:eq("+intRand+")");
	//var strCode = obHeadLi.attr("data-id");
	//obHeadLi.addClass("calendar-tab-head_act");
	//
	//var obCalendarContentContainer = $(".aside_right #calendar-tab-content");
	//obCalendarContentContainer.find("div.calendar-tab-item_act").removeClass("calendar-tab-item_act");
	//
	//var obCalendarContentCurrent = obCalendarContentContainer.find("div[data-id='"+strCode+"']");
	//obCalendarContentCurrent.addClass("calendar-tab-item_act");
	//
	//var intContentLiCnt = obCalendarContentCurrent.find("li").size();
	//intRand = getRandomInt(0, intContentLiCnt-1);
	//obCalendarContentCurrent.find("li.calendar-tab-event-item_act").removeClass("calendar-tab-event-item_act");
	//obCalendarContentCurrent.find("li:eq("+intRand+")").addClass("calendar-tab-event-item_act");
})

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}