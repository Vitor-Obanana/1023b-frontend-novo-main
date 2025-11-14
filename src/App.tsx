import "./App.css";
import api from "./api/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ⭐ ADICIONADO

type ProdutoType = {
  _id: string;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
};

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [user, setUser] = useState<any>(null); // ⭐ ADICIONADO

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const tipoUsuario: string = (localStorage.getItem("tipoUsuario") || "")
    .trim()
    .toLowerCase();

  // ⭐ DECODIFICAR TOKEN PARA PEGAR NOME E TIPO
  useEffect(() => {
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      console.log("TOKEN DECODED -->", decoded); // 🔍 DEBUG
      setUser(decoded);
    } catch (err) {
      console.error("Token inválido:", err);
    }
  }, [token]);

  // --- Buscar produtos ---
  useEffect(() => {
    api
      .get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  // --- Logout ---
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    navigate("/login");
  }

  // --- Cadastrar produto (somente admin) ---
  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      nome: formData.get("nome") as string,
      preco: Number(formData.get("preco")),
      urlfoto: formData.get("urlfoto") as string,
      descricao: formData.get("descricao") as string,
    };

    try {
      const res = await api.post("/produtos", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos((prev) => [...prev, res.data]);
      form.reset();
    } catch (err: any) {
      alert(
        "Erro ao cadastrar produto: " +
          (err?.response?.data?.mensagem || err.message)
      );
    }
  }

  // --- Adicionar ao carrinho ---
  async function adicionarCarrinho(produtoId: string) {
    if (!token) {
      alert("Você precisa estar logado para adicionar ao carrinho!");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/adicionarItem",
        { produtoId, quantidade: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/carrinho");
    } catch (err: any) {
      alert(
        "Erro ao adicionar: " +
          (err?.response?.data?.mensagem || err.message)
      );
    }
  }

  // --- Excluir produto ---
  async function excluirProduto(produtoId: string) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${produtoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos((prev) => prev.filter((p) => p._id !== produtoId));
    } catch (err: any) {
      alert(
        "Erro ao excluir: " +
          (err?.response?.data?.mensagem || err.message)
      );
    }
  }

  // --- Ver carrinho ---
  function irParaCarrinho() {
    if (!token) {
      alert("Você precisa estar logado para acessar o carrinho!");
      navigate("/login");
      return;
    }
    navigate("/carrinho");
  }

  return (
    <>
      {/* ⭐ CAIXA COM NOME E TIPO DO USUÁRIO (CANTO SUPERIOR DIREITO) */}
      {user && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 20,
            background: "#222",
            color: "white",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            zIndex: 999,
            textAlign: "right",
          }}
        >
          <strong>Usuário: {user.nome}</strong>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>
            {user.tipo || user.tipoUsuario || user.role || "Tipo não encontrado"}
          </div>
        </div>
      )}

      <header>
        <h1>Catálogo de Produtos</h1>
        <div>
          <button onClick={() => navigate("/produtos")}>Produtos</button>

          {token ? (
            <>
              <button onClick={irParaCarrinho}>Ver Carrinho</button>
              <button className="danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </header>

      {tipoUsuario === "admin" && (
        <form onSubmit={handleForm} className="form-produto">
          <input type="text" name="nome" placeholder="Nome" required />
          <input type="number" name="preco" placeholder="Preço" required />
          <input type="text" name="urlfoto" placeholder="URL da Foto" required />
          <input type="text" name="descricao" placeholder="Descrição" required />
          <button type="submit">Cadastrar</button>
        </form>
      )}

      <div className="lista-produtos">
        <h2>Produtos Disponíveis</h2>
        {produtos.map((produto) => (
          <div key={produto._id} className="produto-card">
            <img src={produto.urlfoto} alt={produto.nome} />
            <h3>{produto.nome}</h3>
            <p>{produto.descricao}</p>
            <p>R$ {produto.preco.toFixed(2)}</p>

            <div className="botoes">
              {token ? (
                <button onClick={() => adicionarCarrinho(produto._id)}>
                  Adicionar ao carrinho
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                  disabled
                >
                  Faça login para comprar
                </button>
              )}

              {tipoUsuario === "admin" && (
                <button
                  className="danger"
                  onClick={() => excluirProduto(produto._id)}
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
