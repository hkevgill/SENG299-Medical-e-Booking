// This is the main file for javascript functions used by the client

var fullDate;
var physician;
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
    physician = selectPhys.options[selectPhys.selectedIndex];

    var selectTime = document.getElementById('select-time');
    time = selectTime.options[selectTime.selectedIndex];
        
    $('#myPhys').html(physician.text);
    $('#myApptTime').html(time.text);
  });

//       $('#loginForm:#submitButton').click(function(){
//            // go to home page. That selector isn't right either.
//       })
});
