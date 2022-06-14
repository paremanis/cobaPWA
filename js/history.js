var fetchData = '';
var dataTables = '';
var tbodyUser = '';
var table_head = '';
var tbodyMerchant = '';
var tbodysum = '';
var dataFiltered = '';
function history(){
    const user_type = sessionStorage.getItem('user_type');
    if(user_type == "user"){
        table_head = `<tr>
                            <th>No</th>
                            <th width="20%">Tanggal</th>
                            <th width="20%">Kode</th>
                            <th width="50%">Nama</th>
                          </tr>`;        
        document.getElementById("filter_history").style.display = "none";
        history_user();
    }
    else {        
        table_head = `<tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th style="text-align:center;">Jumlah</th>
                            <th></th>
                          </tr>`;
        document.getElementById("nrk").style.display = "none";
        history_merchant();
    } 
}

function history_user(){
  var data = JSON.stringify({
    'request_type' : 'history',
    'token' : sessionStorage.getItem('AuthenticationState'),
  });
  var data = JSON.stringify({
    'request_type' : 'history',
    'token' : sessionStorage.getItem('AuthenticationState'),
  });
  const url = "https://haris.globalprestasi.sch.id/api/vm.php";
  fetch(url, {
    method : "POST",
    headers : {
        'Accept' : 'application/JSON',
    },
    body : data,
  })
  .then((response)=> {
    return response.json();
  })
  .then((data)=> {
    const historyUser = data.data;
    if (historyUser.length === 0) {            
      document.getElementById("table_history").style.display = "none";
    } else {
      let i = 1;
      historyUser.forEach((element) => {              
          tbodyUser += `<tr> 
                          <td>${i++}</td>
                          <td>${element.trans_date}</td>
                          <td>${element.trans_code}</td>
                          <td>${element.merchant_name}</td>
                        </tr>`;
          const tabelHead = document.querySelector("#thead_history");
          tabelHead.innerHTML = table_head;
          const tabelBody = document.querySelector("#tbody_history");
          tabelBody.innerHTML = tbodyUser;            
          document.getElementById("no_data").style.display = "none";
      });
    }
  })
}

function history_merchant(){
  var data = JSON.stringify({
      'request_type' : 'history_merchant',
      'token' : sessionStorage.getItem('AuthenticationState'),
  });
  const url = "https://haris.globalprestasi.sch.id/api/vm.php";
  fetch(url, {
    method : "POST",
    headers : {
        'Accept' : 'application/JSON',
    },
    body : data,
  })
  .then((response)=> {
    return response.json();
  })
  .then((data)=> {
    const historyMerchant = data.data;
    let sumOrder = 0;
    fetchData = historyMerchant;
    if (historyMerchant.length === 0) {            
      document.getElementById("table_history").style.display = "none";
    } else if(localStorage.getItem("filter") === null){
      let i = 1;
      historyMerchant.forEach((element) => {        
        const trans_date = format_date(element.trans_date); 
        sumOrder += parseInt(element.jumlah);
        tbodyMerchant += `<tr onclick='setLocalTransDate("`+element.trans_date+`")'> 
                          <td>${i++}</td>
                          <td>${trans_date}</td>
                          <td style="text-align:center;">${element.jumlah}</td>
                          <td>
                          <div class="arrow"><span>Detail</span><img src="img/chevron-back.svg" class="detail"></div>
                          </td>
                          </tr>`;
        tbodysum = `<tr class="total-order">
                    <td></td>
                    <td>Total Order</td>
                    <td style="text-align:center;">${sumOrder}</td>
                    <td></td>
                    </tr>`;
      });
      const tabelHead = document.querySelector("#thead_history");
      tabelHead.innerHTML = table_head;
      const tabelBody = document.querySelector("#tbody_history");
      tabelBody.innerHTML = tbodyMerchant + tbodysum;            
      document.getElementById("no_data").style.display = "none";
      document.getElementById("date_end").value = getToday();
      document.getElementById("date_start").value = getPast();
    } else {
      filter_date();      
      let url_string = window.location;
      let url = new URL(url_string);    
      let start = url.searchParams.get("date_start");
      let end = url.searchParams.get("date_end");
      document.getElementById("date_end").value = end;
      document.getElementById("date_start").value = start;
    }
  })
}

function filter_date(){
  window.localStorage.setItem('filter', 'clicked');
  let url_string = window.location;
  let url = new URL(url_string);
  let start = url.searchParams.get("date_start");
  let end = url.searchParams.get("date_end");         
  let startDate = +new Date(start);
  let endDate = +new Date(end);
  let i = 1;  
  let sumOrder = 0;
  fetchData.filter((data) => {
    return +new Date(data.trans_date) >= startDate && +new Date(data.trans_date) <= endDate;
  })
  .forEach((element)=> {
    const trans_date = format_date(element.trans_date); 
                    sumOrder += parseInt(element.jumlah);
                    dataFiltered += `<tr onclick='setLocalTransDate("`+element.trans_date+`")'>
                                      <td>${i++}</td>
                                      <td>${trans_date}</td>
                                      <td style="text-align:center;">${element.jumlah}</td>
                                      <td>
                                      <div class="arrow"><span>Detail</span><img src="img/chevron-back.svg" class="detail"></div>
                                      </td>
                                    </tr>`;
                    dataFiltered2 = `<tr class="total-order">
                                      <td></td>
                                      <td>Total Order</td>
                                      <td style="text-align:center;">${sumOrder}</td>
                                      <td></td>
                                    </tr>`;
    const tabelHead = document.querySelector("#thead_history");
    tabelHead.innerHTML = table_head;
    const tabelBody = document.querySelector("#tbody_history");
    tabelBody.innerHTML = dataFiltered + dataFiltered2;
    document.getElementById("no_data").style.display = "none";
  })  
}

function order_merchant(){
    if (localStorage.getItem("date_order") === null) {
        var data = JSON.stringify({
            'request_type' : 'history_merchant_daily',
            'token' : sessionStorage.getItem('AuthenticationState'),             
        });
    } else {        
        var lclStrgDate = localStorage.getItem("date_order");
        var data = JSON.stringify({
            'request_type' : 'history_merchant_daily',
            'token' : sessionStorage.getItem('AuthenticationState'), 
            'date' : lclStrgDate        
        });
        document.getElementById("back-button").style.display = "block";
    }
    
    console.log(data);

    const url = "https://haris.globalprestasi.sch.id/api/vm.php";
    fetch(url, {
        method : "POST",
        headers : {
            'Accept' : 'application/JSON',
        },
        body : data,
    })
    .then((response) => {
        return response.json();
      })
      .then((data) => {
        const data_order = data.data;
        if (data_order.length === 0) {            
          document.getElementById("no_data").style.display = "block";
        } else {   
            let i = 1;         
            const dataTables = data_order.map(function(value){
                return (
                    `<tr>
                        <td>${i++}</td>
                        <td>${value.trans_time}</td>
                        <td>${value.trans_code}</td>
                        <td>${value.employee_name}</td>
                    </tr>`
                );
            }).join('');
            const tabelBody = document.querySelector("#tbody_order");
            tabelBody.innerHTML = dataTables;
            document.getElementById("order_info").style.display = "flex";
            document.getElementById("table_order").style.display = "table";
            document.getElementById("date_order").innerHTML = data.trans_date;
            document.getElementById("total_order").innerHTML = "TOTAL: " + data.total;
        }
      })
      .catch(function(error) { 
        console.log(error);
      });  
}

function format_date(d){
    const date = d.split("-");
    switch (date[1]) {
        case "01":
            month = "JAN";
          break;
        case "02":
            month = "FEB";
          break;
        case "03":
            month = "MAR";
          break;
        case "04":
            month = "APR";
          break;
        case "05":
            month = "MEI";
          break;
        case "06":
            month = "JUN";
          break;
        case  "07":
            month = "JUL";
          break;
        case  "08":
            month = "AUG";
          break;
        case  "09":
            month = "SEP";
          break;
        case  "10":
            month = "OKT";
          break;
        case  "11":
            month = "NOV";
          break;
        case  "12":
            month = "DES";
      }
    return date[2]+ " "+ month;
}

function setLocalTransDate(date){
    window.localStorage.setItem('date_order',date);
    window.open("/order.html", "_self");
}

function getToday(){
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return yyyy + '-' + mm + '-' + dd;
}

function getPast(){
  const today = new Date();
  var myPastDate=new Date(today);
    myPastDate.setDate(myPastDate.getDate() - 14);
  const yyyy = myPastDate.getFullYear();
  let mm = myPastDate.getMonth() + 1; // Months start at 0!
  let dd = myPastDate.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return yyyy + '-' + mm + '-' + dd;
}
