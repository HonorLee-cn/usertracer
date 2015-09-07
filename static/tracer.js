/*global window,$,unescape*/
var watchHost = 'www.caihuohuo.cn',
    traceTime,  // 当前跟踪时间
    tracerID,   // 唯一追踪ID
    enterURL;

//读COOKIE
function getCookie(c_name) {
    'use strict';
    var c_start, c_end;
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return null;
}
//设置COOKIE
function setCookie(c_name, c_value, c_exp) {
    'use strict';
    var exp = c_exp ? ';expires=' + c_exp : '';
    document.cookie = c_name + '=' + c_value + exp + ';path=/';
}

if (window.location.href.match(watchHost)) {

    traceTime = new Date();
    tracerID = getCookie('_tracerID');
    enterURL = getCookie('_enterURL');  // 首次进入的url 
    if (!enterURL) {
        enterURL = window.location.href;
    }
    //最大超时时间 min
    var overTime = 3;
    var expressDate = new Date();
    expressDate.setTime(traceTime.getTime() + overTime * 60 * 1000);
    //首次或超出最大间隔时间视为首次进入
    if (!tracerID) {
        tracerID = traceTime.getTime().toString() + (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString();
    }
    setCookie('_enterURL', enterURL, expressDate.toGMTString());
    setCookie('_tracerID', tracerID, expressDate.toGMTString());
    //上次访问时间
    var lastReadTime = getCookie('_readTime');
    //跳转间隔时间
    var jumpTime = lastReadTime ? (traceTime - lastReadTime) / 1000 : 0;
    //覆盖当前时间
    setCookie('_readTime', traceTime.getTime(), expressDate.toGMTString());

    $(function () {
        'use strict';
        
        var pageSign = $('meta[name=pagesign]').attr('content'), // 页面标示
            userSign, // 用户标示
            data; //构造参数
        if (!pageSign) {
            pageSign = window.location.href;
        }
        
        userSign = $('meta[name=usersign]').attr('content');
        if (!userSign) {
            userSign = '99999999';
        }
        
        data = {
            tracerid : tracerID,
            enterurl : enterURL,
            jumptime : jumpTime,
            pagesign : pageSign,
            usersign : userSign
        };
        $.ajax({
            data : data,
            url : 'https://tracer.chh.la/tracer',
            method : 'GET'
        });
    });
}

window.chhutracer = {
    addStep : function (obj) {
        'use strict';
        obj.tracerid = getCookie('_tracerID');
        $.ajax({
            data : obj,
            url : 'https://tracer.chh.la/tracer/addstep',
            method : 'GET'
        });
    }
};
