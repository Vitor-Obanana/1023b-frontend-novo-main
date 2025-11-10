import { useState, useEffect } from "react";
import api from "./api/api";
import { useNavigate } from "react-router-dom";

type ProdutoCarrinho = {
  produtoId: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
};

function Carrinho() {
  const [itens, setItens] = useState<ProdutoCarrinho[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa fazer login para acessar o carrinho!");
      navigate("/login");
      return;
    }
    carregarCarrinho(token);
  }, []);

  async function carregarCarrinho(token: string) {
    try {
      const res = await api.get("/carrinho", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItens(res.data.itens || []);
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
      alert("Erro ao carregar carrinho. Faça login novamente.");
      navigate("/login");
    }
  }

  async function removerItem(produtoId: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para remover um item!");
      return;
    }

    try {
      await api.post(
        "/removerItem",
        { produtoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItens((prev) => prev.filter((i) => i.produtoId !== produtoId));
    } catch (err: any) {
      alert("Erro ao remover item: " + (err?.response?.data?.mensagem || err.message));
    }
  }

  const total = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );

  return (
    <div className="carrinho-container">
      <h1>Meu Carrinho</h1>

      {itens.length === 0 ? (
        <p>Seu carrinho está vazio</p>
      ) : (
        <div>
          {itens.map((item) => (
            <div key={item.produtoId} className="produto-card">
              <h3>{item.nome}</h3>
              <p>Preço: R$ {item.precoUnitario.toFixed(2)}</p>
              <p>Quantidade: {item.quantidade}</p>
              <p>
                Subtotal: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
              </p>
              <button className="danger" onClick={() => removerItem(item.produtoId)}>
                Remover
              </button>
            </div>
          ))}

          <h2>Total: R$ {total.toFixed(2)}</h2>
          <button className="finalizar" onClick={() => alert("Compra finalizada!")}>
            Finalizar Compra
          </button>
        </div>
      )}

      <button className="voltar" onClick={() => navigate("/")}>
        ← Voltar para produtos
      </button>
    </div>
  );
}

export default Carrinho;


