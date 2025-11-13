import { useEffect, useState } from "react";
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

// Definições de Tipos (Interfaces)
interface CartItem {
  _id: string;
  name: string;
  qty: number;
  price: number;
}

interface CartData {
  _id: string;
  items: CartItem[];
}

interface CartProps {
  cartId: string;
}

// O componente agora recebe as props tipadas
export default function Cart({ cartId }: CartProps) {
  // O estado 'cart' agora é tipado como CartData ou null
  const [cart, setCart] = useState<CartData | null>(null);
  const navigate = useNavigate();

  async function loadCart() {
    try {
      const res = await api.get(`/cart/${cartId}`);
      setCart(res.data);
    } catch (err: unknown) { // Tipagem do erro para unknown
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
    } catch (err: unknown) {
      console.error(err);
      // Usando 'as any' para tratar o 'err' como se fosse um objeto AxiosError
      const errorMessage = (err as any)?.response?.data?.message || 'Erro ao excluir carrinho';
      alert(errorMessage);
    }
  }

  if (!cart) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Seu Carrinho</h2>
      {/* O 'i' (item) agora é inferido como CartItem */}
      {cart.items.map(i => (
        <div key={i._id}>
          {i.name} - {i.qty} x R$ {i.price.toFixed(2)}
        </div>
      ))}
      <div>
        {/* 's' (acumulador) e 'it' (item) agora são tipados corretamente */}
        Total: R$ {cart.items.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2)}
      </div>
      <button onClick={handleDeleteCart}>Excluir carrinho inteiro</button>
    </div>
  );
}