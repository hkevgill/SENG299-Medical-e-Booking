// This file is the server which handles requests from the client

var http = require("http");
var DAO = require("./DAO");

var requestID = 1;

function server(request, response){

}

var server = http.createServer(server);
server.listen("80", "127.0.0.1");
