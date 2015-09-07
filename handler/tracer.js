var countPage = [
    /Mobile\/User\/promotion\/promoCode/i,
    /Mobile\/login\/share\/promoCode/i,
    /Mobile\/Login\/share\.html\?promoCode/i
]
var countModify = [
    /{"wx":"share"}/i
]

var Tracer = {
    index:function(res,req,args){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8','Access-Control-Allow-Origin':'*'});
        res.end("");
        if(MongoDB==undefined || args.tracerid==undefined) return;
        args.agent = req.headers['user-agent'];
        args.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        //MongoDB.collection('test').insert({traceID:data.traceid,step:[],ddd:2},function(){
        tracerDB.find({tracerID:args.tracerid}).toArray(function(err,result){
            if(err) return;
            if(result.length>0){
                Tracer._addStep(args);
            }else{
                var enterTime = parseInt(args.tracerid.substr(0,args.tracerid.length-6));
                tracerDB.insert({tracerID:args.tracerid,step:[],enterTime:enterTime,userSign:args.usersign,enterURL:args.enterurl,ip:args.ip,agent:args.agent},function(err,result){
                    Tracer._addStep(args);
                });
                for(var i in countPage){
                    var match = args.enterurl.match(countPage[i]);
                    if(match){
                        var inc = {};
                        inc[match[0].replace('.','_')]=1;
                        countDB.update({table:"enter"},{$inc:inc},{upsert:true});
                        break;
                    }
                }
            }
        });
    },
    addstep:function(res,req,args){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8','Access-Control-Allow-Origin':'*'});
        res.end("");
        if(MongoDB==undefined || args.tracerid==undefined) return;
        tracerDB.find({tracerID:args.tracerid}).toArray(function(err,result){
            if(err) return;
            if(result.length>0){
                Tracer._addModifyStep(args);
            }else{
                return;
            }
        });;
    },
    _addStep:function(data){
        if(data.usersign!=99999999) tracerDB.update({tracerID:data.tracerid},{$set:{userSign:data.usersign}});
        tracerDB.update({tracerID:data.tracerid},{$push:{step:{jumpTime:data.jumptime,pageSign:data.pagesign}}}); 
    },
    _addModifyStep:function(data){
        var tracerID = data.tracerid;
        delete data.tracerid;
        var value = JSON.stringify(data);
        tracerDB.update({tracerID:tracerID},{$push:{step:{modify:value}}});
        for(var i in countModify){
            var match = value.match(countModify[i]);
            if(match){
                var inc = {};
                inc[match[0].replace('.','_')]=1;
                countDB.update({table:"modify"},{$inc:inc},{upsert:true});
                break;
            }
        }
    }
}

module.exports = Tracer;