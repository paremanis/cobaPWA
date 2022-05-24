function doLogin(){
    var username = document.getElementById("username");
    var password = document.getElementById("password");

    var data = JSON.stringify({
        'username' : username.value,
        'password' : password.value
    });

    var url = "https://www.mecallapi.com/api/login";

    fetch(url, {
        method : "POST",
        headers : {
            'Accept' : 'application/JSON',
            'Content-type' : 'application/JSON'
        },
        body : data,
    }).then(function(response){
        if (response.ok){
            alert('Login Berhasil, dengan');
            return response.json();
        } else {
            alert('Pastikan username dan Pasword sudah bener');
        }
    })
}

