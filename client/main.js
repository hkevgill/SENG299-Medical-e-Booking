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

  $('#viewAppoints').click(function(){
    jsonStuff = $.getJSON("http://127.0.0.1:8888/appointment?netlink_id=JOEY", function(){
      var temp = jsonStuff["responseText"];
      var temp2 = JSON.parse(temp);

      console.log(Object.keys(temp2).length);
      console.log(temp2[0]["netlink_id"]);

      var jsonLength = Object.keys(temp2).length;

      for (var i = 0; i < jsonLength; i++) {
        $("#appointmentList").append('<li id="appointment'+i+'"></li>');
        $("#appointment"+i).html("Appointment on "+temp2[i]["date"]+" with "+temp2[i]["physician"]);

        console.log(i);
      } 

    });
  });

//       $('#loginForm:#submitButton').click(function(){
//            // go to home page. That selector isn't right either.
//       })
});

function getDescription(){
  description = document.getElementById("reason").value;
  $('#myRfV').html(description);
}

function changeSelection(){
  var selectPhys = document.getElementById('select-physician');
  phys = selectPhys.options[selectPhys.selectedIndex];

  var selectTime = document.getElementById('select-time');
  time = selectTime.options[selectTime.selectedIndex];

  $('#myDate').html(fullDate);
  $('#myPhys').html(phys.text);
  $('#myApptTime').html(time.text);
}

function sendAppointment(){

  console.log(typeof(time));

  var data = {date:fullDate, time:time.text, physician:phys.text, description:description, netlink_id:"joe"};

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/appointment',       
    data: JSON.stringify(data),
    dataType: 'json',
  });

}



