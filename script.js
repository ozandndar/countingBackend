function showLoading(loading) {
  if (loading) {
    $('#loading').show();
  } else {
    $('#loading').hide();
  }
}

$(document).ready(function() {
  var loading = false;

  $('.summary').hide();
  $('.table-1').hide();
  $('.table-2').hide();
  $('.table-3').hide();

  $('.hesapla').on('click', function() {
    var city = $('#city').val();
    var type = $('#type').val();
    var amount = $('#amount').val();

    if (document.querySelector('form').checkValidity() && city != 0 && type != 0) {
      $('input, select').removeClass('is-invalid');
      // $('.summary-city strong').text(cities[`${city}`]);
      $('.summary-type strong').text(type);
      $('.summary-amount strong').text(amount + ' ₺');

      loading = true;
      showLoading(loading);
      $.ajax({
        url: `http://localhost/hesaplama/index.php?city=${city}&type=${type}&amount=${amount}`,
        type: 'post',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function(data) {
          console.log(data);
          loading = false;
          showLoading(loading);

          if (!loading) {
            $('.summary').show();
            $('.table-1').show();
            $('.table-2').show();
            $('.table-3').show();
          }
        }
      });
    } else {
      if (amount == null || amount == undefined || amount == '') {
        console.log('amount is empty');
        $('#amount').addClass('is-invalid');
      } else {
        $('#amount').removeClass('is-invalid');
      }

      if (city == null || city == undefined || city == 0) {
        console.log('city is empty');
        $('#city').addClass('is-invalid');
      } else {
        $('#city').removeClass('is-invalid');
      }

      if (type == null || type == undefined || type == 0) {
        console.log('type is empty');
        $('#type').addClass('is-invalid');
      } else {
        $('#type').removeClass('is-invalid');
      }
    }
  });
});
