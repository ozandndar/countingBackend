function showLoading(loading) {
  if (loading) {
    $('#loading').show();
  } else {
    $('#loading').hide();
  }
}

function number_format(number, decimals, dec_point, thousands_sep) {
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function generateYourChoiseTable(data) {
  var table = $('.your-choise');
  var formattedAmount = data.amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  table.find('#choosen-city').text(data.city);
  table.find('#choosen-type').text(data.type);
  table.find('#choosen-amount').text(formattedAmount + '₺');
  table.show();
}

function generatePropertyTaxTable(data) {
  var table = $('.property-tax');
  var formattedTax = data.emlakVergisi.tutar.toFixed(0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + '₺';
  table.find('#property-tax-rate').text('%' + data.emlakVergisi.oran);
  table.find('#property-tax-amount').text(formattedTax);
  table.find('#bigcity-status').text(data.isBigCity ? 'Büyükşehir Statüsünde' : 'Büyükşehir Statüsünde Değil');
  table.show();
}

function generateCulturePayTable(data) {
  var table = $('.culture-pay');
  table.find('#culture-pay-rate').text('%' + data.kulturPayi.oran);
  table.find('#culture-pay-amount').text(data.kulturPayi.tutar + '₺');
  table.show();
}

function generateInstallmentTable(data) {
  var table = $('.installment-table');
  var formattedFirstAmount =
    data.emlakVergisi.birinciTaksit.tutar.toFixed(0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + '₺';
  var formattedSecondAmount =
    data.emlakVergisi.ikinciTaksit.tutar.toFixed(0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + '₺';
  // property tax
  table.find('#property-first-tax-amount').text(formattedFirstAmount);
  table.find('#property-second-tax-amount').text(formattedSecondAmount);
  table.find('#property-first-tax-date').text(data.emlakVergisi.birinciTaksit.sonOdeme);
  table.find('#property-second-tax-date').text(data.emlakVergisi.ikinciTaksit.sonOdeme);
  // culture pay
  table.find('#culture-pay-first-amount').text(data.kulturPayi.birinciTaksit.tutar + '₺');
  table.find('#culture-pay-second-amount').text(data.kulturPayi.ikinciTaksit.tutar + '₺');
  table.find('#culture-pay-first-date').text(data.kulturPayi.birinciTaksit.sonOdeme);
  table.find('#culture-pay-second-date').text(data.kulturPayi.ikinciTaksit.sonOdeme);
  table.show();
}

$(document).ready(function() {
  $('.your-choise').hide();
  $('.property-tax').hide();
  $('.culture-pay').hide();
  $('.installment-table').hide();

  $('#property-tax').on('submit', function(e) {
    e.preventDefault();
    console.log('form submitted');
    var city = $('#city').val();
    var type = $('#type').val();
    var amount = $('#amount').val();

    if (document.querySelector('form').checkValidity() && city != 0 && type != 0) {
      $('input, select').removeClass('is-invalid');

      showLoading((loading = true));
      let url = 'http://localhost/hesaplama';
      $.ajax({
        url: `${url}/?city=${city}&type=${type}&amount=${amount}`,
        type: 'post',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        success: function(data) {
          console.log(data);
          generateYourChoiseTable(data);
          generatePropertyTaxTable(data);
          generateCulturePayTable(data);
          generateInstallmentTable(data);
          showLoading((loading = false));
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
