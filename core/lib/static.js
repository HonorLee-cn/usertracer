/*global require,module,IMAGE,URL,REQUEST,FILE*/
var Path = require('path');
var mime = require('mime-types');
var ZLIB = require('zlib');
var Static = {
    load : function (url, query, res) {
        'use strict';
        var ext = Path.extname(url),
            data;
        if (!ext || ext === '') {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
            return false;
        }
        if (ext.match(/png|jpg|jpeg|gif/)) {
            return IMAGE.load(URL.parse(REQUEST.url, true).pathname, ext, query, res);
        } else if (FILE.existsSync(url)) {
            if (ext.match(/txt|js|css|html|json/)) {
                try {
                    data = FILE.readFileSync(url, 'utf-8');
                } catch (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end();
                    return false;
                }
                if (ext.match(/json/)) {
                    res.writeHead(200, { "Content-Type": mime.lookup(ext) + ';charset=utf-8'});
                    res.end(data, 'utf-8');
                } else {
                    res.writeHead(200, { "Content-Type": mime.lookup(ext) + ';charset=utf-8', 'Content-Encoding': 'gzip'});
                    res.end(ZLIB.gzipSync(data), 'utf-8');
                }
                 //console.log(query)   
            } else {
                try {
                    data = FILE.readFileSync(url, 'binary');
                } catch (err1) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end();
                    return false;
                }
                res.writeHead(200, { "Content-Type": mime.lookup(ext), "Access-Control-Allow-Origin": "*"});
                res.end(data, 'binary');
            }
            return true;
            
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end();
            return false;
        }
    }
};

module.exports = Static;