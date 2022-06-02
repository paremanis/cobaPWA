const username = document.getElementById("username");
const password = document.getElementById("password");

function doLogin(){
    var data = JSON.stringify({
        'username' : username.value,
        'password' : password.value
    });
    
    // fetch API from mecallapi
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
            // cookies
            document.cookie = "uname=" + username.value;
            document.cookie = "pass=" + password.value;

            sessionStorage.setItem("AuthenticationState", "Authenticated");
                
            //This authentication key will expire in 1 hour.
            sessionStorage.setItem("AuthenticationExpires", new Date().addHours(4));
            
            //Push the user over to the next page.
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
        // alert(new Date().addHours(4));
      }
}

function checkSession(){
    if (sessionStorage.getItem('AuthenticationState') === null) {
        window.open("/", "_self");
     }
     //Is their authentication token still valid?
     else if (Date.now > new Date(sessionStorage.getItem('AuthenticationExpires'))) {
           window.open("/", "_self");
     }
     else {
       //The user is authenticated and the authentication has not expired.
     }
}

Date.prototype.addHours = function(h) {    
    this.setTime(this.getTime() + (h*60*60*1000)); 
    return this;   
 }


