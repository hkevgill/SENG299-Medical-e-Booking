// This is the main file for javascript functions used by the client

var serverURL = "http://127.0.0.1:8888"

var fullDate;
var phys;
var time;

$(document).ready(function(){
  $('#datepicker').datepicker({
    dateFormat: 'yy-mm-dd',        
    inline: true,
    onSelect: function(){
      var day = $("#datepicker").datepicker('getDate').getDate();
      var month = $("#datepicker").datepicker('getDate').getMonth() + 1;
      var year = $("#datepicker").datepicker('getDate').getFullYear();
      fullDate = year + "-" + month + "-" + day;
      $('#myDate').html(fullDate);
    }
  });

  $('#bookAppointment').click(function(){
    var selectPhys = document.getElementById('select-physician');
    phys = selectPhys.options[selectPhys.selectedIndex];

    var selectTime = document.getElementById('select-time');
    time = selectTime.options[selectTime.selectedIndex];
        
    $('#myPhys').html(phys.text);
    $('#myApptTime').html(time.text);
  });

//       $('#loginForm:#submitButton').click(function(){
//            // go to home page. That selector isn't right either.
//       })
});

function sendAppointment(){

  console.log(typeof(phys.text));
  console.log(phys.text);

  var data = {date:fullDate, physician:phys.text, description:"NONE",netlink_id:"JOEY"};


  console.log(JSON.stringify(data));

  $.ajax({
    contentType: 'applications/json',
    type: 'post',
    url: serverURL+'/appointment',       
    data: JSON.stringify(data),
    dataType: 'json',
  });

}

//2014070421250500




