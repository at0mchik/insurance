import { jwtDecode } from "jwt-decode";

// const SECRET_KEY = 'vsmlsdmfls123412-+';

export const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);// можно проверить подпись, если JWT подписан HMAC
        return decoded;
    } catch (e) {
        console.error("Ошибка при расшифровке токена", e);
        return null;
    }
};

export const saveToken = (token) => {
    localStorage.setItem("jwt_token", token);
};

export const getToken = () => {
    return localStorage.getItem("jwt_token");
};
