let html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.setAttribute('autoplay', '');
    html5QrCode.setAttribute('muted', '');
    html5QrCode.setAttribute('playsinline', '');
let html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { 
        fps: 50, 
        qrbox: 250,  
        rememberLastUsedCamera: true, 
}, verbose= false);
    html5QrcodeScanner.setAttribute('autoplay', '');
    html5QrcodeScanner.setAttribute('muted', '');
    html5QrcodeScanner.setAttribute('playsinline', '');
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    /* handle success */
    // console.log(`Code scanned = ` + decodedText, decodedResult);
    sendDataScaned(decodedText);
};
const config = { fps: 50,  qrbox: 250 };

html5QrCode.start({ facingMode: { exact: "environment"} }, config, qrCodeSuccessCallback).catch((err) => {
    // Start failed, handle it.
    html5QrcodeScanner.render(qrCodeSuccessCallback);
});

function sendDataScaned(idMerchant){
    const data = JSON.stringify({
        'request_type' : 'scan',
        'token' : sessionStorage.getItem('AuthenticationState'),
        'id_user' : sessionStorage.getItem('id_user'),
        'id_merchant' : idMerchant
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
