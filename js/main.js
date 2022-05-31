const username = document.getElementById("username");
const password = document.getElementById("password");

function doLogin(){
    var data = JSON.stringify({
        'username' : username.value,
        'password' : password.value
    });
    
    // fetch API from mecallapi
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
            // cookies
            document.cookie = "uname=" + username.value;
            document.cookie = "pass=" + password.value;
            window.open('/scanner.html', '_self');
            return response.json();
        } else {
            alert('Pastikan username dan Pasword sudah bener');
        }
    })
}

function checkCookie() {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('uname='))) {
        
        const cUsername = document.cookie
        .split('; ')
        .find(row => row.startsWith('uname='))
        .split('=')[1];

        const cPassword = document.cookie
        .split('; ')
        .find(row => row.startsWith('pass='))
        .split('=')[1];
        
        username.value = cUsername;
        password.value = cPassword;
      }
}


