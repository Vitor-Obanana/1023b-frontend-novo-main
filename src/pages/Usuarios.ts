import { useEffect, useState } from "react";
import api from "../../api/api";

type Usuario = {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Bianca - busca os usuarios cadastrados
  useEffect(() => {
    api.get("/admin/usuarios")
      .then(res => setUsuarios(res.data))
      .catch(err => console.error("Erro ao buscar usuarios", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuarios Cadastrados</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u._id} className="border-t">
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
