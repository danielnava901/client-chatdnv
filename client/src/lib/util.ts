import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {UserType} from "../context/UserContext";

export const removeToken = () => {
    let token = getToken();
    document.cookie = `jwtToken=${token}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;;`;
}

export const storeToken = (token: string) => {
    let decoded = jwtDecode(token);
    if(decoded && decoded.exp) {
        document.cookie = `jwtToken=${token}; expires=${new Date(decoded.exp * 1000).toUTCString()};`;
    }
}

export const getToken = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)jwtToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
}

export const getUserFromToken = () => {
    if(!isValidToken()) {
        return false;
    }
    let token = getToken();
    return jwtDecode(token);
}


export const isValidToken = () => {
    const token = getToken();
    if(!token) return false;
    const decodedToken = jwtDecode(token);
    if(!decodedToken || !decodedToken.exp) return false;
    const expirationTime = decodedToken?.exp * 1000;
    return expirationTime > Date.now()
}

export const axiosApi = axios.create({
    baseURL: 'http://localhost:8080/api/',
    timeout: 1000,
    headers: {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/json"
    }
});

export const axiosHome = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 1000,
    headers: {
        "Content-Type": "application/json"
    }
});

