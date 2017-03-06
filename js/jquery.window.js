/*
功能:窗口
作者:BaoCai Zhang
邮箱:talent518@live.cn
更新时间:2009年12月7日 星期一 17:30:01

实例:
	$('#product img').imagePreview();
	$('#product a').imagePreview();
*/

;(function($){

$(window).resize(function(event){
	$('.window-wrap:visible').each(function(){
		var win=$(this).data('window');
		if(win){
			win.resize();
		}
	});
});
if(isIE6){
	$(window).scroll(function(){
		$('.window-wrap:visible').float('center');
	});
}

var $get=function(url,data,callback){
	if(data){
		data.ajax=1;
		$.post(url,data,function(ret){
			$.ajaxPrepared(ret,callback,true);
		});
	}else{
		$.get(url,{ajax:1},function(ret){
			$.ajaxPrepared(ret,callback,true);
		});
	}
};

//初始化窗口为Object对象
$.window=function(options){
	if($.isFunction(this)){
		return new $.window(options);
	}
	this.options=$.extend({},$.window.defaultSetting,options);
	if(this.options.title && (this.options.content || this.options.url)){
		this.init();
		this.open();
		if(!this.options.content){
			this.refresh();
		}
	}else{
		alert('打开的窗口错误，窗口标题，（窗口内容或URL）不能为空！');
	}
	return this;
};

$.window.prototype={
	windowMask:null,//半透明背景
	windowWrap:null,//窗口容器
	windowHeader:null,//窗口头部
	windowTitle:null,//窗口标题
	windowClose:null,//窗口关闭按钮
	windowRefresh:null,//窗口刷新按钮
	windowContent:null,//窗口内容
	options:{},
	isOpened:false,
	init:function(){//初始化窗口
		 
		this.windowMask=$('<div class="window-mask"></div>').appendTo(document.body);
		this.windowWrap=$('<div class="window-wrap"></div>').appendTo(document.body);
		this.windowHeader=$('<div class="window-header"></div>').appendTo(this.windowWrap);
		this.windowTitle=$('<div class="window-title"></div>').appendTo(this.windowHeader);
		this.windowClose=$('<div class="window-close" title="关闭">关闭</div>').insertBefore(this.windowTitle);
		this.windowRefresh=$('<div class="window-refresh" title="刷新">刷新</div>').insertBefore(this.windowTitle);
		this.windowContent=$('<div class="window-content"></div>').appendTo(this.windowWrap);
		this.scrollWindow = this.windowContent;

		var $this=this;

		this.windowWrap.data('window',this).attr('windowIndex',$.window.count++).hide().draggable({handle:this.windowHeader});
		this.windowRefresh.hover(function(){
			$(this).addClass('hover');
		},function(){
			$(this).removeClass('hover');
		}).click(function(){
			$this.refresh();
		});

		this.windowClose.hover(function(){
			$(this).addClass('hover');
		},function(){
			$(this).removeClass('hover');
		}).click(function(){
			$this.close();
		});
		
		if(this.options.scrollWindow) {
			this.scrollWindow = $(this.options.scrollWindow);
		}

		this.windowMask.hide();
		return this;
	},open:function(){//打开窗口
	 
		if(this.isOpened){
			return this;
		}
		this.isOpened=true;
		this.windowWrap.width(this.options.width);
		this.windowTitle.html(this.options.title);
		this.windowContent.html(this.options.content);

		var $this=this; 
		setTimeout(function(){
			$.IEFixBug(true);
			$this.windowMask.show().css('cursor','default');
			$this.windowWrap.show();
			$this.resize();
		},isIE6?500:100);

		this.options.callback.call(this);
		return this;
	},refresh:function(){
		if(!this.options.url)
			return this;
		var $this=this;
		$get($this.options.url,$this.options.data,function(content){
			//if($this.options.content==content)
			//	return;
			$this.options.content=content;
			$this.isOpened=false;
			$this.open();
		});
		return this;
	},resize:function(){//调整窗口
		var scrollTop = this.scrollWindow.scrollTop();
		
		if(this.options.width == '100%') {
			var width = $(window).width() - 40;
			this.windowWrap.width(width);
			this.windowContent.width(width).css({overflowX:'auto'});
		}
		
		if(this.options.height == '100%') {
			var height = $(window).height() - 40;
			this.windowWrap.height(height);
			this.windowContent.height(height - this.windowHeader.outerHeight()).css({overflowY:'auto'});
		} else {
			this.windowWrap.height('auto');
			this.windowContent.height('auto');
			if(this.windowWrap.height()>$(window).height()-40){
				this.windowContent.height($(window).height()-40-this.windowHeader.outerHeight());
				//this.windowWrap.height('auto');
			}else{ 
				//this.windowContent.css({overflow:'hidden',overflowX:'hidden',overflowY:'hidden'});
			}
		}
		
		this.windowWrap.float('center');
		
		this.scrollWindow.scrollTop(scrollTop);
		
		this.options.resize.call(this);
		return this;
	},close:function(callback){//关闭窗口
		var $this=this;

		this.windowMask.hide();
		this.windowWrap.animate({left:$(window).width()/2,top:$(window).height()/2,width:0,height:0},200,'',function(){
			$this.windowMask.remove();
			$this.windowWrap.remove();
			$.IEFixBug(false);
			if($.isFunction(callback)){
				callback.call($this);
			}
			$this.options.close.call($this);
			$this=null;
		});
		if(this.options.dom){
			$(this.options.dom).data('win-opt',null);
		}
	},setOpt:function(name,value){
		var options={};
		if(typeof(name)=='object'){
			options=name;
		}else{
			options[name]=value;
		}
		this.options=$.extend(true,{},this.options,options);
		this.open();
		return this;
	}
};

$.window.defaultSetting={width:600,callback:function(){},resize:function(){},close:function(){}};
$.window.count=0;
$.window.openeds={};

$.openWindow=function(options){
	var opts=$.extend({close:function(){}},options);
	if(opts.dom){
		if(typeof(opts.dom)=='object') {
			opts.url=$(opts.dom).get(0).href;
			if($(opts.dom).data('win-opt')){
				return;
			}
		} else {
			opts.url=opts.dom;
			delete opts.dom;
		}
	}
	if(!opts.url){
		alert('未指定窗口内容URL');
		return;
	}
	
	if($.window.openeds[opts.url]) {
		return;
	}
	$.window.openeds[opts.url]=true;
	opts._close=opts.close;
	opts.close=function(){
		$.window.openeds[opts.url]=false;
		opts._close.call(this);
	};
	
	if(opts['class']){
		var callback=opts.callback;
		opts.callback=function(){
			this.windowWrap.addClass(opts['class']+'-window');
			if($.isFunction(callback)){
				callback.call(this);
			}
		};
	}

	if(opts.dom){
		$(opts.dom).data('win-opt',options);
		$(opts.dom).addClass('windowUsed');
	}
	$get(opts.url,opts.data,function(content){
		if(typeof(content)=='object'){
			var data=content;
			var dom=opts.dom?$(opts.dom):false;
			if(data.url){
				window.location.href=data.url;
			}else if(data.text && dom){
				dom.text(data.text);
			}else if(data.html && dom){
				dom.html(data.html);
			}else if(data.replace && dom){
				dom.replaceWith(data.replace);
			}else if(data.parent && dom){
				dom.parent().html(data.parent);
			}else if(data.parentParent && dom){
				dom.parent().parent().html(data.parentParent);
			}
			$(opts.dom).data('win-opt',null);
			opts.close();
		}else{
			opts.content=content;
			$.window(opts);
			$(opts.dom).removeClass('windowUsed').addClass('windowOpened');
		}
	});
};

//向元素添加单击事件[元素必须包括title和href属性]
// $('a').window({width:400,callback:function(){alert('open window success');}});

$.fn.window=function(options){
	$(this).each(function(){
		var data={};
		if($(this).attr('width'))
			data.width=parseInt($(this).attr('width'));
		$(this).data('options',$.extend({},data,options));
	}).unbind('click').bind('click',function(){
		if(this.href==window.location.href+'#') return false;
		var settings=$.extend({title:this.title},$(this).data('options'),{dom:this});
		$.openWindow(settings);
		return false;
	});
	return this;
};

$.fn.getWindow=function(){
	var winWrap=$(this).parents('.window-wrap');
	var winChild=winWrap.children('.window-header,.window-content');
	return(winChild.size()==2?winWrap.data('window'):false);//{options:{},init:function(){},open:function(){},resize:function(){},close:function(){},setOpt:function(){}}
};

})(jQuery);