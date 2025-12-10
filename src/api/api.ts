import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Adiciona o token automaticamente no header
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.token) {
            if (config.headers) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    }
    return config;
});

// Redireciona para login quando 401 e não for /login
api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error?.code === "ERR_NETWORK") {
            window.location.href = `/error?mensagem=${encodeURIComponent(
                "Ligue o Servidor -> NPM RUN DEV"
            )}`;
        }

        const status = error?.response?.status;

        if (
            status === 401 &&
            !(error?.response?.config?.url.endsWith("/login"))
        ) {
            localStorage.removeItem("user"); // limpar o usuário inteiro
            window.location.href = `/login?mensagem=${encodeURIComponent(
                "Token inválido"
            )}`;
        }

        return Promise.reject(error);
    }
);

export default api;
