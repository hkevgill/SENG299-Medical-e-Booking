var DAO = require("./DAO.js");


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
}

// If we want to remove code duplication, do this!
// function genericPost(type, dataObj){
//
// }

// Here we associate all the request handlers to the passed handle object
// so we can call the handlers in main
function setHandle(handle){
  handle['/appointment'] = appointmentHandler;

}

exports.setHandle = setHandle;
