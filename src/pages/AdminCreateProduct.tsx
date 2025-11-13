import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminCreateProduct() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    if (!name.trim() || !price.toString().trim() || !category.trim() || !desc.trim()) {
      setMsg("Todos os campos são obrigatórios.");
      return;
    }

    const precoNum = parseFloat(price);
    if (!isFinite(precoNum) || precoNum <= 0) {
      setMsg("O preço deve ser um número válido maior que zero.");
      return;
    }

    const body = {
      name: name.trim(),
      price: precoNum,
      category: category.trim(),
      description: desc.trim(),
    };

    setLoading(true);
    try {
      await api.post("/products", body);
      setMsg("Produto criado com sucesso!");
      setName("");
      setPrice("");
      setCategory("");
      setDesc("");
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err: any) {
      console.error(err);
      const serverMsg =
        (err.response && err.response.data && (err.response.data.message || err.response.data.erro)) ||
        err.message ||
        "Erro ao criar produto";
      setMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Cadastrar Produto (Admin)</h2>
      {msg && (
        <div style={{ color: msg.toLowerCase().includes("erro") ? "red" : "green", marginBottom: 8 }}>
          {msg}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          placeholder="Preço"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <textarea placeholder="Descrição" value={desc} onChange={(e) => setDesc(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Criar Produto"}
        </button>
      </form>
    </div>
  );
}
