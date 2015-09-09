/*global window,$,unescape,console*/

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

var watchHost = 'loc.caihuohuo.cn',
    traceTime,      // 当前跟踪时间
    tracerID,       // 唯一追踪ID
    enterURL,       // 首次进入的URL
    overTime = 3,   // 超时时间 minutes
    expressDate,    // 过期时间
    lastReadTime,   // 上次访问时间
    jumpTime;       // 跳转间隔时间

if (window.location.hostname === watchHost) {
    traceTime = new Date();
    expressDate = new Date(traceTime.getTime() + overTime * 60 * 1000);
    
    tracerID = getCookie('_tracerID');
    enterURL = getCookie('_enterURL');
    if (!enterURL) {
        enterURL = window.location.href;
        setCookie('_enterURL', enterURL, expressDate.toGMTString());
    }
    //首次或超出最大间隔时间视为首次进入
    if (!tracerID) {
        tracerID = traceTime.getTime().toString() + (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString();
        setCookie('_tracerID', tracerID, expressDate.toGMTString());
    }
    
    lastReadTime = getCookie('_readTime');
    jumpTime = lastReadTime ? (traceTime - lastReadTime) / 1000 : 0;
    setCookie('_readTime', traceTime.getTime(), expressDate.toGMTString());     //覆盖当前时间

    $(function () {
        'use strict';
        
        var pageSign = $('meta[name=pagesign]').attr('content'), // 页面标示，暂无
            userSign, // 用户标示，只有注册成功及个人中心首页有userSign
            data; //构造参数
        if (!pageSign) {
            pageSign = window.location.href;
        }
        
        userSign = $('meta[name=usersign]').attr('content');
        if (!userSign) {
            userSign = '99999999';
        }
        
        data = {
            tracerid : tracerID,    // 追踪ID
            enterurl : enterURL,    // 
            jumptime : jumpTime,
            pagesign : pageSign,
            usersign : userSign
        };
        $.ajax({
            data : data,
            url : 'http://127.0.0.1:8888/tracer',
            method : 'GET',
            beforeSend : function () {
                
            }
        });
    });
}

window.chhutracer = {
    addStep : function (obj) {
        'use strict';
        obj.tracerid = getCookie('_tracerID');
        $.ajax({
            data : obj,
            url : 'https://127.0.0.1:8888/tracer/addstep',
            method : 'GET'
        });
    }
};