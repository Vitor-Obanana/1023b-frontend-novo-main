import { useEffect, useState } from "react";
import api from "../api/api";

interface Usuario {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Usuario[]>("/admin/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
        setErro("Não foi possível carregar os usuários.");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuários Cadastrados</h1>

      {erro && <p className="text-red-500 mb-3">{erro}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nome</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{u.nome}</td>
                <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                <td className="border border-gray-300 px-4 py-2">{u.tipo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                Nenhum usuário cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;

