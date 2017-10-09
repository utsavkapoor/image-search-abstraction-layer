'use strict'
var mongodb = require("mongodb");
const requests = require('request');
var MongoClient = mongodb.MongoClient;
var MongoURL = process.env.MongodbURL;

module.exports = function(req,res){
  var str = req.params.search;
  console.log(req.query.offset);
  var number_of_results = req.query.offset || 10;//default number of results
  var url = "https://pixabay.com/api/?key=6607127-76c2ca39e7e3d776b306c7813&q="+encodeURIComponent(str)+"&image_type=photo"+"&per_page="+number_of_results;
  requests(url, function (error, response, body) {
    if(error) throw error;
    let target = JSON.parse(body);
    console.log(target["hits"].length);
    if(target["hits"].length > 0){
      let output =[]
      store_in_db(str);
      for(var i =0;i<target["hits"].length;i++){
        let obj = {'url':null,
                   'tags':null,
                   'thumbnail':null,
                   'context':null
                  }
        obj['url'] = target['hits'][i]['previewURL']
        obj['thumbnail'] = target['hits'][i]['userImageURL']
        obj['tags'] = target['hits'][i]['tags']
        obj['context'] = target['hits'][i]['pageURL']
        output.push(obj)
      }
      res.send(output);
    } else {
      res.send("No Results Found for the Query");
    }
    
});

}

function store_in_db(search_string){
  console.log(MongoURL);
  //mongodb://<dbuser>:<dbpassword>@ds117251.mlab.com:17251/query_history
 MongoClient.connect(MongoURL,function(err,db){
   if(err) throw err;
   var collection = db.collection('query_history');
   var timestamp = Date.now();
   var data = {"query":search_string,"timestamp":timestamp};
   collection.insert(data);
 }); 
}