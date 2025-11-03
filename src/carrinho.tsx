import { useState, useEffect } from "react";
import api from "./api/api"; // seu arquivo de API
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
    api.get("/carrinho")
      .then((res) => setItens(res.data.itens))
      .catch((err) => console.error("Erro ao buscar carrinho:", err));
  }, []);

  const removerItem = (produtoId: string) => {
    api.post("/removerItem", { produtoId })
      .then(() => setItens(prev => prev.filter(item => item.produtoId !== produtoId)))
      .catch((err) => alert("Erro ao remover item: " + (err?.response?.data?.mensagem || err.message)));
  };

  const total = itens.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", textAlign: "center" }}>
      <h1>Meu Carrinho</h1>

      {itens.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div>
          {itens.map(item => (
            <div key={item.produtoId} className="produto-card">
              <h3>{item.nome}</h3>
              <p>Preço: R$ {item.precoUnitario.toFixed(2)}</p>
              <p>Quantidade: {item.quantidade}</p>
              <p>Subtotal: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</p>
              <div className="botoes">
                <button className="danger" onClick={() => removerItem(item.produtoId)}>Remover</button>
              </div>
            </div>
          ))}

          <h2>Total: R$ {total.toFixed(2)}</h2>
          <button onClick={() => alert("Finalizar compra (não implementado)")} style={{ marginTop: "15px" }}>
            Finalizar Compra
          </button>
        </div>
      )}

      <button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>Voltar para produtos</button>
    </div>
  );
}

export default Carrinho;
