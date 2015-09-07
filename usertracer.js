/*jslint nomen:true*/
/*global global,require,MongoURL,ROUTER,__dirname*/

global.ROOTPATH = __dirname;
require('./core/config.js');
require('mongodb').MongoClient.connect(MongoURL, function (err, db) {
    'use strict';
    if (err) {
        return;
    }
    global.MongoDB = db.collection('usertracer');
    require('http').createServer(function (req, res) {
        var COOKIE = {},
            requestFile;
        if (req.headers.cookie) {
            req.headers.cookie.split(';').forEach(function (Cookie) {
                var parts = Cookie.split('=');
                COOKIE[parts[0].trim()] = (parts[1] || '').trim();
            });
        }
        requestFile = req.url === '/' ? '/index' : req.url;
        req.cookie = COOKIE;
        ROUTER.go(requestFile, res, req, COOKIE);
    }).listen(8080);
});