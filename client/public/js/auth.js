
function response (data) {
    let resp = data.responseText;
    try {
        if (data.message !== null) {
            resp = data.message;
        } else {
            resp = JSON.parse(data.responseText);
            resp = resp.message;
        }
    } catch (e) {}

    return resp;
}

$(".logout-btn").on('click', e => {
    e.preventDefault();
    $.ajax({
        url: '/logout',
        type: 'POST',
        data: {},
        success: (res) => {alert(response(res)); location.reload();},
        error: (res) => {alert(response(res));}
    });
});

$( document ).ready( () => {

   /* $('.balance__btn').on('click', e => {
        e.preventDefault();
        $.ajax({
            url: '/getbalance',
            type: 'POST',
            data: {},
            success: (res) => {showBalance(res.data);},
            error: (res) => {alert(response(res));}
        });
    });*/

    $('.add__btn').on('click', e => {
        e.preventDefault();

        let type     = $("#input-type").val();
        let currency = $("#input-currency").val();
        let date     = $("#input-date").val();
        let sum      = $("#input-sum").val();
        let description = $("#input-description").val();

        let data = {
            operationType: type,
            currency: currency,
            description: description,
            date: date,
            sum: sum
        };

        $.ajax({
            url: '/add',
            type: 'POST',
            data: data,
            success: (res) => {alert(response(res)); getBalance(); /*location.reload();*/},
            error: (res) => {alert(response(res));}
        });
    });

    $('.ok__btn').on('click', e => {
        e.preventDefault();

        let dateFrom  = $("#dateFrom").val();
        let dateTo    = $("#dateTo").val();
        let currency = $("#select-currency").val();

        const data = {
            dateTo: dateTo,
            dateFrom: dateFrom,
            currency: currency
        };

        $.ajax({
            url: '/getdata',
            type: 'POST',
            data: data,
            success: (res) => {showTable(res.data);},
            error: (res) => {alert(response(res));}
        });
    });

    function getBalance(){
        $.ajax({
            url: '/getbalance',
            type: 'POST',
            data: {},
            success: (res) => {showBalance(res.data);},
            error: (res) => {alert(response(res));}
        });
    };
    getBalance();

});

function formatDate(date){
    return date.substr(8,2) + "." + date.substr(5,2) + "." + date.substr(0,4) ;
}

function showTable(data){
    let TotalInc = 0;
    let TotalExp = 0;

    $(".trow").remove();
    $(".it-row").remove();
    $(".data-table").append(`<tr class="trow"><th style="border-bottom: 1px solid">Date</th><th style="border-bottom: 1px solid">Description</th><th style="border-bottom: 1px solid">Income</th><th style="border-bottom: 1px solid">Expence</th></tr>`);
    data.forEach((item, i, data) => {
        if(item.operationType == "+"){
            incSum = item.sum;
            expSum = 0;
            TotalInc += incSum;

        } else if(item.operationType == "-"){
            incSum = 0;
            expSum = item.sum;
            TotalExp += expSum;
        }
        $(".data-table").append(`<tr class="trow"><td >${formatDate(item.date)}</td><td >${item.description}</td><td>${incSum.toFixed(2)}</td><td >${expSum.toFixed(2)}</td></tr>`);
    });


    $(".data-table").append(`<tr class="it-row"><td colspan=2 style="border-top: 1px solid">Totals</td><td style="border-top: 1px solid">${TotalInc.toFixed(2)}</td><td style="border-top: 1px solid">${TotalExp.toFixed(2)}</td></tr>`);

};

function showBalance(data){
    //alert(data);
    let balance = {};
    $(".bal-li").remove();
    data.forEach((item)=> {
        let total = item.total;
        if(item._id.operationType == "-") total *= -1;
        if(balance[item._id.currency] === undefined) balance[item._id.currency] = 0;
        balance[item._id.currency] =  balance[item._id.currency] + total;
    });

    //alert(balance);
    for(item in balance) {
        $(".bal-ul").append(`<li class="list-group-item bal-li">${item}: ${balance[item].toFixed(2)}</li>`);
    };

};