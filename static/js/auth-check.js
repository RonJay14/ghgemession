// Check if user is logged in by looking for session token or other auth indicator
function checkAuthentication() {
    // Try to get session data or auth token
    const isLoggedIn = document.cookie.includes('session=') || sessionStorage.getItem('loggedIn');
    
    if (!isLoggedIn) {
        Swal.fire({
            title: 'Session Expired!',
            text: 'Please log in to continue.',
            icon: 'warning',
            confirmButtonText: 'Login',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
        return false;
    }
    return true;
}

// Add event listener to check auth on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
});

// Add event listener for AJAX requests to check auth
document.addEventListener('ajaxStart', function() {
    checkAuthentication();
});

// Function to handle unauthorized responses from API calls
function handleUnauthorizedResponse(response) {
    if (response.status === 401 || response.status === 403) {
        Swal.fire({
            title: 'Session Expired!',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'Login',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
        return false;
    }
    return true;
}

// Add axios interceptor to check auth on all API calls
if (typeof axios !== 'undefined') {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                handleUnauthorizedResponse(error.response);
            }
            return Promise.reject(error);
        }
    );
}