// var countPage = [
//     /Mobile\/User\/promotion\/promoCode/i,
//     /Mobile\/login\/share\/promoCode/i,
//     /Mobile\/Login\/share\.html\?promoCode/i
// ]
// var countModify = [
//     /{"wx":"share"}/i
// ]

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
            //check referer
            var referer=req.headers.referer?req.headers.referer:null;
            Tracer._addReferer(referer);
            //Add or new
            if(result.length>0){
                Tracer._addStep(args);
            }else{
                var enterTime = parseInt(args.tracerid.substr(0,args.tracerid.length-6));
                tracerDB.insert({tracerID:args.tracerid,step:[],enterTime:enterTime,userSign:[],enterURL:args.enterurl,ip:args.ip,agent:args.agent,referer:referer},function(err,result){
                    tracerDB.update({tracerID:args.tracerid},{$push:{userSign:args.usersign}},function(){
                        Tracer._addStep(args);
                    });
                });
                for(var i in CountRules.enter){
                    var match = args.enterurl.match(CountRules.enter[i]);
                    if(match){
                        var inc = {};
                        //inc[match[0].replace('.','_')]=1;
                        var key = match[0].replace('.','_');
                        var date = new Date();
                        inc[key+'.total']=1;
                        inc[key+'.date.'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()]=1;
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
    //来源跟踪
    _addReferer:function(referer){
        if(!referer) return;
        for(var i in CountRules.referer){
            if(referer.match(CountRules.referer)){
                var inc = {};
                var key = referer.replace('.','_');
                var date = new Date();
                inc[key+'.total']=1;
                inc[key+'.date.'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()]=1;
                countDB.update({table:"referer"},{$inc:inc},{upsert:true});
                break;
            }
        }
    },
    _addStep:function(data){
        //if(data.usersign!=99999999) tracerDB.update({tracerID:data.tracerid},{$set:{userSign:data.usersign}});
        tracerDB.update({tracerID:data.tracerid,userSign:{$nin:[data.usersign]}},{$push:{userSign:data.usersign}});
        tracerDB.update({tracerID:data.tracerid},{$push:{step:{jumpTime:data.jumptime,pageSign:data.pagesign}}});
        //tracerDB.update({tracerID:data.tracerid,userSign:{$nin:data.usersign}},{$push:{userSign:data.usersign}});
    },
    _addModifyStep:function(data){
        var tracerID = data.tracerid;
        delete data.tracerid;
        var value = JSON.stringify(data);
        tracerDB.update({tracerID:tracerID},{$push:{step:{modify:value}}});
        for(var i in CountRules.modify){
            var match = value.match(CountRules.modify[i]);
            if(match){
                var inc = {};
                var key = match[0].replace('.','_');
                var date = new Date();
                inc[key+'.total']=1;
                inc[key+'.date.'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()]=1;
                //inc[match[0].replace('.','_')+'']=1;
                //countDB.update({table:"modify"},{$inc:inc},{upsert:true});
                countDB.update({table:"modify"},{$inc:inc},{upsert:true});
                break;
            }
        }
    }
}

module.exports = Tracer;