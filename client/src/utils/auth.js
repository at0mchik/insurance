import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);// можно проверить подпись, если JWT подписан HMAC
        return decoded;
    } catch (e) {
        console.error("Ошибка при расшифровке токена", e);
        return null;
    }
};

export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function getUserRole() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.user_role || null;
    } catch (e) {
        return null;
    }
}

export function isAuthenticated() {
    return !!localStorage.getItem('token');
}
