function history(){
    const data = JSON.stringify({
        'request_type' : 'history',
        'token' : sessionStorage.getItem('AuthenticationState'),
        'id_user' : sessionStorage.getItem('id_user')
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
            const dataTables = data_history.map(function(value){
                return (
                    `<tr>
                        <td>${value.trans_date}</td>
                        <td>${value.merchant_name}</td>
                    </tr>`
                );
            }).join('');
        const tabelBody = document.querySelector("#table_history");
        tabelBody.innerHTML = dataTables;
        document.getElementById("no_data").style.display = "none";
      })
      .catch(function(error) { 
        document.getElementById("table_history").style.display = "none";
      });  
}