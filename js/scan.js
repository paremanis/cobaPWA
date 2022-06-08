function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned = ` + decodedText, decodedResult);
    const data = JSON.stringify({
        'request_type' : 'scan',
        'token' : sessionStorage.getItem('AuthenticationState'),
        'id_user' : sessionStorage.getItem('id_user'),
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
            sessionStorage.setItem("scan_status", "error");            
            sessionStorage.setItem("error_message", data.message);
            window.open('/notification.html', '_self'); 
          } else {              
            sessionStorage.setItem("scan_status", "success");   
            sessionStorage.setItem("trans_code", data.trans_code);    
            sessionStorage.setItem("merchant", data.merchant);    
            sessionStorage.setItem("date_scan", data.date);             
            window.open('/notification.html', '_self');   
          }
          console.log(data);
      })
      .catch(function(error) { 
          console.log(error);
      });   
}
var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250, rememberLastUsedCamera: true, });
html5QrcodeScanner.render(onScanSuccess);