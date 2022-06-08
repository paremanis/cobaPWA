function history(){
    const user_type = sessionStorage.getItem('user_type');
    if(user_type == "user"){
        var request_type = "history";
        var table_head = `<tr>
                            <th>No</th>
                            <th>Tanggal Transaksi</th>
                            <th>Kode Transaksi</th>
                            <th>Nama Merchant</th>
                          </tr>`;        
        document.getElementById("filter_history").style.display = "none";
    }
    else {        
        var request_type = "history_merchant";
        var table_head = `<tr>
                            <th>No</th>
                            <th>Tanggal Transaksi</th>
                            <th>Jumlah Pesanan</th>
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
        if (data_history.length === 0) {            
            document.getElementById("table_history").style.display = "none";
        } else {
            let i = 1;
            let dataTables = '';
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
                                    <td>${element.jumlah}</td>
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
            console.log(data)
        }            
      })
      .catch(function(error) { 
        console.log(error);
      });  
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
