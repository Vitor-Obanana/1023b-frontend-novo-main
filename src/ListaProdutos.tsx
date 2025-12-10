import { useState, useEffect } from 'react';
import api from "./api/api";
import "./ListaProdutos.css";

type ProdutoType = {
  _id: string;
  nome: string;
  preco: number; // agora já vem em reais do backend
  descricao: string;
  urlfoto: string;
  categoria?: string;
  avaliacao?: number;
  estoque?: number;
};

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await api.get("/produtos");

        // NÃO converter nada! O preço já está em reais.
        setProdutos(resposta.data as ProdutoType[]);

      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    carregarProdutos();
  }, []);

  return (
    <div className="lista-produtos">
      {produtos.map(prod => (
        <div key={prod._id} className="produto">
          <img src={prod.urlfoto} alt={prod.nome} />
          <h3>{prod.nome}</h3>

          {/* Exibir em formato de dinheiro */}
          <p className="preco">
            {prod.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          <p>{prod.descricao}</p>
        </div>
      ))}
    </div>
  );
}