document.getElementById('logoutButton').addEventListener('click', async function () {
    try {
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/index.html';
    } catch (error) {
        alert('An error occurred during logout. Please try again.');
    }

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');  
        window.location.href = '/index.html'; 
    });
});
