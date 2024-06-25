document.addEventListener('DOMContentLoaded', () => {
    const createAccountForm = document.getElementById('createAccountForm');
    const loginForm = document.getElementById('loginForm');
    const showCreateAccount = document.getElementById('showCreateAccount');
    const showLogin = document.getElementById('showLogin');
    const loginBox = document.getElementById('loginBox');
    const createAccountBox = document.getElementById('createAccountBox');

    createAccountForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        clearMessages();

        if (validatePassword(data.password)) {
            try {
                const response = await fetch('users', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    console.log('Account creation successful');
                    showSuccess('Account created successfully. Please log in.');
                    showLoginPage();
                } else {
                    const responseData = await response.json().catch(() => ({ message: 'Account creation failed. Please try again.' }));
                    console.error('Account creation error:', responseData);
                    showError(responseData.message || 'Account creation failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('An error occurred. Please try again later.');
            }
        } else {
            showError('Password must have at least 8 characters, including a number, an uppercase letter, and a special character.');
        }
    });

    showCreateAccount.addEventListener('click', (event) => {
        event.preventDefault();
        loginBox.style.display = 'none';
        createAccountBox.style.display = 'block';
    });

    showLogin.addEventListener('click', (event) => {
        event.preventDefault();
        createAccountBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        console.log('Submitting login data:', data);
        
        clearMessages();

        try {
                const response = await fetch('/login', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.href = '/dashboard.html';
                } else {
                    const result = await response.json();
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
            }
        });

        loginForm.addEventListener('input', clearMessages);
});

function validatePassword(password) {
    const passwordRegExp = /^(?=.*\d)(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[a-z]).{8,}$/;
    return passwordRegExp.test(password);
}


function clearMessages() {
    loginMessageContainer.textContent = '';
    loginMessageContainer.classList.remove('error', 'success');
}

/* function clearErrorMessages() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.remove();
    }
} */

/* function showError(message) {
    let errorElement = document.getElementById('error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.style.color = '#ff4d4f';
        errorElement.style.marginTop = '10px';
        document.querySelector('.form-container').appendChild(errorElement);
    }
    errorElement.textContent = message;
} */

/* function showSuccess(message) {
    let successElement = document.getElementById('success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.id = 'success-message';
        successElement.style.color = '#28a745';
        successElement.style.marginTop = '10px';
        document.querySelector('.form-container').appendChild(successElement);
    }
    successElement.textContent = message;
} */

function showLoginPage() {
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('createAccountBox').style.display = 'none';
}
