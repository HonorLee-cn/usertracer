var Router ={
    go:function(url,res,req){
        var URLParse = URL.parse(url,true);
        var URLArr = URLParse.pathname.split('/');
        var query = URLParse.query;
        //console.log(query);
        if(CONFIG.HandlerRules[URLArr[1]]){
            return Router.getHandler(url,res,req);
        }else if(CONFIG.StaticRules[URLArr[1]]){
            //Router._error();
            //return;
            return STATIC.load(ROOTPATH+URLParse.pathname,query,res);
        }else{
            Router._error('Router Go ERROR:'+url,res);
            Logger.error(url+' request error!');
        }
        
    },
    getHandler:function(url,res,req){
        var URLParse = URL.parse(HANDLERPATH+url,true);
        var URLArr = URLParse.pathname.split('/');
//console.log(URLArr)
        if(URLArr[URLArr.length-1]=='') URLArr[URLArr.length-1]='index';
        var FileName = URLArr.join('/')+'.js';
        var mod,call='index';
        if(!FILE.existsSync(FileName)){
            call = URLArr.pop();
            FileName = URLArr.join('/')+'.js';
        }
        //console.log(FileName);
        try{
            mod = require(FileName);
            mod[call](res,req,URLParse.query);
        }catch(err){
            Logger.error(err);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('404');
        }
    },
    _error:function(log,res,req){
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
    }
}

module.exports = Router;
