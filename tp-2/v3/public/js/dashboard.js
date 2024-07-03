document.addEventListener('DOMContentLoaded', function() {
    console.log('Full document.cookie:', document.cookie);
    const token = getCookie('token');
    const logoutButton = document.getElementById('logoutButton');

    if (!token) {
        alert('No token found. Please log in.');
        console.log('Token not found in cookies.');
        window.location.href = '/index.html';
        return;
    }

    console.log('Token found:', token);

    try {
        const decodedToken = parseJwt(token);
        console.log('Decoded token:', decodedToken);
        
        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Current time:', currentTime, 'Token expiration time:', decodedToken.exp);

        if (decodedToken.exp < currentTime) {
            alert('Session expired. Please log in again.');
            console.log('Token expired.');
            window.location.href = '/index.html';
            return;
        }

        // Calculate time remaining before token expires
        const timeRemaining = (decodedToken.exp - currentTime) * 1000;

        // Set a timeout to automatically log out when token expires
        setTimeout(() => {
            alert('Session expired. Please log in again.');
            console.log('Automatic logout triggered.');
            window.location.href = '/index.html';
        }, timeRemaining);

        console.log('Token is valid.');

    } catch (error) {
        console.error('Error validating token:', error);
        window.location.href = '/index.html';
    }

    logoutButton.addEventListener('click', function() {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/index.html';
    });
});

// Helper function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // Return null if cookie is not found
}

// Helper function to decode JWT (JSON Web Token)
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
