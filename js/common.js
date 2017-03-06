var isIE=$.browser.msie,
	isIE6=isIE && $.browser.version=='6.0',
	isIE7=isIE && $.browser.version=='7.0',
	isIE8=isIE && $.browser.version=='8.0';
var isOpera=$.browser.opera;
var isMoz=$.browser.mozilla;
var isSafari=$.browser.safari;
var isChrome=$.browser.chrome;
var isWebkit=$.browser.webkit;
var isExpert=0;

String.prototype.left=function(len){
	if(len<=0) return this;
	return this.substr(0,len);
};
String.prototype.right=function(len){
	return this.substr(this.length-len);
};
String.prototype.repeat=function(len){
	var result='';
	for(var i=0;i<len;i++){
		result+=this;
	}
	return result;
};

//%2s,%2d,%2.2f
function sprintf(){
	var s=arguments[0] || '',r=[],c=0;
	for(var i=1;i<arguments.length;i++){
		r[i]=arguments[i];
	}

	return s.replace(/%([0-9.]+)?(s|d|f)/ig,function(a){
		c++;
		a=a.match(/([0-9.]+)|(s|d|f)/ig);
		if(a.length!=2){
			a[1]=a[0];
			a[0]=0;
		}
		a[1]=a[1].toLowerCase();
		if(a[1]=='f'){
			a=String(parseFloat(a[0])).split('.');
			a[0]=parseInt(a[0]);
			a[1]=parseInt(a[1]);
			var _r=String(parseFloat(r[c])).split('.'),f=_r[0].indexOf('-')!=-1;r[0]=(f?r[0].substr(1):r[0]);
			return((f?'-':'')+'0'.repeat(a[0]-_r[0].length)+_r[0]+(_r[1]?'.'+_r[1]+'0'.repeat(a[1]-_r[1].length):''));
		}else if(a[1]=='d'){
			a[0]=parseInt(a[0]);
			r[c]=parseInt(r[c]);
			return(r[c]<0?'-':'')+('0'.repeat(a[0]-String(r[c]).length)+(r[c]>0?r[c]:-r[c]));
		}else{
			a[0]=parseInt(a[0]);
			return(' '.repeat(a[0]-r[c].length)+r[c]);
		}
	});
};

if(!window.JSON){
	window.JSON={
		stringify:function(data){
			var self=this,ret;
			switch($.type(data)) {
				case 'object':
					var arr=[];
					$.each(data,function(k,v){
						arr.push(self.stringify(k)+':'+self.stringify(v));
					});
					ret='{'+arr.join(',')+'}';
					break;
				case 'array':
					var arr=[];
					$.each(data,function(k,v){
						arr.push(self.stringify(v));
					});
					ret=arr.join(',');
					break;
				case 'string':
					ret='"';
					var c;
					for(var i=0;i<data.length;i++){
						if(data.charCodeAt(i)>128) {
							c=escape(data.charAt(i)).replace('%u','\\u');
						} else {
							switch(data.charAt(i)) {
								case '\b':
									c='\\b';
									break;
								case '\f':
									c='\\f';
									break;
								case '\n':
									c='\\n';
									break;
								case '\r':
									c='\\r';
									break;
								case '\t':
									c='\\t';
									break;
								case '\'':
									c='\\\'';
									break;
								case '\\':
									c='\\\\';
									break;
								default:
									c=data.charAt(i);
							}
						}
						ret+=c;
					}
					ret+='"';
					break;
				default:
					ret=data+'';
					break;
			}
			return ret;
		},
		parse:function(data){
			try{
				return ( new Function( "return " + data ) )();
			}catch(e){
				$.error(e);
				return undefined;
			}
		}
	};
	window.JSON.encode=window.JSON.stringify;
	window.JSON.decode=window.JSON.parse;
};

$.URL2URI=function(url,looseMode){
	var o={
		key:['source','protocol','authority','userInfo','user','pass','host','port','relative','path','dir','file','query','anchor'],
		q:{
			name:'querys',
			parser:/(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser:{
			strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	},mode=(looseMode?'loose':'strict'),m=o.parser[mode].exec(url),uri={},i=14;

	while(i--){
		uri[o.key[i]]=m[i]||'';
	}

	uri[o.q.name]={};
	uri[o.key[12]].replace(o.q.parser,function($0,$1,$2){
		if($1){
			var grades=decodeURIComponent($1).replace(/\]/g,'').split('[');
			var prevQuerys=uri[o.q.name],querys=prevQuerys;
			var prevKey=grades.shift(),key=prevKey;
			var val=decodeURIComponent($2);
			while(grades.length) {
				querys=prevQuerys[prevKey];
				key=grades.shift();
				if(key===''){
					if(! $.isArray(querys)){
						prevQuerys[prevKey]=[];
						querys=prevQuerys[prevKey];
					}
					key=querys.length;
				} else {
					if(!$.isPlainObject(querys)){
						prevQuerys[prevKey]={};
						querys=prevQuerys[prevKey];
					}
				}
				prevKey=key;
				prevQuerys=querys;
			}
			querys[key]=val;
		}
	});

	return uri;
};
$.URI2URL=function(uri,isPath){
	var url=(uri.protocol?uri.protocol+'://':'')+uri.host;
	url+=(uri.port?':'+uri.port:'');
	uri.path=(isPath?uri.path:uri.dir+uri.file);
	url+=((uri.path.indexOf('/')!=0?'/':'')+uri.path);
	var querys = $.extend(true,{},uri.querys);
	delete querys.r;
	url+=(url.indexOf('?')>-1?'&':'?')+('r' in uri.querys?sprintf("r=%s&", uri.querys.r):'')+$.param(querys);
	url+=(uri.anchor?'#'+uri.anchor:'');
	return(url);
};

//随机获取min和max之间整数,不包括max
$.randInt=function(min,max){
	return Math.floor(Math.random()*(max-min)+min);
};

//Ajax响应数据预处理
$.ajaxPrepared=function(data,callback,isDialogCallBack){
	if(typeof(data)=='object' && typeof(data.message)=='string' && typeof(data.url)=='string' && typeof(data.status)=='boolean'){
		var dialogCallback=function(){
			if(isDialogCallBack && $.isFunction(callback)){
				callback(data);
			}else if(data.url){
				window.location.href=data.url;
			}
		};
		if(data.callback) {
			data.callback=new Function('data',data.callback);
		}
		if(data.eval) {
			data.eval=new Function('data',data.eval);
			if($.isFunction(data.eval)){
				data.eval(data);
				return;
			}
		}
		if(data.status){
			$.dialog.success(data.message,$.isFunction(data.callback)?function(){data.callback(data);}:dialogCallback);
		}else{
			$.dialog.warning(data.message,$.isFunction(data.callback)?function(){data.callback(data);}:dialogCallback);
		}
	}else{
		if($.isFunction(callback)){
			callback(data);
		}else if(window.console.error && window.console.log){
			window.console.error('jQuery window plugin Ajax request of response data format error!');
			window.console.log(data);
		}else{
			alert("Response Data Format is unknown.\nNot callback function for error!");
		}
	}
};

$.blogWindow=function(dom,isAdd){
	$.openWindow({title:(isAdd?'发表博客':'编辑博客'),'class':'blog',width:650,dom:dom});
	return false;
};
$.caseWindow=function(dom,isAdd){
	$.openWindow({title:isAdd?'发表案例':'编辑案例','class':'case',width:650,dom:dom});
	return false;
};
$.docWindow=function(dom,isAdd){
	$.openWindow({title:isAdd?'发表文档':'编辑文档','class':'doc',width:700,dom:dom});
	return false;
};
$.postWindow=function(dom,isAdd){
	$.openWindow({title:isAdd?'发布帖子':'编辑帖子','class':'post',width:650,dom:dom});
	return false;
};
$.postGroupWindow=function(dom,isAdd){
	$.openWindow({title:isAdd?'添加帖子分类':'编辑帖子分类','class':'group',width:500,dom:dom});
	return false;
};
$.postReplyWindow=function(dom,isEdit){
	$.openWindow({title:isEdit?'编辑回帖':'回帖','class':'group',width:650,dom:dom});
	return false;
};
$.postReplyReplyWindow=function(dom){
	$.openWindow({title:'回复','class':'group',width:650,dom:dom});
	return false;
};
$.postOptionsWindow=function(dom,title){
	$.openWindow({title:title,'class':'group',width:220,dom:dom});
	return false;
};
$.qaWindow=function(dom,isAdd,w){
	w = w?w:600;
	var obj={title:isAdd?'我要提问':'编辑问题','class':'qa',width:w};
	if($.type(dom)=='object'){
		obj.dom=dom;
	} else {
		obj.url=dom;
	}
	$.openWindow(obj);
	return false;
};
$.favWindow=function(dom,isAdd,syncClass){
	$.openWindow({title:isAdd?'编辑收藏':'添加收藏','class':'fav',width:500,dom:dom,syncClass:syncClass?true:false});
	return false;
};
$.ansSnspWindow=function(dom){
	$.openWindow({title:'确认设置为官方答案？','class':'qa',width:350,dom:dom});
	return false;
};

$.weiboWindow=function(dom,isAdd){
	$.openWindow({title:'转发','class':'weibo',width:650,dom:dom});
	return false;
};

$.favgroupWindow=function(dom,isAdd){
	$.openWindow({title:isAdd?'添加收藏分组':'编辑收藏分组','class':'favgrp',dom:dom,width:400});
	return false;
};

$.submitWindow=function(dom,w){
	w = w?w:360;
	$.openWindow({title:'投稿','class':'submit',dom:dom,width:w});
	return false;
};
$.photoWindow=function(dom){
	$.openWindow({title:'修改头像','class':'photo',dom:dom,width:630});
	return false;
};
$.friendWindow=function(dom){
	$.openWindow({title:'选择好友','class':'friend',dom:dom,width:600});
	return false;
};
$.groupWindow=function(dom){
	$.openWindow({title:'添加分组','class':'group',dom:dom,width:400});
	return false;
};
$.quoteWindow=function(dom){
	$.openWindow({title:'引用资源','class':'quote',dom:dom,width:400});
	return false;
};
$.exposeWindow=function(dom){
	$.openWindow({title:'举报内容','class':'group',dom:dom,width:500});
	return false;
};
$.leaderWindow=function(dom){
	$.openWindow({title:'选择领导','class':'case',dom:dom,width:500});
	return false;
};
$.subWindow=function(dom,isAdd){
	$.openWindow({title:isAdd?'创建社区':'编辑社区','class':'community',dom:dom,width:565});
	return false;
};
$.diyWindow=function(dom,isAdd){
	$.openWindow({title:isAdd?'创建模板':'编辑模板','class':'community',dom:dom,width:565});
	return false;
};

$.confirmDelete=function(dom,callback,isPost){
	$.dialog.prompt('确定要删除该信息吗?',function(){
		$(dom).dialog(dom.href,callback,isPost);
	});
	return false;
};

$.ajaxLoginRequired=function(){
	$('#loginRequired').parent().html('');
	$.dialog.warning('请先登录再进行操作',function(){location.reload();});
};

$.fillinWindow=function(dom){
	$.openWindow({title:'补充说明','class':'group',dom:dom,width:400});
	return false;
};

$.isJoinWindow=function(myurl){
	$.openWindow({title:'加入社区',width:400,url:myurl,callback:function(){
		this.windowTitle.hide();
		this.windowHeader.css({height:'auto',overflow:'visible',background:'transparent'});
	}});
	return false;
};

$.IEFixBugCount=0;
$.IEFixBug=function(isShow){
	var _html = $('html');
	var _body = $('body');
	if(isShow) {
		$.IEFixBugCount++;
		if(isIE) {
			$('#ie-select-bug').show();
			if(isIE6){ 
				if(!_html.is('.body-noscorllbar'))  _html.addClass('body-noscorllbar');
				if(!_body.is('.body-noscorllbar'))  _body.addClass('body-noscorllbar'); 
			}else if(isIE7){
				if(!_html.is('.body-noscorllbar'))  _html.addClass('body-noscorllbar');
				if(!_body.is('.body-noscorllbar'))  _body.addClass('body-noscorllbar'); 
			}
				
		}
		$('html,body').css('overflow','hidden');
	} else {
		if($.IEFixBugCount>0) {
			$.IEFixBugCount--;
		}
		if($.IEFixBugCount==0) {
			if(isIE) {
				$('#ie-select-bug').hide();
				if(_html.is('.body-noscorllbar'))  _html.removeClass('body-noscorllbar');
				if(_body.is('.body-noscorllbar'))  _body.removeClass('body-noscorllbar'); 
			}
			$('html,body').css('overflow','');
		}
	}
};

//暂时屏蔽获取积分后的弹出提醒
//$.scoreDialog=function(){
//	var wealth=parseFloat($.cookie('ScoreWealth'));
//	var exp=parseFloat($.cookie('ScoreExp'));
//	if(wealth || exp) {
//		$.integral.show({fortune:wealth,experience:exp});
//		$.cookie('ScoreWealth', null);
//		$.cookie('ScoreExp', null);
//	}
//};

$(function(){
	var dom=$('html,body');
	$.each($.browser,function(k,v){
		if(k=='version'){
			return;
		}
		dom.addClass(k+'_all');
		dom.addClass(k+'_'+parseInt($.browser.version));
	});

	if(isIE){
		$('<iframe id="ie-select-bug" scrolling="no" border="0"/>').appendTo(document.body).css({
			position:isIE6||isIE7?'absolute':'fixed',
			left:0,
			top:0,
			width:isIE6||isIE7?$(document.body).width():'100%',
			height:isIE6||isIE7?$(document.body).height():'100%',
			zIndex:666
		}).fadeTo(0,0).hide();
	}

	var loadingMask=$('<div id="loadingMask"></div>').fadeTo(0,0.0).appendTo(document.body).hide();
	$('<div id="loadingContainer">加载中…</div>').appendTo(document.body).ajaxStart(function(){
		//$.IEFixBug(true);
		loadingMask.show();
		$(this).float('center').show();
	}).ajaxStop(function(){
		//$.IEFixBug(false);
		loadingMask.hide();
		$(this).hide();
	}).ajaxError(function(e,xhr,s,err,thwn){
		$.dialog.error('请求地址【'+s.url+'】错误！');
	}).hide();
	
	//setInterval($.scoreDialog,100);
	
	$('.ke-content').each(function(){
		/*$('table',this).each(function(){
			var cp=parseInt($(this).attr('cellpadding'));
			if(cp>0){
				$('td,th',this).css('padding',cp+'px');
			}
			var css={};
			css.border=$(this).attr('border')+'px '+($(this).attr('bordercolor')?$(this).attr('bordercolor'):'black')+' '+($(this).attr('borderstyle')?$(this).attr('borderstyle'):'solid');
			css.borderSpacing=parseInt($(this).attr('cellspacing'))+'px';
			$(this).css(css);
			$('td,th',this).css(css);
		});*/
		
		if(isIE6){
			var w=$(this).width();
			$('img',this).load(function(){
				if($(this).width()>w && w>0){
					$(this).width(w);
				}
			}).load();
		}
		if(isIE7){
			var w=$(this).width();
			$('img',this).load(function(){
				if($(this).width()>w && w>0){
					$(this).width(w);
				}
			}).load();
		}
	});
});