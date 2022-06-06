function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned = ` + decodedText, decodedResult);
    const nama = document.getElementById("nama");
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
            'Content-type' : 'application/JSON'
        },
        body : data,
    })
    .then((response) => {
        return response.json();
      })
      .then((data) => {
            window.open('/notification.html', '_self');  
      })
      .catch(function(error) {
            window.open('/notification.html', '_self');  
      });   
}
var html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);