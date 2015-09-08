/*global require,global,ROOTPATH,LIBPATH,CONFIG*/
//Global Path
global.LIBPATH = ROOTPATH + '/core/lib';
global.HELPERPATH = ROOTPATH + '/core/helper';
global.HANDLERPATH = ROOTPATH + '/handler';
//global.STATICPATH = ROOTPATH+'/static';
//global.UPLOADPATH = ROOTPATH+'/images';
global.VIEWSPATH = ROOTPATH + '/views';
//global.SHAREHOST = 'http://chh.la';
//Global Config Param
global.CONFIG = {
    //DatabasePath:ROOTPATH+'/fulldata.db',
    LOGPATH : ROOTPATH + '/log',
    //SnifferJsHandler:HANDLERPATH+'/sniffer/sniffer.js',
    //StaticRules:['js','img','css','favicon.ico'],
    StaticRules : {'static' : true, 'images' : true, 'robots.txt' : true, 'crossdomain.xml' : true, 'favicon.ico' : true},
    HandlerRules : {'tracer' : true, 'resize' : true, 'share' : true }
};

global.WHITELIST = [
    /caihuohuo(\.com\.cn|\.cn)+/
];
global.MongoURL = 'mongodb://127.0.0.1:27017/usertracer';
//Global Require
//require(HELPERPATH+'/array.js');
global.URL = require('url');
global.FILE = require('fs-extra');
global.EJS = require('ejs');
global.ROUTER = require(LIBPATH + '/router.js');
global.STATIC = require(LIBPATH + '/static.js');
global.HANDLER = require(LIBPATH + '/handler.js');
//global.IMAGE = require(LIBPATH+'/image.js');
//global.TEMPLATE = require(LIBPATH+'/template.js');
//global.DATABASE = require(LIBPATH+'/database.js');
//global.ERROR = require(LIBPATH+'/error.js');
//global.Base64 = require('base64-url');
global.Logger = require('tracer').dailyfile({root : CONFIG.LOGPATH, format : "{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}", dateformat : "HH:MM:ss.L"});