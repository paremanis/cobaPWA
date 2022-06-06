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
          console.log(data);
      })
      .catch(function(error) { 
          console.log(error);
      });  
}