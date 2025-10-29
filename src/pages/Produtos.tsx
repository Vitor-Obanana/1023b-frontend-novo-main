import React, { useEffect, useState } from "react";
import api from "../api/api";

type Produto = {
  _id: string;
  nome: string;
  preco: number;
  categoria?: string;
  urlfoto?: string;
  descricao?: string;
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar produtos");
    }
  };

  return (
    <div>
      <h2>Produtos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {produtos.map(p => (
          <div key={p._id} style={{ border: "1px solid #ccc", padding: 8 }}>
            <h4>{p.nome}</h4>
            <p>R$ {p.preco.toFixed(2)}</p>
            <p>{p.categoria}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
