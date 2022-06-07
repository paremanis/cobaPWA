function history(){
    const user_type = sessionStorage.getItem('user_type');
    if(user_type == "user"){
        var request_type = "history";
    }
    else {        
        var request_type = "history_merchant";
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
          if(user_type == "user"){
            var dataTables = data_history.map(function(value){
                return (
                    `<tr>
                        <td>${value.trans_date}</td>
                        <td>${value.merchant_name}</td>
                    </tr>`
                );
            }).join('');
          }
          else {
            var dataTables = data_history.map(function(value){
                return (
                    `<tr>
                        <td>${value.trans_date}</td>
                        <td>${value.jumlah}</td>
                    </tr>`
                );
            }).join('');
          }
            
        const tabelBody = document.querySelector("#tbody_history");
        tabelBody.innerHTML = dataTables;
        document.getElementById("no_data").style.display = "none";
      })
      .catch(function(error) { 
        document.getElementById("table_history").style.display = "none";
        console.log(error);
      });  
}

function history_merchant(){
    const data = JSON.stringify({
        'request_type' : 'history_merchant_daily',
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
        const data_order = data.data;
        const dataTables = data_order.map(function(value){
            return (
                `<tr>
                    <td>${value.trans_time}</td>
                    <td>${value.trans_code}</td>
                    <td>${value.employee_name}</td>
                </tr>`
            );
        }).join('');
        const tabelBody = document.querySelector("#tbody_order");
        tabelBody.innerHTML = dataTables;
        document.getElementById("no_data").style.display = "none";
        document.getElementById("date_order").innerHTML = 'Date : ' + data.trans_date;
        console.log(data);
      })
      .catch(function(error) { 
        document.getElementById("table_order").style.display = "none";
        console.log(error);
      });  
}
