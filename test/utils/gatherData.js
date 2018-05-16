'use strict';
const request = require('request');
const async = require('async');

function makeRPCRequest(method, methodParams, connectionOpts, callback){
    console.log('colleciton opts', connectionOpts);
    console.log('callback', callback);
    if(!callback){
        callback = connectionOpts;
    }

    let requestOpts = {};
    requestOpts.body = JSON.stringify({
        jsonrpc: "1.0",
        id: 'rpccurl',
        method: method,
        params: methodParams,
    });
    requestOpts.method = 'POST';
    requestOpts.uri = connectionOpts.uri || 'http://127.0.0.1:20001/';
    requestOpts.auth = {
        user: connectionOpts.user || 'bitpaytest',
        pass: connectionOpts.pass || 'local321'
    };
    requestOpts.headers = {
        'content-type': 'text/plain;'
    };
    return request(requestOpts, function(err, result){
        if(err){
            return callback(err);
        }
        if(result && result.body){
            console.log('result', result);
            console.log('rb', result.body);
            let body;
            try{
                body = JSON.parse(result.body).result;
            }catch(err){
                return callback(err);
            }
            return callback(null, body);
        }
    });    
}

let blockToGet;
let verboseBlock;

function getChainTip(next){
    makeRPCRequest('getbestblockhash', [], {}, function(err, result){
        if(err){
            throw err;
        }
        blockToGet = result;
        return next();
    });
}

function writeAllBlocks(next){
    let previousBlockHash;

    function getBlockVerbose(done){
        makeRPCRequest('getblock', [blockToGet, 2], function(err, verboseBlock){
            console.log('got verbose block');
            previousBlockHash = verboseBlock.previousBlockHash;
            verboseBlock = verboseBlock;
            // TOOD: write to file
            return done();
        })
    }


    function getBlockRaw(done){
        makeRPCRequest('getblock', [blockToGet, 0], function(err, verboseBlock){
            console.log('got raw block');
            // TOOD: write to file
            return done();
        })
    }

    function processBlock(done){
        async.series(
            [getBlockRaw, getBlockVerbose],
            function(err){
                if(err){
                    return done(err);
                }
                blockToGet = previousBlockHash;
                done();
            }
        );
    }

    function untilTest(){
        return true;
    }
    
    async.doUntil(
        processBlock,
        untilTest,
        function(err){
            if(err){
                return next(err);
            }
            return next();
        }
    );

}


async.series([
    getChainTip,
    writeAllBlocks
], function(err) {
    console.log();
    console.log('vars are');
    console.log('verbbose block', verboseBlock);
    console.log();
});
