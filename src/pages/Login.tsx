import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, senha });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // { userId, nome, tipo }
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.mensagem || "Erro ao efetuar login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
      <input value={senha} onChange={e => setSenha(e.target.value)} placeholder="senha" type="password" />
      <button type="submit">Entrar</button>
    </form>
  );
}
