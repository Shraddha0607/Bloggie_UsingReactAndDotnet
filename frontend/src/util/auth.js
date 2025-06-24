import {
    jwtDecode
} from 'jwt-decode';

export function getTokenDuration() {
    const storedExpirationDate = localStorage.getItem('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export function getAuthToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const decoded = jwtDecode(token);
    const roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

    const tokenDuration = getTokenDuration();

    if (tokenDuration < 0) {
        return 'EXPIRED';
    }

    return {
        token,
        roles,
        userName
    };
}

export function getUser() {
    const user = localStorage.getItem('userId');
    return user;
}

export function loader() {
    return getAuthToken();
}

export function checkAuthLoader() {
    const token = getAuthToken();

    if (!token) {
        return redirect('/auth');
    }

    return null;
}