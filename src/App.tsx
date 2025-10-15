import './App.css'
import api from './api/api'
import { useState, useEffect } from 'react'

type ProdutoType = {
  _id: string
  nome: string
  preco: number
  urlfoto: string
  descricao: string
}

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])

  // 🔹 Carrega os produtos do backend
  useEffect(() => {
    api.get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error('Erro ao buscar produtos:', error))
  }, [])

  // 🔹 Envia novo produto para o backend
  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    }

    try {
      const response = await api.post("/produtos", data)
      setProdutos([...produtos, response.data])
      form.reset()
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error)
    }
  }

  // 🔹 Adiciona um produto ao carrinho
  async function adicionarCarrinho(produtoId: string) {
    const clienteId = "12345" // depois pode vir do login

    try {
      await api.post("/carrinho", { produtoId, clienteId })
      alert("Produto adicionado ao carrinho!")
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
    }
  }

  return (
    <>
      <h2>Cadastro de Produtos</h2>
      <form onSubmit={handleForm}>
        <input type="text" name="nome" placeholder="Nome" required />
        <input type="number" name="preco" placeholder="Preço" required />
        <input type="text" name="urlfoto" placeholder="URL da Foto" required />
        <input type="text" name="descricao" placeholder="Descrição" required />
        <button type="submit">Cadastrar</button>
      </form>

      <h3>Lista de Produtos</h3>
      {produtos.map((produto) => (
        <div key={produto._id}>
          <h4>{produto.nome}</h4>
          <p>R$ {produto.preco}</p>
          {produto.urlfoto && (
            <img src={produto.urlfoto} alt={produto.nome} width="200" />
          )}
          <p>{produto.descricao}</p>
          <button onClick={() => adicionarCarrinho(produto._id)}>
            Adicionar ao carrinho
          </button>
        </div>
      ))}
    </>
  )
}

export default App
