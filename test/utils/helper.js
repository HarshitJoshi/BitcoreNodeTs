'use strict';
const async = require('async');
const mongoose = require('mongoose');


function resetModel(Model, callback){
    Model.remove({}, function(err){
        if(err){
            return callback(err);
        }
        return callback();
    });
}

function resetDatabase(callback){
    const collections = mongoose.connection.collections;
    const dropCollection = function(collection, next){
        collection.drop(function(err){
            if(err && err.message === 'ns not found'){
                return next();
            }
            return next(err);
        });
    };
    async.each(
        collections,
        dropCollection,
        callback
    );
}

function addItemsModel(Model, items, done){
    async.each(
        items, 
        function(item, next){
            Model.create(item, function(err){
                if(err){
                    return done(err);
                }
                return next();
            });
        },
        function(err){
            if(err){
                return done(err);
            }
            return done();
        }
    );
}

module.exports = {
    addItemsModel,
    resetModel,
    resetDatabase,
};