//var watchHost = ['www.caihuohuo.cn';
//if(window.location.href.match(watchHost)){
/*******************************************/
//当前跟踪时间
var traceTime = new Date();
//唯一追踪ID
var tracerID = getCookie('_tracerID');
//追踪来源
var enterURL = getCookie('_enterURL');
if(!enterURL) enterURL=window.location.href;
//最大超时时间 min
var overTime = 10;
var expressDate = new Date();
    expressDate.setTime(traceTime.getTime()+overTime*60*1000);
//首次或超出最大间隔时间视为首次进入
if(!tracerID){
    tracerID = traceTime.getTime().toString()+(Math.floor(Math.random()*(999999-100000)+100000)).toString();
}
setCookie('_enterURL',enterURL,expressDate.toGMTString());
setCookie('_tracerID',tracerID,expressDate.toGMTString());
//上次访问时间
var lastReadTime = getCookie('_readTime');
//跳转间隔时间
var jumpTime = lastReadTime?(traceTime-lastReadTime)/1000:0;
//覆盖当前时间
setCookie('_readTime',traceTime.getTime(),expressDate.toGMTString());

$(function(){
    //页面标示
    var pageSign = $('meta[name=pagesign]').attr('content');
    if(!pageSign) pageSign=window.location.href;
    //用户标示
    var userSign = $('meta[name=usersign]').attr('content');
    if(!userSign) userSign='99999999';
    //构造参数
    var data = {
        tracerid:tracerID,
        enterurl:enterURL,
        jumptime:jumpTime,
        pagesign:pageSign,
        usersign:userSign
    }
    $.ajax({
        data:data,
        url:'https://tracer.chh.la/tracer',
        method:'GET'
    });
})
/*******************************************/
//}
//读COOKIE
function getCookie(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){ 
        c_start=c_start + c_name.length+1;
        c_end=document.cookie.indexOf(";",c_start);
        if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return null;
}
//设置COOKIE
function setCookie(c_name,c_value,c_exp){
    var exp = c_exp?';expires='+c_exp:'';
    document.cookie = c_name+'='+c_value+exp+';path=/';
}

window.chhutracer = {
    addStep:function(obj){
        obj.tracerid = getCookie('_tracerID');
        $.ajax({
            data:obj,
            url:'https://tracer.chh.la/tracer/addstep',
            method:'GET'
        });
    }
}