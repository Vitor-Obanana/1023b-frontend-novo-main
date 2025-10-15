import axios from "axios";

// Cria uma instância do Axios com a URL base do seu backend
const api = axios.create({
  baseURL: "http://localhost:8000", // 👈 aqui está a porta do seu backend
});

// Intercepta todas as requisições e adiciona o token JWT (se existir)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // pega o token salvo no login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // envia no header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepta respostas do servidor (ex: erro 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Acesso não autorizado — redirecionando para login...");
      console.log(error.response);
      localStorage.removeItem("token");
      // Opcional: redireciona para a página de login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
