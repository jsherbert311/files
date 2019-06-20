$(function(){
    var d = new Date();
    var current_month = d.getMonth();
    var year_list = document.getElementById('year_list');
    generate_year_list(year_list, 50);
    $('#yearly_month_list').val(current_month + 1).find("option[value=" + current_month + 1 + "]").attr("selected", true);
    $('#one_time_month_list').val(current_month + 1).find("option[value=" + current_month + 1 + "]").attr("selected", true);

    amort(1000, 0.1, 12, 0, 0, 0);

    $("#loanAmount").keyup(function() {
        validateInputs($(this));
    });
    setInputFilter(document.getElementById("loanAmount"), function(value) {
        return /^\d*\.?\d*$/.test(value);
    });

    $("#termInMonths").keyup(function() {
        validateInputs($(this));
    });
    setInputFilter(document.getElementById("termInMonths"), function(value) {
        return /^\d*$/.test(value);
    });

    $("#interestRate").keyup(function() {
        validateInputs($(this));
    });
    setInputFilter(document.getElementById("interestRate"), function(value) {
        return /^\d*\.?\d*$/.test(value);
    });

    $("#monthlyExtraPayment").keyup(function() {
        validateExtraInputs($(this));
    });
    setInputFilter(document.getElementById("monthlyExtraPayment"), function(value) {
        return /^\d*\.?\d*$/.test(value);
    });

    $("#yearlyExtraPayment").keyup(function() {
        validateExtraInputs($(this));
    });
    setInputFilter(document.getElementById("yearlyExtraPayment"), function(value) {
        return /^\d*\.?\d*$/.test(value);
    });

    $("#oneTimeExtraPayment").keyup(function() {
        validateExtraInputs($(this));
    });

    setInputFilter(document.getElementById("oneTimeExtraPayment"), function(value) {
        return /^\d*\.?\d*$/.test(value);
    });

    $('#loan-calculator-button').click(function(){
        var loanAmount = document.getElementById('loanAmount').value;
        var calculated_loanAmount = parseInt(document.getElementById('loanAmount').value.replace(',', ''));

        var termsInMonths = parseInt(document.getElementById('termInMonths').value);

        var interestRate = document.getElementById('interestRate').value;
        var monthly_interestRate = Math.round((interestRate / 12) / 100 * 100000000) / 100000000;

        var monthly_payments = monthly_payment_formula(monthly_interestRate, termsInMonths, calculated_loanAmount);
        document.getElementById('monthly-payments').innerHTML = '<span class="numeral__accent --currency">$</span>' + numberWithCommas(monthly_payments);
        document.getElementById('total_principal_value').innerHTML = '$' + numberWithCommas(loanAmount);
        document.getElementById('total_interest_paid').innerHTML = '$' + numberWithCommas(total_interest_paid(monthly_payments, termsInMonths, calculated_loanAmount, monthly_interestRate));
        amort(calculated_loanAmount, interestRate/100, termsInMonths, 0, 0, 0);
    })

    $('.calculator__amortization-link').click(function() {
        var amortization_letter = document.getElementById('amortization-schedule-letter').innerHTML;
        var calculated_loanAmount = parseInt(document.getElementById('loanAmount').value.replace(',', ''));
        var termsInMonths = parseInt(document.getElementById('termInMonths').value);
        var interestRate = parseFloat(document.getElementById('interestRate').value);
        var monthly_extra_payment = parseFloat(document.getElementById('monthlyExtraPayment').value);
        var yearly_extra_payment = parseFloat(document.getElementById('yearlyExtraPayment').value);
        var one_time_extra_payment = parseFloat(document.getElementById('oneTimeExtraPayment').value);

        var chartContainer = document.getElementById('chartContainer');

        if (amortization_letter.includes('Show')) {
            chartContainer.style.cssText = "height: 100%; width: 100%; display: block;";
            amort(calculated_loanAmount, interestRate/100, termsInMonths, monthly_extra_payment, yearly_extra_payment, one_time_extra_payment);
            document.getElementById('amortization-schedule-letter').innerHTML = 'Hide amortization schedule';
        }
        else {
            chartContainer.style.cssText = "display: none;";
            document.getElementById('amortization-schedule-letter').innerHTML = 'Show amortization schedule';
        }
    })

    $('.calculator__calibre').click(function() {
        var calculator_extract_payments_letter = document.getElementById('extra-payments-letter').innerHTML;
        if (calculator_extract_payments_letter.includes('ADD')) {
            document.getElementById('extra-payments-dropdown').style.cssText = "display:block;padding-top: 15px;";
            document.getElementById('extra-payments-letter').innerHTML = 'HIDE EXTRA PAYMENTS';
        }
        else {
            document.getElementById('extra-payments-dropdown').style.cssText = "display:none;padding-top: 15px;";
            document.getElementById('extra-payments-letter').innerHTML = 'ADD EXTRA PAYMENTS';
        }
    })

    $('#apply_extra_payments_button').click(function() {
        var monthly_extra_payment = parseFloat(document.getElementById('monthlyExtraPayment').value);
        var yearly_extra_payment = parseFloat(document.getElementById('yearlyExtraPayment').value);
        var one_time_extra_payment = parseFloat(document.getElementById('oneTimeExtraPayment').value);

        var loanAmount = document.getElementById('loanAmount').value;
        if ((monthly_extra_payment > loanAmount) || (yearly_extra_payment > loanAmount) || (one_time_extra_payment > loanAmount) ) {
            $('.extra-payment-errors').children('span').addClass('+display-block').removeClass('+display-none');
            
            $('#loan-calculator-button').addClass('--is-disabled');
            $('#loan-calculator-button').attr('disabled', true);

            $('.calculator__amortization-link').attr('disabled', true);

            $('.save-button').addClass('--is-disabled');
            $('.save-button').attr('disabled', true);

            $('#apply_extra_payments_button').addClass('--is-disabled');
            $('#apply_extra_payments_button').attr('disabled', true);
        }

        else {
            $('.extra-payment-errors').children('span').addClass('+display-none').removeClass('+display-block');
            var calculated_loanAmount = parseInt(loanAmount.replace(',', ''));
            var termsInMonths = parseInt(document.getElementById('termInMonths').value);
            var interestRate = document.getElementById('interestRate').value;

            amort(calculated_loanAmount, interestRate/100, termsInMonths, monthly_extra_payment, yearly_extra_payment, one_time_extra_payment)
        }
    })
});

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup"].forEach(function(event) {
        textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
        });
    });
}

function monthly_payment_formula(r, N, P) {
    // r - the monthly interest rate, N - the number of monthly payments, P - the amount borrowed
    var c;
    if (r!=0) {
        c = (r * P * Math.pow(1+r, N)) / (Math.pow(1+r, N) - 1);
    }
    else {
        c = P / N;
    }
    return parseFloat(c.toFixed(2));
}

function total_interest_paid(c, N, P, r) {
    // c - montly payments, N - terms in Months, P - loan Amount
    value = (P * r - c) * ((Math.pow(1+r, N) - 1) / r) + c*N;
    return parseFloat(value.toFixed(2)); 
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generate_year_list(year_list, range) {
    var current_year = new Date().getFullYear();
    for (var i = current_year; i < current_year + range; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        if (i == current_year) {
            opt.selected = true;
        }
        year_list.appendChild(opt);
    }
}

function amort(balance, interestRate, terms, monthly_extra_payment, yearly_extra_payment, one_time_extra_payment)
{
    //Calculate the per month interest rate
    var monthlyRate = interestRate/12;
    
    //Calculate the payment
    var payment = balance * (monthlyRate/(1-Math.pow(1 + monthlyRate, -terms)));
    
    /**
    * Loop that calculates the monthly Loan amortization amounts then adds 
    * them to the return string 
    */
    var total_interest = 0;
    var data = [];
    var now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var current_month = now.getMonth();
    var current_year = now.getFullYear();

    var yearly_month_list = document.getElementById('yearly_month_list');
    var selected_month = yearly_month_list.options[yearly_month_list.selectedIndex].value;

    var one_time_month_list = document.getElementById('one_time_month_list');
    var one_time_selected_month = one_time_month_list.options[one_time_month_list.selectedIndex].value;

    var one_time_year_list = document.getElementById('year_list');
    var one_time_selected_year = one_time_year_list.options[one_time_year_list.selectedIndex].value;

    if (monthly_extra_payment) {
        payment = payment + monthly_extra_payment;

        while(balance > 0) {
            var principal = 0;
            var interest = parseFloat(balance / terms * interestRate);

            if ((yearly_extra_payment) && (current_month + 1 == selected_month)) {
                if ((current_month + 1 == one_time_selected_month) && (current_year == one_time_selected_year)) {
                    principal = payment + yearly_extra_payment + one_time_extra_payment - interest;
                }
                else {
                    principal = payment + yearly_extra_payment - interest;
                }
                balance -= principal;
                current_month += 1;
            }

            else if ((one_time_extra_payment) && (current_month + 1 == one_time_selected_month) && (current_year == one_time_selected_year)) {
                principal = payment + one_time_extra_payment - interest;
                balance -= principal;
                current_month += 1;
            }

            else {
                if (balance < monthly_extra_payment) {
                    balance = 0;
                    current_month += 1;
                }
                else {
                    principal = payment - interest;
                    balance -= principal;
                    current_month += 1;
                }
            }

            if (current_month == 12) {
                current_year = current_year + 1;
                current_month = 0;
                var label = monthNames[current_month] + '' + current_year;
            }

            else {
                var label = monthNames[current_month] + '' + current_year;
            }

            data.push({value: interest.toFixed(2), label: label});
            total_interest += interest;
        }
    }

    else if (yearly_extra_payment) {
        while(balance > 0) {
            var principal = 0;
            var interest = parseFloat(balance / terms * interestRate);

            if (current_month + 1 == selected_month) {
                if ((one_time_extra_payment) && (current_month + 1 == one_time_selected_month) && (current_year == one_time_selected_year)) {
                    principal = payment + yearly_extra_payment + one_time_extra_payment - interest;
                }
                else {
                    principal = payment + yearly_extra_payment - interest;
                }
            }

            else if ((one_time_extra_payment) && (current_month + 1 == one_time_selected_month) && (current_year == one_time_selected_year)) {
                principal = payment + one_time_extra_payment - interest;
            }

            else {
                principal = payment - interest;
            }

            balance -= principal;
            current_month += 1;

            if (current_month == 12) {
                current_year = current_year + 1;
                current_month = 0;
                var label = monthNames[current_month] + '' + current_year;
            }

            else {
                var label = monthNames[current_month] + '' + current_year;
            }

            data.push({value: interest.toFixed(2), label: label});
            total_interest += interest;
        }
    }

    else if (one_time_extra_payment) {
        while(balance > 0) {
            var principal = 0;
            var interest = parseFloat(balance / terms * interestRate);

            if ((current_month + 1 == one_time_selected_month) && (current_year == one_time_selected_year)) {
                principal = payment + one_time_extra_payment - interest;
            }

            else {
                principal = payment - interest;
            }

            balance -= principal;
            current_month += 1;

            if (current_month == 12) {
                current_year = current_year + 1;
                current_month = 0;
                var label = monthNames[current_month] + '' + current_year;
            }

            else {
                var label = monthNames[current_month] + '' + current_year;
            }

            data.push({value: interest.toFixed(2), label: label});
            total_interest += interest;
        }
    }

    else {
        for (var count = 0; count < terms; ++count)
        { 
            //in-loop interest amount holder
            var interest = 0;
            
            //in-loop monthly principal amount holder
            var monthlyPrincipal = 0;

            if (now.getMonth() + count >= 11) {
                var label = new Date(now.getFullYear() + 1, count);
            }
            else {
                var label = new Date(now.getFullYear(), now.getMonth() + count + 1)
            }

            label = monthNames[label.getMonth()] + label.getFullYear();

            //calc the in-loop interest amount and display
            interest = balance * monthlyRate;

            data.push({value: interest.toFixed(2), label: label});
            
            //calc the in-loop monthly principal and display
            monthlyPrincipal = payment - interest;
            total_interest += interest;
            
            //update the balance for each loop iteration
            balance = balance - monthlyPrincipal;
        }
    }

    total_interest = total_interest.toFixed(2);
    document.getElementById('total_interest_paid').innerHTML = '$' + numberWithCommas(total_interest);

    am4core.ready(function() {
        am4core.useTheme(am4themes_spiritedaway);
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartContainer", am4charts.PieChart);
        chart.data = data;
        chart.numberFormatter.numberFormat = "$#.##";

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "label";
        pieSeries.labels.template.relativeRotation = 90;
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        var hs = pieSeries.slices.template.states.getKey("hover");
        hs.properties.scale = 0.9;

        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
    });
}

function validateInputs(selector)
{
    if((selector.val() == null) || (selector.val() == "") || (selector.val() == "0")) {
        selector.parent().addClass('--has-error');
        selector.parent().children('.error-message').css('display', 'block');

        $('#loan-calculator-button').addClass('--is-disabled');
        $('#loan-calculator-button').attr('disabled', true);

        $('.calculator__amortization-link').attr('disabled', true);

        $('.save-button').addClass('--is-disabled');
        $('.save-button').attr('disabled', true);

        $('#apply_extra_payments_button').addClass('--is-disabled');
        $('#apply_extra_payments_button').attr('disabled', true);
    }
    else {
        selector.parent().removeClass('--has-error');
        selector.parent().children('.error-message').css('display', 'none');

        if (validate($("#loanAmount").val()) && validate($("#termInMonths").val()) && validate($("#interestRate").val()) && 
            validateExtra($("#monthlyExtraPayment").val()) && validateExtra($("#yearlyExtraPayment").val()) && validateExtra($("#oneTimeExtraPayment").val())) {
            $('#loan-calculator-button').removeClass('--is-disabled');
            $('#loan-calculator-button').attr('disabled', false);

            $('.calculator__amortization-link').attr('disabled', false);

            $('.save-button').removeClass('--is-disabled');
            $('.save-button').attr('disabled', false);

            $('#apply_extra_payments_button').removeClass('--is-disabled');
            $('#apply_extra_payments_button').attr('disabled', false);
        }
    }
}

function validateExtraInputs(selector)
{
    if((selector.val() == null) || (selector.val() == "")) {
        $('#loan-calculator-button').addClass('--is-disabled');
        $('#loan-calculator-button').attr('disabled', true);

        $('.calculator__amortization-link').attr('disabled', true);

        $('.save-button').addClass('--is-disabled');
        $('.save-button').attr('disabled', true);

        $('#apply_extra_payments_button').addClass('--is-disabled');
        $('#apply_extra_payments_button').attr('disabled', true);
    }
    else {
        selector.parent().removeClass('--has-error');
        selector.parent().children('.error-message').css('display', 'none');

        if (validate($("#loanAmount").val()) && validate($("#termInMonths").val()) && validate($("#interestRate").val()) && 
            validateExtra($("#monthlyExtraPayment").val()) && validateExtra($("#yearlyExtraPayment").val()) && validateExtra($("#oneTimeExtraPayment").val())) {
            $('#loan-calculator-button').removeClass('--is-disabled');
            $('#loan-calculator-button').attr('disabled', false);

            $('.calculator__amortization-link').attr('disabled', false);

            $('.save-button').removeClass('--is-disabled');
            $('.save-button').attr('disabled', false);

            $('#apply_extra_payments_button').removeClass('--is-disabled');
            $('#apply_extra_payments_button').attr('disabled', false);
        }
    }
}

function validate(value) {
    if ((value == null) || (value == "") || (value == "0")) {
        return false;
    }
    else {
        return true;
    }
}

function validateExtra(value) {
    if ((value == null) || (value == "")) {
        return false;
    }
    else {
        return true;
    }
}