// clear-cache.js
console.log('Clearing browser caches and storage...');

// Run this in browser context
function clearBrowserData() {
  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    console.log('Clearing localStorage...');
    localStorage.clear();
  }
  
  // Unregister service workers
  if ('serviceWorker' in navigator) {
    console.log('Unregistering service workers...');
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  
  // Clear caches
  if ('caches' in window) {
    console.log('Clearing caches...');
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  console.log('Cache clearing complete. Refreshing page...');
  setTimeout(() => window.location.reload(true), 1000);
}

// Export for use in components
export default clearBrowserData;