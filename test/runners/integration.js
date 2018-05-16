#!/usr/bin/env node

'use strict';
const async = require('async');
const glob = require('glob');
const path = require('path');
const Mocha = require('mocha');

const Storage = require('../../src/services/storage');
const helpers = require('../utils/helper');

const TIMEOUT = 5000;

const storageArgs = {
    dbHost: 'localhost:27017',
    dbName: 'bitcore-integration'
};

function handleError(err){
    console.error(err);
    console.log(err.stack);
    process.exit(1);
}

function startTestDatabase(next){
    const onStart = function(err){
        if(err){
            return handleError(err);
        }
        helpers.resetDatabase(function(err){
            if(err){
                return handleError(err);
            }
            return next();
        });
    };
    Storage.start(onStart, storageArgs);
}

function runTests(next){
    
    const integrationTestRunner = new Mocha();
    integrationTestRunner.timeout = TIMEOUT;
    integrationTestRunner.reporter('spec');
    
    const testDir = path.join(__dirname, '../test/integration');
    const files = glob.sync(`${testDir}/**/**.js`);
    files.forEach(function(file){
        integrationTestRunner.addFile(file);
    });

    try{
        integrationTestRunner.run(function(failures){
            process.exit(failures);
        });
    } catch(err){
        helpers.resetDatabase(function(){
            return handleError(err);
        })
    }
}

async.series([
    startTestDatabase,
    // startTestServer,
    runTests
]);