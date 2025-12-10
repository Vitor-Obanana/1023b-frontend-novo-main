import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './componentes/login/login.tsx'
import Erro from './componentes/erro/erro.tsx'
import Carrinho from './carrinho.tsx'
import ListaProdutos from './ListaProdutos.tsx'
import CadastroProdutos from './componentes/Admin/CadastroProdutos.tsx'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CartaoPagamento from "./CartaoPagamento.tsx";
import Pagamento from "./Pagamento";
import Sucesso from "./Sucesso";
import Header from "./Header";

// Sua chave pública do Stripe
const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Erro />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/produtos" element={<ListaProdutos />} />
        <Route path="/admin/cadastrar-produto" element={<CadastroProdutos />} />
        <Route path="/finalizar-compra" element={<Elements stripe={stripe}><CartaoPagamento /></Elements>}/>
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/sucesso" element={<Sucesso />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)