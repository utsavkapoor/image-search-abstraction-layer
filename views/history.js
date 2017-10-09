'use strict'

var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var MongoURL = process.env.MongodbURL;


module.exports = function(req,res){
  
  MongoClient.connect(MongoURL,function(err,db){
    if(err) throw err;
    var collection = db.collection('query_history');
    collection.find().sort({'timestamp':-1}).toArray(function(err,docs){
      if(err) throw err;
      let answer = []
      console.log(docs);
      for(var i=0;i<10;i++){
        let obj = {'query':null,
                   'date':null
                  }
        let str = docs[i]
        obj['query'] = str['query']
        var temp_date = new Date(str['timestamp'])
        obj['date'] = temp_date.toISOString()
        answer.push(obj)
      }
      res.send(answer);
    });
  });
}