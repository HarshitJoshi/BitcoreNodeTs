#!/usr/bin/env node

'use strict';
const async = require('async');
const glob = require('glob');
const path = require('path');
import Mocha = require('mocha');

const Storage = require('../src/services/storage');

const TIMEOUT = 5000;

const storageArgs = {
    dbHost: 'localhost:27017',
    dbName: 'bitcore-unit'
};

function handleError(err: any){
    console.error(err);
    console.log(err.stack);
    process.exit(1);
}

function startTestDatabase(next: any){
    const onStart = function(err: any){
        if(err){
            handleError(err);
        }
        next();
    };
    Storage.start(onStart, storageArgs);
}

function runTests(next: any){
    
    const unitTestRunner = new Mocha();
    unitTestRunner.timeout(TIMEOUT);
    unitTestRunner.reporter('spec');
    
    const testDir = path.join(__dirname, '../../test/unit');
    const files = glob.sync(`${testDir}/**/**.js`);
    files.forEach(function(file: any){
        unitTestRunner.addFile(file);
    });

    try{
        unitTestRunner.run(function(failures){
            process.exit(failures);
        });
    } catch(err){
        handleError(err);
    }
}

async.series([
    startTestDatabase,
    // startTestServer,
    runTests
]);