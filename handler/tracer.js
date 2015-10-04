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
            //Add or new
            if(result.length>0){
                Tracer._addStep(args);
            }else{
                //check referer
                var referer=req.headers.referer?req.headers.referer:null;
                Tracer._addReferer(referer);
                var enterTime = parseInt(args.tracerid.substr(0,args.tracerid.length-6));
                tracerDB.insert({tracerID:args.tracerid,step:[],enterTime:enterTime,userSign:[],enterURL:args.enterurl,ip:args.ip,agent:args.agent,referer:referer},function(err,result){
                    tracerDB.update({tracerID:args.tracerid},{$push:{userSign:args.usersign}},function(){
                        Tracer._addStep(args);
                    });
                });
                for(var i in CountRules.enter){
                    var match = args.enterurl.match(CountRules.enter[i]);
                    if(match){
                        // var inc = {};
                        // //inc[match[0].replace('.','_')]=1;

                        // //var key = match[0].replace(/\./g,'_');
                        // var url = match[0];
                        // var date = new Date();
                        // var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                        // inc['list.$.total']=1;
                        // inc['list.$.date.'+dateString]=1;
                        // //inc[key+'.total']=1;
                        // //inc[key+'.date.'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()]=1;
                        // //update({a:2,"url.u":/sh1/i},{$set:{"url.$":2}})
                        // var set = {};
                        // set['list.$.url']=url;
                        // countDB.update({table:"enter","list.url":url},{$inc:inc,$set:set},{upsert:true});
                        Tracer._addCount('enter',match[0]);
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
        var match = false;
        for(var i in CountRules.referer){
            if(referer.match(CountRules.referer[i])){
                // var inc = {},set = {};
                // var url = referer;
                // var date = new Date();
                // var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                // inc['list.$.total']=1;
                // inc['list.$.date.'+dateString]=1;
                // set['list.$.url']=url;
                // countDB.update({table:"referer"},{$inc:inc,$set:set},{upsert:true});
                Tracer._addCount('referer',referer);
                match = true;
                break;
            }
        }
        if(!match) Tracer._addUntrackReferer(referer);
    },
    //记录未标记来源
    _addUntrackReferer:function(referer){
        if(referer.match(/caihuohuo\.cn/i)) return;
        // var inc = {};
        // var key = referer.replace(/\./g,'_');
        // var date = new Date();
        // inc[key+'.total']=1;
        // inc[key+'.date.'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()]=1;

        // var inc = {},set = {};
        // var url = referer;
        // var date = new Date();
        // var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        // inc['list.$.total']=1;
        // inc['list.$.date.'+dateString]=1;
        // set['list.$.url']=url;
        // countDB.update({table:"unReferered"},{$inc:inc,$set:set},{upsert:true});
        Tracer._addCount('unReferered',referer);
    },
    _addStep:function(data){
        //if(data.usersign!=99999999) tracerDB.update({tracerID:data.tracerid},{$set:{userSign:data.usersign}});
        tracerDB.update({tracerID:data.tracerid,userSign:{$nin:[data.usersign]}},{$push:{userSign:data.usersign}});
        tracerDB.update({tracerID:data.tracerid},{$push:{step:{jumpTime:data.jumptime,pageSign:data.pagesign}}});
        //tracerDB.update({tracerID:data.tracerid,userSign:{$nin:data.usersign}},{$push:{userSign:data.usersign}});
        if(!data.pagesign) return;
        for(var i in CountRules.page){
            var match = data.pagesign.match(CountRules.page[i]);
            if(match){
                // var inc = {};
                // var key = data.pagesign.replace(/\./g,'_');
                // var date = new Date();
                // inc[key+'.total']=1;
                // inc[key+'.date.'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()]=1;
                // //inc[match[0].replace('.','_')+'']=1;
                // //countDB.update({table:"modify"},{$inc:inc},{upsert:true});
                // var set = {};
                // set[key+'.url']=data.pagesign;

                // var inc = {},set = {};
                // var url = data.pagesign;
                // var date = new Date();
                // var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                // inc['list.$.total']=1;
                // inc['list.$.date.'+dateString]=1;
                // set['list.$.url']=url;
                // countDB.update({table:"page"},{$inc:inc,$set:set},{upsert:true});
                Tracer._addCount('page',data.pagesign);
                break;
            }
        }
    },
    _addModifyStep:function(data){
        var tracerID = data.tracerid;
        delete data.tracerid;
        var value = JSON.stringify(data);
        tracerDB.update({tracerID:tracerID},{$push:{step:{modify:value}}});
        for(var i in CountRules.modify){
            var match = value.match(CountRules.modify[i]);
            if(match){
                // var inc = {};
                // var key = value.replace(/\./g,'_');
                // var date = new Date();
                // inc[key+'.total']=1;
                // inc[key+'.date.'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()]=1;
                // //inc[match[0].replace('.','_')+'']=1;
                // //countDB.update({table:"modify"},{$inc:inc},{upsert:true});
                // var set = {};
                // set[key+'.url']=value;
                // var inc = {},set = {};
                // var url = value;
                // var date = new Date();
                // var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                // inc['list.$.total']=1;
                // inc['list.$.date.'+dateString]=1;
                // set['list.$.url']=url;
                // countDB.update({table:"modify"},{$inc:inc,$set:set},{upsert:true});
                Tracer._addCount('modify',value);
                break;
            }
        }
    },
    _addCount:function(table,url){
        var inc = {},set = {};
        //var url = value;
        var date = new Date();
        var dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        inc['list.$.total']=1;
        inc['list.$.date.'+dateString]=1;
        set['list.$.url']=url;
        countDB.update({table:table,'list.url':url},{$inc:inc,$set:set},{upsert:true},function(err){
            if(err){
                var push = {};
                push['total'] = 1;
                push['date'] = {};
                push['date'][dateString] = 1;
                push['url'] = url;
                countDB.update({table:table},{$push:{list:push}},{upsert:true});
            }
        });
    }
}

module.exports = Tracer;