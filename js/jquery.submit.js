/**
* $('#submit').submit({
		url: url,// 表单提交的url地址
		callback:function(){}// 成功后的操作
	});
*/
$.fn.serializeObject = function()    
{    
   var o = {};    
   var a = this.serializeArray();    
   $.each(a, function() {    
       if (o[this.name]) {    
           if (!o[this.name].push) {    
               o[this.name] = [o[this.name]];    
           }    
           o[this.name].push(this.value || '');    
       } else {    
           o[this.name] = this.value || '';    
       }    
   });    
   return o;    
}; 
;(function($,undefined){

		var JBSubmit=function(ele,options){
				this.element=ele;
				this.defaults={
					url:'http://192.168.1.130:8088/CBXM/queryUser.ajax',
					message:'REQ_MESSAGE={"REQ_HEAD":{"TRAN_SUCCESS":"","TRAN_ID":""},"REQ_BODY":'
				};
				this.setting=$.extend({},this.defaults,options);
		}

		JBSubmit.prototype={
			submitEvent:function(callback){
				var that=this;
				var checkSubmitFlg = true; // 防止重复提交
				return this.element.click(function(){
					if(checkSubmitFlg){
						checkSubmitFlg=false;
							// 获取form表单
							var form=$(this).parents('form');
							var actionUrl=form.attr('action');
							var url=that.setting.url !='' ? that.setting.url:actionUrl;
							var arrForm=form.serializeArray();
							var jsonInfo= form.serializeObject();
							
							var data=that.setting.message+JSON.stringify(jsonInfo)+"}";
							
								$.ajax({
								type:'post',
								dataType:'json',
								data:data,
								url:url,
								success:function(data){
										// 成功后操作
										callback(data);
										checkSubmitFlg=true;
									},
								error:function(){
									checkSubmitFlg=true;
								}
							});
					}
					checkSubmitFlg=false;
				});
			}

		}
		
		$.fn.submit=function(options){
			var jbSubmit=new JBSubmit(this,options);
			var setting=$.extend({},{callback:function(){}},options);
				if($.isFunction(setting.callback)){
						return jbSubmit.submitEvent(setting.callback);
				}
		}

})(jQuery);


