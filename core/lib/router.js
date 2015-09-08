/*jslint nomen:true*/
/*global require,module,URL,CONFIG,STATIC,ROOTPATH,Logger,HANDLERPATH,FILE,console*/
var Router = {
    go : function (url, res, req) {
        'use strict';
        var URLParse = URL.parse(url, true),
            URLArr = URLParse.pathname.split('/'),
            query = URLParse.query;
        
        if (CONFIG.HandlerRules[URLArr[1]]) {
            return Router.getHandler(url, res, req);
        } else if (CONFIG.StaticRules[URLArr[1]]) {
            //Router._error();
            //return;
            return STATIC.load(ROOTPATH + URLParse.pathname, query, res);
        } else {
            Router._error('Router Go ERROR:' + url, res);
            Logger.error(url + ' request error!');
        }
        
    },
    getHandler : function (url, res, req) {
        'use strict';
        var URLParse = URL.parse(HANDLERPATH + url, true),
            URLArr = URLParse.pathname.split('/'),
            FileName,
            mod,
            call;
        
        if (URLArr[URLArr.length - 1] === '') {
            URLArr[URLArr.length - 1] = 'index';
        }
        FileName = URLArr.join('/') + '.js';
        call = 'index';
        if (!FILE.existsSync(FileName)) {
            call = URLArr.pop();
        }
        try {
            mod = require(FileName);
            mod[call](res, req, URLParse.query);
        } catch (err) {
            Logger.error(err);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('404');
        }
    },
    _error : function (log, res, req) {
        'use strict';
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
    }
};

module.exports = Router;