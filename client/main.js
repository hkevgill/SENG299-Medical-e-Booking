// This is the main file for javascript functions used by the client

var serverURL = "http://127.0.0.1:8888"

var today = new Date();
var day = today.getDate();
var month = (today.getMonth()+1);
var year = today.getFullYear();
var fullDate = year+'-'+month+'-'+day;
var phys;
var time = 'hello';
var description;
var key;

var apptFlag = true;

var userLogin;
var userPassword;

// Executes after the DOM is ready, loads datepicker and 
// updates view appointments page, also gets fiestas for history page
$(document).ready(function(){
  $('#datepicker').datepicker({
    dateFormat: 'yy-mm-dd',        
    inline: true,
    onSelect: function(){
      day = $("#datepicker").datepicker('getDate').getDate();
      month = $("#datepicker").datepicker('getDate').getMonth() + 1;
      year = $("#datepicker").datepicker('getDate').getFullYear();
      fullDate = year + "-" + month + "-" + day;
      $('#myDate').html(fullDate);
    }
  });

  $('#viewAppoints, #confirmAppoint').click(function(){
    refreshViewPage();
  });

  $('#viewHistory').click(function(){
    jsonFiestas = $.getJSON(serverURL+"/fiesta?netlink_id="+userLogin, function(){
      var temp = jsonFiestas["responseText"];
      var temp2 = JSON.parse(temp);
      var jsonLength = Object.keys(temp2).length;

      $('#historyList').html("");
      for (var i = 0; i < jsonLength; i++) {
        $("#historyList").prepend('<li id="fiesta'+i+'"></li>');
        $("#fiesta"+i).html(temp2[i]["event_description"]+":  "+temp2[i]["event_time"]);
      } 
    });
  });

});

// Clears credentials on Logout
function clearCredentials(){
  $('#username').val('');
  $('#password').val('');
}

// Deletes appointments upon clicking cancel appointment,
// Logs deletion as a fiesta for history
function cancelAppointment(thingKey, listNum){

  // Delete appointment
  $.ajax({
    type: 'delete',
    url: serverURL+'/appointment?key='+thingKey,
  });

  // Set slot booked back to false
  var arr = thingKey.split("/");
  var data = {booked:"false"};

  $.ajax({
    contentType: 'applications/json',
    type: 'put',
    url: serverURL+'/slot?date='+arr[0]+'&time='+arr[2]+'&physician='+arr[1],
    data: JSON.stringify(data),
    dataType: 'json',
  });

  sendCancelledAppointmentFiesta();

  $("#appointment"+listNum).hide();
}

// Refreshes view appointments page
function refreshViewPage(){
    jsonStuff = $.getJSON(serverURL+"/appointment?netlink_id="+userLogin, function(){
    var temp = jsonStuff["responseText"];
    var temp2 = JSON.parse(temp);
    var jsonLength = Object.keys(temp2).length;

    temp2.sort(function(a, b){
      if(a['time'] > b['time']){
        return -1;
      }
      if(a['time'] == b['time']){
        return 0;
      }
      if(a['time'] < b['time']){
        return 1;
      }
    });

    $('#appointmentList').html("");
    for (var i = 0; i < jsonLength; i++) {
      $("#appointmentList").append('<li id="appointment'+i+'"></li>');
      $("#appointment"+i).html("Appointment on "+temp2[i]["date"]+" at "+temp2[i]["time"]+" with "+temp2[i]["physician"]);
      $("#appointment"+i).append("<br>Reason: "+temp2[i]["description"]);
      var cancelKey = temp2[i]["date"]+"/"+temp2[i]["physician"]+"/"+temp2[i]["time"];
      $("#appointment"+i).append('<button onclick="cancelAppointment(\''+cancelKey+'\', '+i+');">Cancel</button>');      
    } 
  });
}

// Gets the time slots available for each physician and updates
// the dropdown time slots on the book appointment page
function getPhysSlots(){
  time = 'hello';
  removeOptions(document.getElementById("select-time"));
  $("#select-time").append('<option value="1">Select a time</option>');
    jsonSlots = $.getJSON(serverURL+"/slot?physician="+phys.text+"&date="+fullDate+"&booked=false", function(){
      var temp = jsonSlots["responseText"];
      var temp2 = JSON.parse(temp);

      temp2.sort(function(a, b){
        if(a['time'] > b['time']){
          return 1;
        }
        if(a['time'] == b['time']){
          return 0;
        }
        if(a['time'] < b['time']){
          return -1;
        }
      });

      var jsonLength = Object.keys(temp2).length;
      for (var i = 0; i < jsonLength; i++){
        $("#select-time").append("<option>"+temp2[i]["time"]+"</option>");
      }
    });
    $('#select-time-button > span').html('Select a Time');
}

function removeOptions(selectBox){
  var i;
  for(i=selectBox.options.length-1; i>=0; i--){
    selectBox.remove(i);
  }
}


// Verifies that user logging in exists, otherwise username or password
// is incorrect
function verifyLogin(){

    userLogin = $('#username').val();
    userPassword = $('#password').val();

    jsonLogin = $.getJSON(serverURL+"/login?netlink_id="+userLogin, function(){
        var temp = jsonLogin["responseText"];
        var temp2 = JSON.parse(temp);
        if(temp2[0]["netlink_password"] == userPassword){
          sendLoginFiesta();
          window.location.href = '#homePage';
        } else {
          alert("Username or password is incorrect.");
        }
    })
    .fail(function(){
      alert("Username or password is incorrect.");
    });
}


// Get the reason for visit and display it on confirm page
function getDescription(){
  description = document.getElementById("reason").value;
  $('#myRfV').html(description);
}

// Get the physician from dropdown and display on confirm page along with date
function changePhys(){
  var selectPhys = document.getElementById('select-physician');
  phys = selectPhys.options[selectPhys.selectedIndex];

  $('#myDate').html(fullDate);
  $('#myPhys').html(phys.text);

  getPhysSlots();
}

// RegEx to check if it is a number, returns true or false
function isNumber(n) { 
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
}

// Get the time from dropdown and display on confirm page
function changeTime(){
  var selectTime = document.getElementById('select-time');
  time = selectTime.options[selectTime.selectedIndex].text;
  $('#myApptTime').html(time);
}

// Once user has selected appointment, this function sends the information
// to the database and creates the appointment
function sendAppointment(){

  if(!isNumber(time)){
    alert("A time has not been selected");
    return;
  }

  key = fullDate+'/'+phys.text+'/'+time;

  var data = {key:key, date:fullDate, time:time, physician:phys.text, description:description, netlink_id:userLogin};

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/appointment',       
    data: JSON.stringify(data),
    dataType: 'json',
    statusCode: {
      200: function(response){
        updateBookedSlot();
        apptFlag = false;
        window.location.href = '#confirmAppointmentPage';
      }
    },
    complete: function(){
      if(apptFlag == true){
        alert("Appointment is already booked, please select a different time");
      }
    },
  });
  apptFlag = true;
}

// If on the confirm page a user no longer wants appointment and goes back,
// Appointment is no longer booked (reserved) and is deleted.
function deleteAppointment(){
  $.ajax({
    type: 'delete',
    url: serverURL+'/appointment?key='+key,
  });
  updateCancelledSlot();
}

// Not used, code to create time slots. Time slots were created using python
// and imitating a mock oscar interface
function sendSlot(){
  var data = {date:"2014-7-14", time:"0900", physician:"DrJones", booked:"false"};

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/slot',
    data: JSON.stringify(data),
    dataType: 'json',
  });
}

// Logs when user confirms the booking of their appointment for history
function sendAppointmentFiesta(){

  var fies = {event_description:'Booked an appointment', netlink_id:userLogin};

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/fiesta',
    data: JSON.stringify(fies),
    dataType: 'json',
  });
}

// Logs the users login for history
function sendLoginFiesta(){

  var fies = {event_description:'Logged in', netlink_id:userLogin};

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/fiesta',
    data: JSON.stringify(fies),
    dataType: 'json',
  });
}

// Logs when user cancelled an appointment for history
function sendCancelledAppointmentFiesta(){
  var fies = {event_description:'Cancelled an appointment', netlink_id:userLogin};

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/fiesta',
    data: JSON.stringify(fies),
    dataType: 'json',
  });
}

// When user books appointments, updates slot to booked in DB
function updateBookedSlot(){

  var data = {booked:"true"};

  $.ajax({
    contentType: 'applications/json',
    type: 'put',
    url: serverURL+'/slot?date='+fullDate+'&time='+time+'&physician='+phys.text,
    data: JSON.stringify(data),
    dataType: 'json',
  });
}

// When user cancels appointment, updates slot to not booked in DB.
function updateCancelledSlot(){

  var data = {booked:"false"};

  $.ajax({
    contentType: 'applications/json',
    type: 'put',
    url: serverURL+'/slot?date='+fullDate+'&time='+time+'&physician='+phys.text,
    data: JSON.stringify(data),
    dataType: 'json',
  });
}


