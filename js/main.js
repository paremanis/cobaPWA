function doLogin(){
    var username = document.getElementById("username");
    var password = document.getElementById("password");

    var data = JSON.stringify({
        'username' : username.value,
        'password' : password.value
    });

    var url = "https://www.mecallapi.com/api/login";
    const alert = document.getElementById("alert");

    fetch(url, {
        method : "POST",
        headers : {
            'Accept' : 'application/JSON',
            'Content-type' : 'application/JSON'
        },
        body : data,
    }).then(function(response){
        if (response.ok){
            // alert('Login Berhasil, dengan');
            window.open('/scanner.html', '_self');
            return response.json();
        } else {
            // alert('Pastikan username dan Pasword sudah benar');
            alert.classList.remove('hide');
            alert.classList.add('blink');
            setTimeout(() => {
                alert.classList.remove('blink');
            }, 1200);
        }
    })
}

