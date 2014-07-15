// This is the main file for javascript functions used by the client

var serverURL = "http://127.0.0.1:8888"

var today = new Date();
var day = today.getDate();
var month = (today.getMonth()+1);
var year = today.getFullYear();
var fullDate = year+'-'+month+'-'+day;
var phys;
var time;
var description;
var key;

var apptFlag = true;

var userLogin;
var userPassword;

$(document).ready(function(){
  // $("#datepicker").datepicker({ minDate: 0 });
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

  $('#viewAppoints, #confirmAppoint, #cancelAppoint').click(function(){
    jsonStuff = $.getJSON(serverURL+"/appointment?netlink_id="+userLogin, function(){
      var temp = jsonStuff["responseText"];
      var temp2 = JSON.parse(temp);
      var jsonLength = Object.keys(temp2).length;

      // sort the appointments //

      $('#appointmentList').html("");
      for (var i = 0; i < jsonLength; i++) {
        $("#appointmentList").append('<li id="appointment'+i+'"></li>');
        $("#appointment"+i).html("Appointment on "+temp2[i]["date"]+" at "+temp2[i]["time"]+" with "+temp2[i]["physician"]);
        $("#appointment"+i).append("<br>Reason: "+temp2[i]["description"]);
        $("#appointment"+i).append('<button id="cancelAppoint">Cancel</button>');      
      } 
    });
  });

  $('#viewHistory').click(function(){
    jsonFiestas = $.getJSON(serverURL+"/fiesta?netlink_id="+userLogin, function(){
      var temp = jsonFiestas["responseText"];
      var temp2 = JSON.parse(temp);
      var jsonLength = Object.keys(temp2).length;

      // sort the appointments //

      $('#historyList').html("");
      for (var i = 0; i < jsonLength; i++) {
        $("#historyList").append('<li id="fiesta'+i+'"></li>');
        $("#fiesta"+i).html(temp2[i]["event_description"]+":  "+temp2[i]["event_time"]);
        
      } 

    });
  });

});

function getPhysSlots(){
  console.log(serverURL+"/slot?physician="+phys.text+"&date="+fullDate+"&booked=false");
  $("#select-time").html("");
    jsonSlots = $.getJSON(serverURL+"/slot?physician="+phys.text+"&date="+fullDate+"&booked=false", function(){
      var temp = jsonSlots["responseText"];
      var temp2 = JSON.parse(temp);
      var jsonLength = Object.keys(temp2).length;
      for (var i = 0; i < jsonLength; i++){
        console.log(temp2[i]);
        $("#select-time").append("<option>"+temp2[i]["time"]+"</option>");
      }
    });
};

function verifyLogin(){

    userLogin = $('#username').val();
    userPassword = $('#password').val();
    console.log(userLogin);
    console.log(userPassword);

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

function getDescription(){
  description = document.getElementById("reason").value;
  $('#myRfV').html(description);
}

function changePhys(){
  var selectPhys = document.getElementById('select-physician');
  phys = selectPhys.options[selectPhys.selectedIndex];

  $('#myDate').html(fullDate);
  $('#myPhys').html(phys.text);

  getPhysSlots();
}

function changeTime(){
  var selectTime = document.getElementById('select-time');
  time = selectTime.options[selectTime.selectedIndex];
  $('#myApptTime').html(time.text);
}

function sendAppointment(){

  key = fullDate+'/'+phys.text+'/'+time.text;

  var data = {key:key, date:fullDate, time:time.text, physician:phys.text, description:description, netlink_id:userLogin};

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/appointment',       
    data: JSON.stringify(data),
    dataType: 'json',
    statusCode: {
      200: function(response){
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

function deleteAppointment(){
  $.ajax({
    type: 'delete',
    url: serverURL+'/appointment?key='+key,
  });
}

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


