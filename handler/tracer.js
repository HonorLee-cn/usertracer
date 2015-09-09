/*jslint nomen:true*/
/*global MongoDB,module,console*/
var Tracer = {
    index: function (res, req, args) {
        'use strict';
        MongoDB.find({tracerID: args.tracerid}, function (err, result) {
            result.toArray(function (err1, result1) {
                console.log(result1);
            });
        });
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*'});
        res.end("");
        if (MongoDB === undefined || args.tracerid === undefined) {
            return;
        }
        args.agent = req.headers['user-agent'];
        args.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        //MongoDB.collection('test').insert({traceID:data.traceid,step:[],ddd:2},function(){
        MongoDB.find({tracerID: args.tracerid}).toArray(function (err, result) {
            if (err) {
                return;
            }
            if (result.length > 0) {
                Tracer._addStep(args);
            } else {
                var enterTime = parseInt(args.tracerid.substr(0, args.tracerid.length - 6), 10);
                MongoDB.insert({tracerID: args.tracerid, step: [], enterTime: enterTime, userSign: args.usersign, enterURL: args.enterurl, ip: args.ip, agent: args.agent}, function (err, result) {
                    Tracer._addStep(args);
                });
            }
        });
    },
    addstep: function (res, req, args) {
        'use strict';
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*'});
        res.end("");
        if (MongoDB === undefined || args.tracerid === undefined) {
            return;
        }
        MongoDB.find({tracerID: args.tracerid}).toArray(function (err, result) {
            if (err) {
                return;
            }
            if (result.length > 0) {
                Tracer._addModifyStep(args);
            } else {
                return;
            }
        });
    },
    _addStep: function (data) {
        'use strict';
        if (data.usersign !== 99999999) {
            console.log('ok');
            MongoDB.update({tracerID: data.tracerid}, {$set: {userSign: data.usersign}});
        }
        MongoDB.update({tracerID: data.tracerid}, {$push: {step: {jumpTime: data.jumptime, pageSign: data.pagesign}}});
    },
    _addModifyStep: function (data) {
        'use strict';
        var tracerID = data.tracerid;
        delete data.tracerid;
        MongoDB.update({tracerID: tracerID}, {$push: {step: {modify: JSON.stringify(data)}}});
    }
};

module.exports = Tracer;
