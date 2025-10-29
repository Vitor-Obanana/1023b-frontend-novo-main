import React, { useEffect, useState } from "react";
import api from "../api/api";

type Cart = {
  _id: string;
  itens: any[];
  usuario: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    loadMyCart();
  }, []);

  const loadMyCart = async () => {
    try {
      const res = await api.get("/carts/me");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCart = async () => {
    if (!cart) return alert("Nenhum carrinho encontrado");
    if (!confirm("Confirma excluir todo o carrinho?")) return;
    try {
      await api.delete(`/carts/${cart._id}`);
      alert("Carrinho excluído");
      setCart(null);
    } catch (err: any) {
      alert(err?.response?.data?.mensagem || "Erro ao excluir carrinho");
    }
  };

  return (
    <div>
      <h3>Meu Carrinho</h3>
      {cart ? (
        <>
          <p>Itens: {cart.itens.length}</p>
          <button onClick={handleDeleteCart}>Excluir Carrinho Inteiro</button>
        </>
      ) : (
        <p>Você não tem carrinho</p>
      )}
    </div>
  );
}
