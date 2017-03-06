/*
*  ====================================
*基础工具
*/
;(function(window){
	function checkTime(num){
		var n=Number(num);
		if(n<10) n="0"+n;
		return n;
	}

	var Util={
		formatDate:function(date){
			var h=date.getHours();
			var m=date.getMinutes();
			var s=date.getSeconds();
			return checkTime(h)+":"+checkTime(m)+":"+checkTime(s);
		}

	};
	var i18n=function(key){
		return lang[key] || key;
	}
	window.Util=Util;
	window.i18n=i18n;

})(window);

/*日期格式判断*/
(function(){
	var datepicker=$.fn.datepicker;
		$.fn.datepicker=function(){
			datepicker.apply(this,arguments);
			return $(this).blur(function(){
				var _val=$(this).val();
				if(!_val.length){
					return;
				}
				var inst=$.datepicker._getInst(this);
				var date;
				try{
					date=$.datepicker.parseDate($.datepicker._get(inst,'dateFormat'),
					_val,
					$.datepicker._getFormatConfig(inst));
					if(!date){
						inst.input.val('');
						alert(i18n("inputmsg.check.dateError"));
					}
				}catch(err){
					inst.input.val('');
					alert(i18n("inputmsg.check.dateError"));
				}
			});
		}

})(jQuery);

;$(function(){
	// index.html
	// 头部Nav 点击事件
	var headerNav=$("#j-header-nav .items");
	headerNav.click(function(){
		headerNav.removeClass("z-click");
		$(this).addClass("z-click");
		//TODO
		var mainIndex=$(this).index();
		var _indexMain=$(".index_main").children();
			_indexMain.hide();
		switch (mainIndex) {
			case 0:
				$('.index_home').show();
				break;	
			case 1:
			location.href="form.html";
				// $('.index_budget').show();
				break;
			case 2:
				$('.index_budget2').show();
				break;	
			case 3:
				$('.index_funds').show();
				break;	
			case 4:
				$('.index_police').show();
				break;
			case 5:
				$('.index_car').show();
				break;
			case 6:
				$('.index_warehouse').show();
				break;
			case 7:
				$('.index_system').show();
			break;
			default:
				$('.index_home').show();
				break;
		}

	});

/**
*===============
* form 表单 模拟下拉框
*/
 var _selecBox=$(".j-selectBox");
 
 _selecBox.click(function(){
 	var _width=$(this).width()+2;
 	var _results=$(this).children('.selectBox_results');
 	_results.width(_width);
 	if(_results.css('display')=="none"){
 		$('.selectBox_results').hide();
 		_results.show();
 	}

 });
 // selectBox 点击事件
 	$('.selectBox_results .items').live('click',function(){
 		var _value=$(this).text();
 		$(this).parents(".j-selectBox").find(".selectBox_show").text(_value);
 		$(this).parent(".selectBox_results").hide();
 	})

 // 点击非下拉框区域 下拉列表隐藏
 $('body').bind('click',function(event){
 		var event=event || window.event;
 	if(!$(event.target).closest('.j-opW').length){
 			_selecBox.children('.selectBox_results').hide();
 	}
 });

 // 选择按钮
 $(".j-JBSelect").click(function(){
 		$(this).toggleClass("choose unchoose");
 });

});