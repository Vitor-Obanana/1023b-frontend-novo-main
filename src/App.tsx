import './App.css'
import api from './api/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type ProdutoType = {
  _id: string
  nome: string
  preco: number
  urlfoto: string
  descricao: string
}

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const navigate = useNavigate()
  const tipoUsuario: string = (localStorage.getItem('tipoUsuario') || '').trim().toLowerCase()

  useEffect(() => {
    api.get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error('Erro ao buscar produtos:', err))
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('tipoUsuario')
    navigate('/login')
  }

  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    }

    api.post("/produtos", data)
      .then((res) => setProdutos([...produtos, res.data]))
      .catch((err) => alert('Erro ao cadastrar produto: ' + (err?.response?.data?.mensagem || err.message)))

    form.reset()
  }

  function adicionarCarrinho(produtoId: string) {
    api.post('/adicionarItem', { produtoId, quantidade: 1 })
      .then(() => alert("Produto adicionado ao carrinho!"))
      .catch((err) => alert('Erro ao adicionar: ' + (err?.response?.data?.mensagem || err.message)))
  }

  function removerDoCarrinho(produtoId: string) {
    api.post('/removerItem', { produtoId })
      .then(() => {
        alert("Produto removido do carrinho!")
        setProdutos(prev => prev.filter(p => p._id !== produtoId))
      })
      .catch((err) => alert('Erro ao remover: ' + (err?.response?.data?.mensagem || err.message)))
  }

  function excluirProduto(produtoId: string) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return

    api.delete(`/produtos/${produtoId}`, {
      headers: { tipousuario: tipoUsuario }
    })
      .then(() => setProdutos(prev => prev.filter(p => p._id !== produtoId)))
      .catch((err) => alert('Erro ao excluir: ' + (err?.response?.data?.mensagem || err.message)))
  }

  return (
    <>
      <header>
        <h1>Cadastro de Produtos</h1>
        <div>
          <button onClick={() => navigate("/carrinho")}>Ver Carrinho</button>
          <button className="danger" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <form onSubmit={handleForm}>
        <input type="text" name="nome" placeholder="Nome" required />
        <input type="number" name="preco" placeholder="Preço" required />
        <input type="text" name="urlfoto" placeholder="URL da Foto" required />
        <input type="text" name="descricao" placeholder="Descrição" required />
        <button type="submit">Cadastrar</button>
      </form>

      <div>
        <h2>Lista de Produtos</h2>
        {produtos.map(produto => (
          <div key={produto._id} className="produto-card">
            <h3>{produto.nome}</h3>
            <p>R$ {produto.preco.toFixed(2)}</p>
            <img src={produto.urlfoto} alt={produto.nome} />
            <p>{produto.descricao}</p>
            <div className="botoes">
              <button onClick={() => adicionarCarrinho(produto._id)}>Adicionar ao carrinho</button>
              <button className="warning" onClick={() => removerDoCarrinho(produto._id)}>Remover do carrinho</button>
              {tipoUsuario === 'admin' && (
                <button className="danger" onClick={() => excluirProduto(produto._id)}>Excluir produto</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
