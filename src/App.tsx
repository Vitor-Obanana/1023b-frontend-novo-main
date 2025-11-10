import "./App.css";
import api from "./api/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProdutoType = {
  _id: string;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
};

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const navigate = useNavigate();
  const tipoUsuario: string = (localStorage.getItem("tipoUsuario") || "")
    .trim()
    .toLowerCase();

 
  useEffect(() => {
    api
      .get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  
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
      nome: formData.get("nome") as string,
      preco: Number(formData.get("preco")),
      urlfoto: formData.get("urlfoto") as string,
      descricao: formData.get("descricao") as string,
    };

    try {
      const res = await api.post("/produtos", data);
      setProdutos((prev) => [...prev, res.data]);
      form.reset();
    } catch (err: any) {
      alert(
        "Erro ao cadastrar produto: " +
          (err?.response?.data?.mensagem || err.message)
      );
    }
  }


  async function adicionarCarrinho(produtoId: string) {
    try {
      await api.post("/adicionarItem", { produtoId, quantidade: 1 });
      navigate("/carrinho"); 
    } catch (err: any) {
      alert(
        "Erro ao adicionar: " +
          (err?.response?.data?.mensagem || err.message)
      );
    }
  }

  //  Excluir produto (somente admin)
  async function excluirProduto(produtoId: string) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${produtoId}`, {
        headers: { tipousuario: tipoUsuario },
      });
      setProdutos((prev) => prev.filter((p) => p._id !== produtoId));
    } catch (err: any) {
      alert(
        "Erro ao excluir: " +
          (err?.response?.data?.mensagem || err.message)
      );
    }
  }

  return (
    <>
      <header>
        <h1>Catálogo de Produtos</h1>
        <div>
          <button onClick={() => navigate("/carrinho")}>Ver Carrinho</button>
          <button className="danger" onClick={handleLogout}>
            Logout
          </button>
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
            <p>{produto.preco.toFixed(2)}</p>

            <div className="botoes">
              <button onClick={() => adicionarCarrinho(produto._id)}>
                Adicionar ao carrinho
              </button>

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

