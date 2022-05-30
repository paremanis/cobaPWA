if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
        console.log('SW registered with scope:', registration.scope);
        })
        .catch(err => {
        console.error('Registration failed:', err);
        });
    });
   }