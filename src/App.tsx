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
  const tipoUsuario = (localStorage.getItem("tipoUsuario") || "")
    .trim()
    .toLowerCase();

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

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    navigate("/login");
  }

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

    // Validação básica
    if (!data.nome || !data.urlfoto || !data.descricao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (data.preco <= 0) {
      alert("O preço deve ser maior que zero.");
      return;
    }

    try {
      const res = await api.post("/produtos", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Verifica se res.data é um produto válido
      if (res.data && (res.data as any)._id) {
        setProdutos((prev) => [...prev, res.data as ProdutoType]);
        form.reset();
        alert("Produto cadastrado com sucesso!");
      } else {
        // Se a resposta não contiver o produto, refaz a busca
        await fetchProdutos();
        form.reset();
        alert("Produto cadastrado com sucesso!");
      }
    } catch (err: any) {
      const mensagem = err?.response?.data?.mensagem || err?.response?.data?.message || err.message;
      alert("Erro ao cadastrar produto: " + mensagem);
    }
  }

  async function adicionarCarrinho(produtoId: string) {
    if (!token) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
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
      const mensagem = err?.response?.data?.mensagem || err?.response?.data?.message || err.message;
      alert("Erro ao adicionar: " + mensagem);
    }
  }

  async function excluirProduto(produtoId: string) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${produtoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos((prev) => prev.filter((p) => p._id !== produtoId));
      alert("Produto excluído com sucesso!");
    } catch (err: any) {
      const mensagem = err?.response?.data?.mensagem || err?.response?.data?.message || err.message;
      alert("Erro ao excluir: " + mensagem);
    }
  }

  function irParaCarrinho() {
    if (!token) {
      alert("Você precisa estar logado para acessar o carrinho.");
      navigate("/login");
      return;
    }
    navigate("/carrinho");
  }


  const produtosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    let lista = produtos.filter((p) => {
      if (!q) return true;
      return (
        p.nome.toLowerCase().includes(q) ||
        (p.descricao || "").toLowerCase().includes(q) ||
        (p.categoria || "").toLowerCase().includes(q)
      );
    });

    if (ordenar === "preco-asc") lista = lista.sort((a, b) => a.preco - b.preco);
    if (ordenar === "preco-desc") lista = lista.sort((a, b) => b.preco - a.preco);
    if (ordenar === "nome") lista = lista.sort((a, b) => a.nome.localeCompare(b.nome));

    return lista;
  }, [produtos, query, ordenar]);

  const totalProdutos = produtos.length;

  return (
    <>
      {}
      {erro && (
        <div className="error-banner" style={{ backgroundColor: "#fee", color: "#c33", padding: "12px", textAlign: "center", marginBottom: "16px" }}>
          {erro}
        </div>
      )}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <h1 className="hero-title">SanPhone</h1>
            <p className="hero-sub">Celulares, acessórios e ofertas selecionadas para você</p>
          </div>

          <div className="hero-actions">
            <div className="search-wrap" role="search" aria-label="Pesquisar produtos">
              <input
                aria-label="Pesquisar"
                placeholder="Pesquisar por nome, descrição ou categoria..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="controls">
              <select
                aria-label="Ordenar produtos"
                value={ordenar}
                onChange={(e) => setOrdenar(e.target.value as any)}
                className="select-ordenar"
              >
                <option value="padrao">Ordenar: Padrão</option>
                <option value="preco-asc">Preço: menor para maior</option>
                <option value="preco-desc">Preço: maior para menor</option>
                <option value="nome">Nome: A → Z</option>
              </select>

              <button className="btn-primario" onClick={() => fetchProdutos()}>
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </section>

      {user && (
        <div className="user-box" role="status" aria-live="polite">
          <div className="user-line">
            <strong>Usuário:</strong> {user.nome || user.name || "—"}
          </div>
          <div className="user-line small">
            {user.tipo || user.type || user.role || "Tipo não informado"}
          </div>
        </div>
      )}

 
      <header className="main-header">
        <h2 className="sr-only">SanPhone</h2>
        <div className="header-left">
          <button onClick={() => navigate("/")} className="logo-btn">SanPhone</button>
        </div>

        <div className="header-right">
          <div className="header-actions">
            <button onClick={() => navigate("/produtos")} className="ghost-btn">Produtos</button>
            <button onClick={irParaCarrinho} className="ghost-btn">Carrinho</button>

            {token ? (
              <button className="danger" onClick={handleLogout}>Sair</button>
            ) : (
              <button onClick={() => navigate("/login")} className="ghost-btn">Entrar</button>
            )}
          </div>
        </div>
      </header>


      {tipoUsuario === "admin" && (
        <section className="admin-panel">
          <h3>Painel Admin — Cadastrar produto</h3>
          <form onSubmit={handleForm} className="admin-form">
            <input name="nome" placeholder="Nome do produto" required />
            <input name="preco" type="number" placeholder="Preço" required />
            <input name="urlfoto" placeholder="URL da foto" required />
            <input name="descricao" placeholder="Descrição" required />
            <button type="submit">Cadastrar Produto</button>
          </form>
        </section>
      )}

      <main className="container">
        <div className="catalog-header">
          <h2>Catálogo</h2>
          <div className="catalog-meta">
            <span>Total: {totalProdutos}</span>
            <span>Mostrando: {produtosFiltrados.length}</span>
          </div>
        </div>

        {carregando ? (
          <div className="loading">Carregando produtos...</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="empty">Nenhum produto encontrado.</div>
        ) : (
          <section className="grid-produtos" aria-live="polite">
            {produtosFiltrados.map((produto) => (
              <article key={produto._id} className="card">
                <div className="card-img-wrap">
                  <img src={produto.urlfoto} alt={produto.nome} />
                </div>

                <div className="card-body">
                  <h3 className="card-title">{produto.nome}</h3>
                  <p className="card-desc">{produto.descricao}</p>

                  <div className="card-meta">
                    <div className="price">R$ {produto.preco.toFixed(2)}</div>
                    <div className="info">
                      <span>{produto.estoque ?? "—"} em estoque</span>
                      <span>{produto.vendas ?? 0} vendas</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    {token ? (
                      <button onClick={() => adicionarCarrinho(produto._id)}>Adicionar</button>
                    ) : (
                      <button disabled>Login para comprar</button>
                    )}

                    {tipoUsuario === "admin" && (
                      <button className="danger" onClick={() => excluirProduto(produto._id)}>Excluir</button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>SanPhone © {new Date().getFullYear()}</div>
          <div className="footer-links">
            <button className="ghost-btn" onClick={() => navigate("/contato")}>Contato</button>
            <button className="ghost-btn" onClick={() => navigate("/sobre")}>Sobre</button>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
