// This is the main file for javascript functions used by the client
$(document).ready(function(){
      $('#datepicker').datepicker({
        dateFormat: 'yy-mm-dd',        
        inline: true,
        onSelect: function(){
          var day = $("#datepicker").datepicker('getDate').getDate();
          var month = $("#datepicker").datepicker('getDate').getMonth() + 1;
          var year = $("#datepicker").datepicker('getDate').getFullYear();
          var fullDate = year + "-" + month + "-" + day;
        }
      });

      $('#bookAppointment').click(function(){
        var selectPhys = document.getElementById('select-physician');
        var physician = selectPhys.options[selectPhys.selectedIndex].value;

        var selectTime = document.getElementById('select-time');
        var time = selectTime.options[selectTime.selectedIndex].value;
        
        $('#myPhys').html(physician);
      });
});
