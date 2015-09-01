var Tracer = {
    index:function(res,req,args){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8','Access-Control-Allow-Origin':'http://test.chh.la'});
        res.end("");
        if(MongoDB==undefined) return;
        //MongoDB.collection('test').insert({traceID:data.traceid,step:[],ddd:2},function(){
        MongoDB.find({tracerID:args.tracerid}).toArray(function(err,result){
            if(err) return;
            console.log(args);
            if(result.length>0){
                Tracer.addStep(args);
            }else{
                MongoDB.insert({tracerID:args.tracerid,step:[],userSign:args.usersign,enterURL:args.enterurl},function(err,result){
                    Tracer.addStep(args);
                });
            }
        });;
    },
    addStep:function(data){
        MongoDB.update({tracerID:data.tracerid},{$push:{step:{jumpTime:data.jumptime,pageSign:data.pagesign}},$set:{userSign:data.usersign}});
    }
}

module.exports = Tracer;
