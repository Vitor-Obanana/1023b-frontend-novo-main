import { useEffect, useState } from "react";
import api from "../api/api";

type Produto = {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Bianca - busca os produtos do backend
  useEffect(() => {
    api.get("/produtos")
      .then(res => setProdutos(res.data))
      .catch(err => console.error("Erro ao carregar produtos", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Produtos disponíveis</h1>
      <div className="grid grid-cols-3 gap-4">
        {produtos.map(prod => (
          <div key={prod._id} className="border p-3 rounded-xl shadow">
            <img src={prod.urlfoto} alt={prod.nome} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{prod.nome}</h2>
            <p className="text-sm">{prod.descricao}</p>
            <p className="font-bold text-green-700 mt-2">R$ {prod.preco}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
