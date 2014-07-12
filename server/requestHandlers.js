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
  if(dataObj.request.method == "GET"){
    var urlparts = url.parse(dataObj.request.url, true);
    var netlink_id = urlparts.query;
    DAO.read("appointment", netlink_id, dataObj);
  }
}

function slotsHandler(dataObj){
  // Handle GET request
  if(dataObj.request.method == "GET"){
    // This means we want to search for all slots where booked = false
    DAO.read("slot", {booked: false}, dataObj);
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
  handle['/slots'] = slotsHandler;
}

exports.setHandle = setHandle;
