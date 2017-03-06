$(function(){
// 设置 diy区域高度
var leftHeight=$(".form_main_content .diy_sider_wrap").height();

$(".diy_main").css('min-height',leftHeight);

// 开始拖动源时产生的事件句柄
function startHandler(e,t) {
	t.helper.width($(this).width());
}
// 拖动入目标时产生的事件句柄
function dragHandler(e,t) {
	t.helper.width($(this).width());
}
// 绑定排序源可放置的目录
function bindSortable(items,connectwith){
	$(items).sortable({
		connectWith: connectwith,
		handle: ".drag",
		tolerance: 'pointer',
		opacity: .35,
		start: startHandler,
		drag: dragHandler,
		stop: function (e, t) {
			window.isUpdate=true;
			var isDateEle=t.item.find(".j-datepicker");
			if(isDateEle){
				isDateEle.datepicker();
			}
			
		}
	});
}

//绑定从工具中添加（拖放）布局
$(".toolbar_list .j-lyrow").draggable({
	connectToSortable: ".j-root",
	helper: "clone",
	handle: ".drag",
	start: startHandler,
	drag: dragHandler,
	stop: function(e, t) {

		bindSortable(".j-root .j-column",".j-root .j-column");
	}
});

// 布局排序
bindSortable(".j-root",".j-root");
// 布局的列中的组件排序、列与列之间相互移入与移出
bindSortable(".j-root .j-column",".j-root .j-column");
//绑定从工具中添加（拖放）组件
$(".toolbar_list .j-widget").draggable({
	connectToSortable: ".j-root .j-column",
	helper: "clone",
	handle: ".drag",
	start: startHandler,
	drag: dragHandler
});
// 删除事件
$(".j-root .j-remove").live('click',function(){
	window.isUpdate=true;
	$(this).parentsUntil("[type]").parent().remove();
});
window.onbeforeunload=function(){
	if(window.isUpdate){
		// return '页面配置信息有变更';
	}
}


});
