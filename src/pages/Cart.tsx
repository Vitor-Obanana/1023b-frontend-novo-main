import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Cart({ cartId }) {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  async function loadCart() {
    // implementar rota GET /cart/:cartId no backend conforme tua modelagem
    try {
      const res = await api.get(`/cart/${cartId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar carrinho');
    }
  }

  useEffect(()=>{ if (cartId) loadCart(); }, [cartId]);

  async function handleDeleteCart() {
    if (!window.confirm('Tem certeza que deseja excluir o carrinho inteiro?')) return;
    try {
      await api.delete(`/cart/${cartId}`);
      alert('Carrinho excluído');
      navigate('/products'); // volta pra lista
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erro ao excluir carrinho');
    }
  }

  if (!cart) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Seu Carrinho</h2>
      {cart.items.map(i => (
        <div key={i._id}>
          {i.name} - {i.qty} x R$ {i.price.toFixed(2)}
        </div>
      ))}
      <div>Total: R$ {cart.items.reduce((s, it)=> s + it.price * it.qty, 0).toFixed(2)}</div>
      <button onClick={handleDeleteCart}>Excluir carrinho inteiro</button>
    </div>
  );
}
