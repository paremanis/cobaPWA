const username = document.getElementById("username");
const password = document.getElementById("password");

function doLogin(){
    var data = JSON.stringify({
        'request_type' : 'login',
        'username' : username.value,
        'password' : password.value
    });
    
    // fetch API
    var url = "https://haris.globalprestasi.sch.id/api/vm.php";
    const alert = document.getElementById("alert");

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
            //set cookies
            document.cookie = "uname=" + username.value;
            document.cookie = "pass=" + password.value;
            // set session storage
            sessionStorage.setItem("AuthenticationState", data.token);
            sessionStorage.setItem("AuthenticationExpires", new Date().addHours(4));
            sessionStorage.setItem("name", data.user.name);
            sessionStorage.setItem("id_user", data.user.id);            
            sessionStorage.setItem("nrk", data.user.nrk);

            window.open('/scanner.html', '_self');  
      })
      .catch(function(error) {
            alert.classList.remove('hide');
            alert.classList.add('blink');
            setTimeout(() => {
                alert.classList.remove('blink');
            }, 1200);
      });
}

function checkCookie() {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('uname=')) && document.cookie.split(';').some((item) => item.trim().startsWith('pass='))) {
        
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
        const nama = document.getElementById("nama");
        const nrk = document.getElementById("nrk");

        nama.innerHTML = sessionStorage.getItem('name');
        nrk.innerHTML = "NRK : " + sessionStorage.getItem('nrk');
     }
}

Date.prototype.addHours = function(h) {    
    this.setTime(this.getTime() + (h*60*60*1000)); 
    return this;   
 }

function doLogout(){
    var logout = JSON.stringify({
        'request_type' : 'logout',
        'id_user' : sessionStorage.getItem('id_user')
    });
    
    // fetch API
    var url = "https://haris.globalprestasi.sch.id/api/vm.php";

    fetch(url, {
        method : "POST",
        headers : {
            'Accept' : 'application/JSON',
        },
        body : logout,
    })
    .then((response) => {
        return response.json();
      })
      .then((data) => {            
        sessionStorage.clear(); 
        window.open("/", "_self");
      })
      .catch(function(error) {
        console.log(error);
      });
}