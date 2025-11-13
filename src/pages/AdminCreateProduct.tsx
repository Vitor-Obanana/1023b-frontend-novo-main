import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminCreateProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    try {
      const body = { name, price: Number(price), category, description: desc };
      await api.post('/products', body); // auth header adicionado por interceptor
      setMsg('Produto criado com sucesso!');
      // opcional: navegar para lista
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || 'Erro ao criar produto');
    }
  }

  return (
    <div>
      <h2>Cadastrar Produto (Admin)</h2>
      {msg && <div>{msg}</div>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Preço" value={price} onChange={e=>setPrice(e.target.value)} />
        <input placeholder="Categoria" value={category} onChange={e=>setCategory(e.target.value)} />
        <textarea placeholder="Descrição" value={desc} onChange={e=>setDesc(e.target.value)} />
        <button type="submit">Criar Produto</button>
      </form>
    </div>
  );
}
