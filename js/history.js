var fetchData = '';
var dataTables = '';
var table_head = '';
var filteredHead = '';
var dataFiltered = '';
function history(){
    const user_type = sessionStorage.getItem('user_type');
    if(user_type == "user"){
        var request_type = "history";
        table_head = `<tr>
                            <th>No</th>
                            <th width="20%">Tanggal</th>
                            <th width="20%">Kode</th>
                            <th width="50%">Nama</th>
                          </tr>`;        
        document.getElementById("filter_history").style.display = "none";
    }
    else {        
        var request_type = "history_merchant";
        table_head = `<tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th style="text-align:center;">Jumlah</th>
                            <th></th>
                          </tr>`;
        document.getElementById("nrk").style.display = "none";
    }
    var data = JSON.stringify({
        'request_type' : request_type,
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
    .then((response) => {
        return response.json();
      })
      .then((data) => {      
        const data_history = data.data;
        fetchData = data_history;
        if (data_history.length === 0) {            
            document.getElementById("table_history").style.display = "none";
        } else if(localStorage.getItem("filter") === null){
            let i = 1;
            data_history.forEach((element) => {               
                dataTables += `<tr> 
                                <td>${i++}</td>`;
                if(user_type == "user"){
                    dataTables += `<td>${element.trans_date}</td>
                                        <td>${element.trans_code}</td>
                                        <td>${element.merchant_name}</td>
                                    </tr>`;
                } else {                    
                    const trans_date = format_date(element.trans_date); 
                    dataTables += `<td>${trans_date}</td>
                                    <td style="text-align:center;">${element.jumlah}</td>
                                    <td>
                                    <input type="button" onclick='setLocalTransDate("`+element.trans_date+`")' value="Detail"/>
                                    </td>
                                    </tr>`;
                }
            });
            const tabelHead = document.querySelector("#thead_history");
            tabelHead.innerHTML = table_head;
            const tabelBody = document.querySelector("#tbody_history");
            tabelBody.innerHTML = dataTables;            
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
      .catch(function(error) { 
        console.log(error);
      });  
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
  fetchData.filter((data) => {
    return +new Date(data.trans_date) >= startDate && +new Date(data.trans_date) <= endDate;
  })
  .forEach((element)=> {
    const trans_date = format_date(element.trans_date); 
                    dataFiltered += `<tr>
                    <td>${i++}</td>
                    <td>${trans_date}</td>
                                    <td style="text-align:center;">${element.jumlah}</td>
                                    <td>
                                    <input type="button" onclick='setLocalTransDate("`+element.trans_date+`")' value="Detail"/>
                                    </td>
                                    </tr>`;
  });
  const tabelHead = document.querySelector("#thead_history");
  tabelHead.innerHTML = table_head;
  const tabelBody = document.querySelector("#tbody_history");
  tabelBody.innerHTML = dataFiltered;
  document.getElementById("no_data").style.display = "none";  
}

function history_merchant(){
    if (localStorage.getItem("date") === null) {
        var data = JSON.stringify({
            'request_type' : 'history_merchant_daily',
            'token' : sessionStorage.getItem('AuthenticationState'),             
        });
    } else {        
        var lclStrgDate = localStorage.getItem("date");
        var data = JSON.stringify({
            'request_type' : 'history_merchant_daily',
            'token' : sessionStorage.getItem('AuthenticationState'), 
            'date' : lclStrgDate        
        });
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
            document.getElementById("table_order").style.display = "none";
            document.getElementById("order_info").style.display = "none";
            document.getElementById("total_order").style.display = "none";
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
            document.getElementById("no_data").style.display = "none";
            document.getElementById("date_order").innerHTML = data.trans_date;
            document.getElementById("total_order").innerHTML = "TOTAL: " + data.total;
            console.log(data);
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
    window.localStorage.setItem('date',date);
    window.open("/order.html", "_self");
}

function clearLocalTransDate(date){
    localStorage.clear();
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
