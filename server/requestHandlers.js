var DAO = require("./DAO.js");
var url = require("url");

function appointmentHandler(dataObj){
  // Here we handle post requests to appointments
  if(dataObj.request.method == "POST"){
    // Get the body content
    var body = "";
    dataObj.request.on("data", function(data){
      body += data;
    });
    dataObj.request.on("end", function(){
      if(body == null){
        body = "";
      }
      dataObj.data = JSON.parse(body);
      DAO.create("appointment", dataObj);
    });
  }
  // Handle GET request
  // USAGE: GET <url>:<port>/appointment?netlink_id=<netlink>
  if(dataObj.request.method == "GET"){
    var urlparts = url.parse(dataObj.request.url, true);
    var query = urlparts.query;
    DAO.read("appointment", query, dataObj);
  }
  // Handle DELETE request
  // USAGE: DELETE <url>:<port>/appointment?_id=53c1c269b1930c0a232460f1
  if(dataObj.request.method == "DELETE"){
    var urlparts = url.parse(dataObj.request.url, true);
    var query = urlparts.query;
    DAO.remove("appointment", query, dataObj);
  }
}

function slotHandler(dataObj){
  // Handle GET request
  if(dataObj.request.method == "GET"){
    // This means we want to search for all slots where booked = false
    DAO.read("slot", {booked: false}, dataObj);
  }
  // Handle POST request to create a new slot
  if(dataObj.request.method == "POST"){
    // Get the body content
    var body = "";
    dataObj.request.on("data", function(data){
      body += data;
    });
    dataObj.request.on("end", function(){
      if(body == null){
        body = "";
      }
      dataObj.data = JSON.parse(body);
      DAO.create("slot", dataObj);
    });
  }
  // Handle PUT request to update a slot
  if(dataObj.request.method == "PUT"){
    var body = "";
    dataObj.request.on("data", function(data){
      body += data;
    });
    dataObj.request.on("end", function(){
      if(body == null){
        body = "";
      }
      dataObj.data = JSON.parse(body);
      var urlparts = url.parse(dataObj.request.url, true);
      var query = urlparts.query;
      DAO.update("slot", query, dataObj);
    });
  }
}

function fiestaHandler(dataObj){
  // Here we handle post requests to fiestas
  if(dataObj.request.method == "POST"){
    // Get the body content
    var body = "";
    dataObj.request.on("data", function(data){
      body += data;
    });
    dataObj.request.on("end", function(){
      if(body == null){
        body = "";
      }
      dataObj.data = JSON.parse(body);
      DAO.create("fiesta", dataObj);
    });
  }
  // Handle get request for fiestas
  // USAGE: GET <url>:<port>/fiesta?netlink_id=<netlink>
  if(dataObj.request.method == "GET"){
    var urlparts = url.parse(dataObj.request.url, true);
    var netlink_id = urlparts.query;
    DAO.read("fiesta", netlink_id, dataObj);
  }
}

// LoginHandler - Usage: GET <url>:<port>/login?netlink_id=<netlink>&netlink_password=<pass>
// If this does not return an empty list, then it will return the user object
// If it returns an empty list, username and passwort combo was wrong
function loginHandler(dataObj){
  if(dataObj.request.method == "GET"){
    var urlparts = url.parse(dataObj.request.url, true);
    var query = urlparts.query;
    DAO.read("user", query, dataObj);
  }
}

function userHandler(dataObj){
  if(dataObj.request.method == "POST"){
    // Get the body content
    var body = "";
    dataObj.request.on("data", function(data){
      body += data;
    });
    dataObj.request.on("end", function(){
      if(body == null){
        body = "";
      }
      dataObj.data = JSON.parse(body);
      DAO.create("user", dataObj);
    });
  }
}

// If we want to remove code duplication, do this!
// function genericPost(type, dataObj){
//
// }

// Here we associate all the request handlers to the passed handle object
// so we can call the handlers in main
function setHandle(handle){
  handle['/appointment'] = appointmentHandler;
  handle['/slot'] = slotHandler;
  handle['/fiesta'] = fiestaHandler;
  handle['/login'] = loginHandler;
  handle['/user'] = userHandler;
}

exports.setHandle = setHandle;
