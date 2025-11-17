import { useState, useEffect } from "react";
import api from "./api/api";
import { useNavigate } from "react-router-dom";

type ProdutoCarrinho = {
  produtoId: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  urlfoto?: string;
  precoOriginal?: number;
};

export default function Carrinho() {
  const [itens, setItens] = useState<ProdutoCarrinho[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [frete, setFrete] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa fazer login para acessar o carrinho!");
      navigate("/login");
      return;
    }
    carregarCarrinho(token);

    // Frete aleatório só para simulação
    setFrete(Number((Math.random() * 20 + 10).toFixed(2)));
  }, []);

  async function carregarCarrinho(token: string) {
    try {
      setCarregando(true);
      const res = await api.get("/carrinho", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItens(res.data.itens || []);
    } catch (err) {
      alert("Erro ao carregar carrinho.");
      navigate("/login");
    } finally {
      setCarregando(false);
    }
  }

  async function alterarQuantidade(produtoId: string, novaQuantidade: number) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.put(
        "/alterarQuantidade",
        { produtoId, novaQuantidade },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItens((prev) =>
        prev.map((item) =>
          item.produtoId === produtoId
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );
    } catch {
      alert("Erro ao alterar quantidade.");
    }
  }

  async function removerItem(produtoId: string) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api.post(
        "/removerItem",
        { produtoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItens((prev) => prev.filter((i) => i.produtoId !== produtoId));
    } catch {
      alert("Erro ao remover item.");
    }
  }

  async function limparCarrinho() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api.delete("/limparCarrinho", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItens([]);
      alert("Carrinho limpo!");
    } catch {
      alert("Erro ao limpar carrinho.");
    }
  }

  function aplicarCupom() {
    if (cupom.toLowerCase() === "desconto10") {
      setDesconto(0.1);
      alert("Cupom aplicado: 10% OFF!");
    } else if (cupom.toLowerCase() === "fretegratis") {
      setFrete(0);
      alert("Cupom aplicado: Frete grátis!");
    } else {
      alert("Cupom inválido!");
      setDesconto(0);
    }
  }

  const subtotal = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );

  const totalDesconto = subtotal * desconto;
  const totalFinal = subtotal - totalDesconto + frete;

  const parcelas = (totalFinal / 10).toFixed(2);

  return (
    <div className="carrinho-wrapper">
      <h1>🛒 Meu Carrinho</h1>

      <div className="progresso">
        <div className="barra">
          <div
            className="barra-progresso"
            style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }}
          ></div>
        </div>
        <p>
          {subtotal >= 200
            ? "🎉 Você ganhou frete grátis!"
            : `Faltam R$ ${(200 - subtotal).toFixed(2)} para frete grátis`}
        </p>
      </div>

      <div className="layout">
        <div className="lista-itens">
          {itens.length === 0 ? (
            <p>Seu carrinho está vazio</p>
          ) : (
            itens.map((item) => (
              <div key={item.produtoId} className="produto-card">
                <img
                  src={item.urlfoto || "https://via.placeholder.com/80"}
                  alt={item.nome}
                />

                <div className="info">
                  <h3>{item.nome}</h3>

                  <p className="preco">
                    {item.precoOriginal && (
                      <span className="preco-riscado">
                        R$ {item.precoOriginal.toFixed(2)}
                      </span>
                    )}
                    <strong>
                      R$ {item.precoUnitario.toFixed(2)}
                    </strong>
                  </p>

                  <div className="quantidade">
                    <button
                      onClick={() =>
                        item.quantidade > 1 &&
                        alterarQuantidade(
                          item.produtoId,
                          item.quantidade - 1
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      onClick={() =>
                        alterarQuantidade(
                          item.produtoId,
                          item.quantidade + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="subtotal">
                    Subtotal:{" "}
                    <strong>
                      R$
                      {(item.precoUnitario * item.quantidade).toFixed(2)}
                    </strong>
                  </p>

                  <button
                    className="remover"
                    onClick={() => removerItem(item.produtoId)}
                  >
                    ❌ Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="resumo">
          <h2>Resumo da Compra</h2>

          <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
          <p>Frete: R$ {frete.toFixed(2)}</p>

          {desconto > 0 && (
            <p className="desconto">
              Desconto: - R$ {totalDesconto.toFixed(2)}
            </p>
          )}

          <hr />

          <h3>Total: R$ {totalFinal.toFixed(2)}</h3>

          <p className="parcelamento">
            Ou 10x de <strong>R$ {parcelas}</strong> sem juros
          </p>

          <div className="cupom">
            <input
              type="text"
              placeholder="Digite seu cupom"
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
            />
            <button onClick={aplicarCupom}>Aplicar</button>
          </div>

          <button className="finalizar" onClick={() => alert("Compra finalizada!")}>
            Finalizar Compra
          </button>

          <button className="limpar" onClick={limparCarrinho}>
            🗑 Limpar Carrinho
          </button>

          <button className="voltar" onClick={() => navigate("/")}>
            ← Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
}
