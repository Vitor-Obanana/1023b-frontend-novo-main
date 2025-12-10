import "./App.css";
import api from "./api/api";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type ProdutoType = {
  _id: string;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
  categoria?: string;
  estoque?: number;
  avaliacoes?: number;
  vendas?: number;
  criadoEm?: string;
};

interface DecodedToken {
  nome?: string;
  name?: string;
  tipo?: string;
  type?: string;
  role?: string;
  email?: string;
  sub?: string;
}

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [query, setQuery] = useState("");
  const [ordenar, setOrdenar] = useState<"padrao" | "preco-asc" | "preco-desc" | "nome">("padrao");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string>("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const tipoUsuario = (localStorage.getItem("tipoUsuario") || "").trim().toLowerCase();

  // =============================== TOKEN ================================
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } catch (err) {
      console.error("Token inválido:", err);
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  // =============================== BUSCAR PRODUTOS ================================
  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    setCarregando(true);
    setErro("");

    try {
      const res = await api.get("/produtos");
      const produtos = Array.isArray(res.data) ? res.data : [];
      setProdutos(produtos);
    } catch (err: any) {
      console.error("Erro ao buscar produtos:", err);
      setErro("Erro ao carregar produtos. Tente novamente.");
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  }

  // =============================== LOGOUT ================================
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    navigate("/login");
  }

  // =============================== FORM CADASTRO PRODUTO ================================
  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      nome: (formData.get("nome") as string).trim(),
      preco: Number(formData.get("preco")),
      urlfoto: (formData.get("urlfoto") as string).trim(),
      descricao: (formData.get("descricao") as string).trim(),
    };

    if (!data.nome || !data.urlfoto || !data.descricao) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await api.post("/produtos", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const novoProduto = res.data as ProdutoType;
      if (novoProduto && novoProduto._id) {
        setProdutos((prev) => [...prev, novoProduto]);
      } else {
        await fetchProdutos();
      }

      form.reset();
      alert("Produto cadastrado com sucesso!");

    } catch (err: any) {
      alert("Erro ao cadastrar: " + (err.response?.data?.mensagem || err.message));
    }
  }

  // =============================== ADICIONAR AO CARRINHO ================================
  async function adicionarCarrinho(produtoId: string) {
    if (!token) {
      alert("Faça login para adicionar ao carrinho.");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/adicionarItem",
        { produtoId, quantidade: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Produto adicionado ao carrinho!");
      navigate("/carrinho");

    } catch (err: any) {
      alert("Erro ao adicionar: " + (err.response?.data?.mensagem || err.message));
    }
  }

  // =============================== EXCLUIR PRODUTO ================================
  async function excluirProduto(produtoId: string) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${produtoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProdutos((prev) => prev.filter((p) => p._id !== produtoId));
      alert("Produto excluído!");

    } catch (err: any) {
      alert("Erro ao excluir: " + (err.response?.data?.mensagem || err.message));
    }
  }

  // =============================== IR PARA CARRINHO ================================
  function irParaCarrinho() {
    if (!token) {
      alert("Faça login para acessar o carrinho.");
      navigate("/login");
      return;
    }
    navigate("/carrinho");
  }

  // =============================== FILTRO E ORDENAR ================================
  const produtosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();

    let lista = produtos.filter((p) =>
      p.nome.toLowerCase().includes(q) ||
      (p.descricao || "").toLowerCase().includes(q) ||
      (p.categoria || "").toLowerCase().includes(q)
    );

    if (ordenar === "preco-asc") lista = lista.sort((a, b) => a.preco - b.preco);
    if (ordenar === "preco-desc") lista = lista.sort((a, b) => b.preco - a.preco);
    if (ordenar === "nome") lista = lista.sort((a, b) => a.nome.localeCompare(b.nome));

    return lista;
  }, [produtos, query, ordenar]);

  const totalProdutos = produtos.length;

  // =============================== RENDER ================================
  return (
    <>
      {erro && (
        <div className="error-banner">
          {erro}
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1 className="hero-title">SanPhone</h1>
            <p className="hero-sub">Celulares, acessórios e ofertas selecionadas</p>
          </div>

          <div className="hero-actions">
            <input
              placeholder="Pesquisar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />

            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as any)}
            >
              <option value="padrao">Ordenar: Padrão</option>
              <option value="preco-asc">Preço: menor → maior</option>
              <option value="preco-desc">Preço: maior → menor</option>
              <option value="nome">Nome: A → Z</option>
            </select>

            <button onClick={() => fetchProdutos()}>Atualizar</button>
          </div>
        </div>
      </section>

      {/* USER BOX */}
      {user && (
        <div className="user-box">
          <div><strong>Usuário:</strong> {user.nome || user.name || "—"}</div>
          <div>{user.tipo || user.type || user.role || "Tipo não informado"}</div>
        </div>
      )}

      {/* HEADER */}
      <header className="main-header">
        <button onClick={() => navigate("/")} className="logo-btn">SanPhone</button>

        <div className="header-actions">
          <button onClick={() => navigate("/produtos")}>Produtos</button>
          <button onClick={irParaCarrinho}>Carrinho</button>

          {token ? (
            <button className="danger" onClick={handleLogout}>Sair</button>
          ) : (
            <button onClick={() => navigate("/login")}>Entrar</button>
          )}
        </div>
      </header>

      {/* PAINEL ADMIN */}
      {tipoUsuario === "admin" && (
        <section className="admin-panel">
          <h3>Cadastrar Produto</h3>
          <form onSubmit={handleForm} className="admin-form">
            <input name="nome" placeholder="Nome" required />
            <input name="preco" type="number" placeholder="Preço" required />
            <input name="urlfoto" placeholder="URL da foto" required />
            <input name="descricao" placeholder="Descrição" required />
            <button type="submit">Cadastrar</button>
          </form>
        </section>
      )}

      {/* CATÁLOGO */}
      <main className="container">
        <div className="catalog-header">
          <h2>Catálogo</h2>
          <span>Total: {totalProdutos}</span>
          <span>Mostrando: {produtosFiltrados.length}</span>
        </div>

        {carregando ? (
          <div className="loading">Carregando...</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="empty">Nenhum produto encontrado.</div>
        ) : (
          <section className="grid-produtos">
            {produtosFiltrados.map((produto) => (
              <article key={produto._id} className="card">
                <img src={produto.urlfoto} alt={produto.nome} />

                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>

                <div className="price">R$ {produto.preco.toFixed(2)}</div>

                <button onClick={() => adicionarCarrinho(produto._id)}>Adicionar</button>

                {tipoUsuario === "admin" && (
                  <button className="danger" onClick={() => excluirProduto(produto._id)}>
                    Excluir
                  </button>
                )}
              </article>
            ))}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div>SanPhone © {new Date().getFullYear()}</div>
      </footer>
    </>
  );
}

export default App;