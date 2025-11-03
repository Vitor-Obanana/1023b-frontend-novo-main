import './App.css'
import api from './api/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const navigate = useNavigate()

  // ✅ Função de logout
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('tipoUsuario')
    navigate('/login')
  }

  useEffect(() => {
    api.get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

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
      .then((response) => setProdutos([...produtos, response.data]))
      .catch((error) => {
        console.error('Error posting data:', error)
        alert('Error posting data:' + error?.mensagem)
      })
    form.reset()
  }

  function adicionarCarrinho(produtoId: string) {
    api.post('/adicionarItem', { produtoId, quantidade: 1 })
      .then(() => alert("Produto adicionado no carrinho!"))
      .catch((error) => {
        console.error('Error posting data:', error)
        alert('Error posting data:' + error?.mensagem)
      })
  }

  return (
    <>
      {/* ✅ Cabeçalho com Logout */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#222',
        color: 'white'
      }}>
        <h1>Cadastro de Produtos</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      {/* Formulário */}
      <form onSubmit={handleForm} style={{ margin: '20px' }}>
        <input type="text" name="nome" placeholder="Nome" />
        <input type="number" name="preco" placeholder="Preço" />
        <input type="text" name="urlfoto" placeholder="URL da Foto" />
        <input type="text" name="descricao" placeholder="Descrição" />
        <button type="submit">Cadastrar</button>
      </form>

      {/* Lista de Produtos */}
      <div style={{ margin: '20px' }}>
        <h2>Lista de Produtos</h2>
        {produtos.map((produto) => (
          <div key={produto._id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px'
          }}>
            <h3>{produto.nome}</h3>
            <p>R$ {produto.preco}</p>
            <img src={produto.urlfoto} alt={produto.nome} width="200" />
            <p>{produto.descricao}</p>
            <button onClick={() => adicionarCarrinho(produto._id)}>
              Adicionar ao carrinho
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
