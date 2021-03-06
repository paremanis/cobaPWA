var username = document.getElementById("username");
var password = document.getElementById("password");

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
            //set cookies + encode with btoa
            document.cookie = "uname=" + window.btoa(username.value) +"; max-age=" + 365*24*60*60 + ';secure';
            document.cookie = "pass=" + window.btoa(password.value) +"; max-age=" + 365*24*60*60 + ';secure';
            // set session storage
            sessionStorage.setItem("AuthenticationState", data.token);
            sessionStorage.setItem("AuthenticationExpires", new Date().addHours(4));
            sessionStorage.setItem("name", data.user.name);
            sessionStorage.setItem("id_user", data.user.id);            
            sessionStorage.setItem("nrk", data.user.nrk);         
            sessionStorage.setItem("avatar", data.user.avatar);
            sessionStorage.setItem("user_type", data.user_type);

            if (data.user_type == "user"){
                window.open('/history.html', '_self');  
            } else {
                window.open('/order.html', '_self'); 
            }
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
        
        //get cookies + decode with btoa
        username.value = window.atob(cUsername);
        password.value = window.atob(cPassword);
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
        nrk.innerHTML = "NRK: " + sessionStorage.getItem('nrk');

        fetch('footer.html')
        .then(response=> response.text())
        .then((text)=> {
            const user_type = sessionStorage.getItem('user_type');
            document.getElementById('menu_footer').innerHTML = text;

            if(user_type == "user"){
                document.getElementById("page_order").style.display = "none";
                document.getElementById("qr_code").style.display = "none";
            } 
            else {
                document.getElementById("page_scanner").style.display = "none";
                document.getElementById("profile").style.display = "none";
            }
            
            if(window.location.pathname == "/scanner.html"){
                document.getElementById("page_scanner").classList.add("active");
            }
            else if(window.location.pathname == "/qrcode.html"){
                document.getElementById("qr_code").classList.add("active");
                document.getElementById("qr").src = sessionStorage.getItem('avatar');
            }
            else if(window.location.pathname == "/history.html"){
                document.getElementById("page_history").classList.add("active");
            }
            else if(window.location.pathname == "/profile.html"){
                document.getElementById("profile").classList.add("active");
                document.getElementById("avatar").src = sessionStorage.getItem('avatar');
            }
            else if(window.location.pathname == "/order.html"){
                document.getElementById("page_order").classList.add("active");
            }
        });
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
        localStorage.removeItem("date_order");  
        localStorage.removeItem("filter");  
        window.open("/", "_self");
      })
      .catch(function(error) {
        console.log(error);
      });
}

function clearLocalTransDate(){ 
    localStorage.removeItem("date_order");  
    localStorage.removeItem("filter");   
}
