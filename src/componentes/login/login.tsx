import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../login.css";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  


  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, senha });
      const { token, tipoUsuario } = res.data;

      // Salva no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("tipoUsuario", tipoUsuario);

      navigate("/"); // Redireciona pra home
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || "Erro ao fazer login.");
    }
  }



  return (
    <div className="auth-background">
      <div className="glass-login">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Acesse sua conta</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <p className="error">{erro}</p>}

          <button className="login-btn" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
