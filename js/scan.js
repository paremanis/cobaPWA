function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned = ` + decodedText, decodedResult);
    const data = JSON.stringify({
        'request_type' : 'scan',
        'token' : sessionStorage.getItem('AuthenticationState'),
        'id_user' : sessionStorage.getItem('nrk'),
        'id_merchant' : decodedText
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
          if (data.status == "error"){
            localStorage.setItem("scan_status", "error");            
            localStorage.setItem("error_message", data.message);
            window.open('/notification.html', '_self'); 
          } else {              
            localStorage.setItem("scan_status", "success");             
            window.open('/notification.html', '_self');     
            localStorage.setItem("trans_code", data.trans_code);    
            localStorage.setItem("merchant", data.merchant);
          }
      })
      .catch(function(error) { 
          console.log(error);
      });   
}
var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);