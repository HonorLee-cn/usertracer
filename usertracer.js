global.ROOTPATH = __dirname;
require('./core/config.js');
require('mongodb').MongoClient.connect(MongoURL,function(err,db){
    if(err) return;
    global.MongoDB = db.collection('usertracer');
    require('http').createServer(serverHandler).listen(8080);
});

function serverHandler(req,res){
    //global.RESPONSE = res;
    //global.REQUEST = req;
    var COOKIE = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        COOKIE[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    var requestFile = req.url=='/'?'/index':req.url;
    req.cookie = COOKIE;
    ROUTER.go(requestFile,res,req,COOKIE);
}
