import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {UserType} from "../context/UserContext";
import {IP, PORT, HTTPS} from './constants';

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
    let user : UserType = jwtDecode(token);
    return user;
}


export const isValidToken = () => {
    const token = getToken();
    if(!token) return false;
    const decodedToken = jwtDecode(token);
    if(!decodedToken || !decodedToken.exp) return false;
    const expirationTime = decodedToken?.exp * 1000;
    return expirationTime > Date.now()
}



export const axiosApi = (token: string) => {
    let baseUrl = `${HTTPS}://${IP}:${PORT}/api/`;
    if(!PORT) {
        baseUrl = `${HTTPS}://${IP}/api/`
    }

    return axios.create({
        baseURL: baseUrl,
        timeout: 1000,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
};

export const axiosHome = axios.create({
    baseURL: !!PORT ? `${HTTPS}://${IP}:${PORT}/` : `${HTTPS}://${IP}/`,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json"
    }
});

