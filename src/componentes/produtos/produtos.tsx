import "./../../App.css";
import api from "../../api/api";
import { useState, useEffect } from "react";

type ProdutoType = {
  _id: string;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
};

function Produtos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);

  useEffect(() => {
    api
      .get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      nome: formData.get("nome") as string,
      preco: Number(formData.get("preco")),
      urlfoto: formData.get("urlfoto") as string,
      descricao: formData.get("descricao") as string,
    };

    api
      .post("/produtos", data)
      .then((response) => setProdutos([...produtos, response.data]))
      .catch((error) => {
        console.error("Erro ao cadastrar produto:", error);
        alert("Erro ao cadastrar produto: " + error?.mensagem);
      });

    form.reset();
  }

  function adicionarCarrinho(produtoId: string) {
    api
      .post("/adicionarItem", { produtoId, quantidade: 1 })
      .then(() => alert("Produto adicionado ao carrinho!"))
      .catch((error) => {
        console.error("Erro ao adicionar ao carrinho:", error);
        alert("Erro ao adicionar ao carrinho: " + error?.mensagem);
      });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cadastro de Produtos</h1>
      <form onSubmit={handleForm}>
        <input type="text" name="nome" placeholder="Nome" required />
        <input type="number" name="preco" placeholder="Preço" required />
        <input type="text" name="urlfoto" placeholder="URL da Foto" />
        <input type="text" name="descricao" placeholder="Descrição" />
        <button type="submit">Cadastrar</button>
      </form>

      <h2>Lista de Produtos</h2>
      <div>
        {produtos.map((produto) => (
          <div key={produto._id}>
            <h3>{produto.nome}</h3>
            <p>R$ {produto.preco}</p>
            <img src={produto.urlfoto} alt={produto.nome} width="200" />
            <p>{produto.descricao}</p>
            <button onClick={() => adicionarCarrinho(produto._id)}>
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Produtos;
