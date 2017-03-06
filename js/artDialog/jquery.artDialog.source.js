



var _path,_skin,_thisScript;
// 获取artDialog路径
 _path=window['_artDialog_path'] || (function(script,i,me){

	for(var i in script){
		if(script[i].src && script[i].src.indexOf('artDialog') !==-1){
			me=script[i];
		}
	}
	console.log(script,i,me);
 _thisScript=me || script[script.length-1];
		me=_thisScript.src.replace(/\\/g, '/');
		console.log(me,_thisScript);
		return me.lastIndexOf('/') < 0 ? '.': me.substring(0,me.lastIndexOf('/')); 

}(document.getElementsByTagName('script')));

//无阻塞载入CSS
_skin=_thisScript.src.split('skin=')[1];// default
if(_skin){
	var  link=document.createElement('link');
	link.rel='stylesheet';
	link.href=_path+'/skins/'+_skin+'.css';
	_thisScript.parentNode.insertBefore(link, _thisScript);
}


