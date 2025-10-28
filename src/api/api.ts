import axios from "axios";

// Base da API (troque se o backend estiver em outro host)
const api = axios.create({
  baseURL: "http://localhost:5123",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o token for inválido ou expirou, redireciona para o login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tipoUsuario");
      window.location.href = "/login";
    }

    // Rejeita o erro para o componente tratar se quiser
    return Promise.reject(error);
  }
);

export default api;
