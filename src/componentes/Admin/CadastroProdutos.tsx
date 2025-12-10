import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminCreateProduct() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [urlfoto, setUrlfoto] = useState("");
  const [descricao, setDescricao] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const tipoUsuario = localStorage.getItem("tipoUsuario");
    const token = localStorage.getItem("token");

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);

    if ((user.tipo || tipoUsuario || "").toLowerCase() !== "admin") {
      alert("Acesso negado: apenas ADMIN pode acessar esta página");
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(Number(preco))) {
      return alert("Preço inválido");
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      await api.post(
        "/produtos",
        {
          nome,
          preco: Number(preco),
          categoria,
          urlfoto,
          descricao,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Produto criado com sucesso");
      navigate("/produtos");
    } catch (err: any) {
      alert(err?.response?.data?.mensagem || "Erro ao criar produto");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "0 auto" }}>
      <h3>Cadastrar Produto ()</h3>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        required
      />

      <input
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        placeholder="Preço"
        required
      />

      <input
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        placeholder="Categoria"
      />

      <input
        value={urlfoto}
        onChange={(e) => setUrlfoto(e.target.value)}
        placeholder="URL da foto"
      />

      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição"
      />

      <button type="submit">Criar Produto</button>
    </form>
  );
}
