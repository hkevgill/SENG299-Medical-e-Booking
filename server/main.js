// This file is the server which handles requests from the client

var http = require("http");
var DAO = require("./DAO");

var requestID = 1;

function server(request, response){
  try{

    var dataObj = {
      id : new Date().getTime() + requestId,
      request: request,
      response: response,
      data: null,
      identifier: null
    }

  }catch(err){
    console.log(err);
    response.writeHead(500, {"Content-Type": "text/html"});
    response.write(err);
    response.end();
  }

}

completeResponse = function(dataObj, statusCode, contentType, content){
  var ct = "text/plain";
  if(contentType = "json"){
    ct = "application/json";
  }
  dataObj.response.writeHead(
    statusCode, {"Content-Type": ct}
  );
  dataObj.response.end(content);
}

var server = http.createServer(server);
server.listen("80", "127.0.0.1");
