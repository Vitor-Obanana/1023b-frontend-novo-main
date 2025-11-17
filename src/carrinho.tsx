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
  const [carregando, setCarregando] = useState(false);
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
      setCarregando(true);
      const res = await api.get("/carrinho", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItens(res.data.itens || []);
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
      alert("Erro ao carregar carrinho. Faça login novamente.");
      navigate("/login");
    } finally {
      setCarregando(false);
    }
  }

  async function alterarQuantidade(produtoId: string, novaQuantidade: number) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Faça login!");

    try {
      await api.put(
        "/alterarQuantidade",
        { produtoId, novaQuantidade },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o estado local sem precisar recarregar o carrinho
      setItens((prev) =>
        prev.map((item) =>
          item.produtoId === produtoId
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );
    } catch (err: any) {
      alert(
        "Erro ao alterar quantidade: " +
          (err?.response?.data?.mensagem || err.message)
      );
    }
  }

  async function removerItem(produtoId: string) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Faça login!");

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

  // NOVA FUNÇÃO: LIMPAR CARRINHO COMPLETO
  async function limparCarrinho() {
    const token = localStorage.getItem("token");
    if (!token) return alert("Faça login!");

    if (itens.length === 0) {
      alert("Seu carrinho já está vazio!");
      return;
    }

    const confirmacao = window.confirm(
      "Tem certeza que deseja limpar todo o carrinho? Esta ação não pode ser desfeita."
    );

    if (!confirmacao) return;

    try {
      setCarregando(true);
      const response = await api.delete("/limparCarrinho", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setItens([]);
        alert("Carrinho limpo com sucesso!");
      }
    } catch (err: any) {
      console.error("Erro ao limpar carrinho:", err);
      alert(
        "Erro ao limpar carrinho: " +
          (err?.response?.data?.mensagem || err.message)
      );
    } finally {
      setCarregando(false);
    }
  }

  const total = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );

  return (
    <div className="carrinho-container">
      <h1>🛒 Meu Carrinho</h1>

      {carregando && <p>Carregando...</p>}

      {itens.length === 0 ? (
        <div className="carrinho-vazio">
          <p>Seu carrinho está vazio</p>
          <button className="voltar" onClick={() => navigate("/")}>
            ← Continuar Comprando
          </button>
        </div>
      ) : (
        <div>
          {/* BOTÃO LIMPAR CARRINHO - NOVO */}
          <div className="carrinho-acoes">
            <button 
              className="limpar-carrinho danger" 
              onClick={limparCarrinho}
              disabled={carregando}
            >
              🗑️ Limpar Carrinho
            </button>
          </div>

          {itens.map((item) => (
            <div key={item.produtoId} className="produto-card">
              <h3>{item.nome}</h3>
              <p>Preço: R$ {item.precoUnitario.toFixed(2)}</p>

              <div className="quantidade-container">
                <button
                  onClick={() =>
                    item.quantidade > 1 &&
                    alterarQuantidade(item.produtoId, item.quantidade - 1)
                  }
                  disabled={carregando}
                >
                  -
                </button>

                <span>{item.quantidade}</span>

                <button
                  onClick={() =>
                    alterarQuantidade(item.produtoId, item.quantidade + 1)
                  }
                  disabled={carregando}
                >
                  +
                </button>
              </div>

              <p>
                Subtotal: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
              </p>

              <button 
                className="danger" 
                onClick={() => removerItem(item.produtoId)}
                disabled={carregando}
              >
                Remover
              </button>
            </div>
          ))}

          <div className="carrinho-total">
            <h2>Total: R$ {total.toFixed(2)}</h2>
            <button 
              className="finalizar" 
              onClick={() => alert("Compra finalizada!")}
              disabled={carregando}
            >
              Finalizar Compra
            </button>
          </div>

          <button 
            className="voltar" 
            onClick={() => navigate("/")}
            disabled={carregando}
          >
            ← Voltar para produtos
          </button>
        </div>
      )}
    </div>
  );
}

export default Carrinho;