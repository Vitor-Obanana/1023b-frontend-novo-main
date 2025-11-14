// Bianca A5: Exibe nome e tipo do usuário logado
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type TokenData = {
  nome: string;
  tipo: string; // "ADMIN" ou "USER"
};

export default function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let nome = "Visitante";
  let tipo = "";

  if (token) {
    try {
      const decoded = jwtDecode<TokenData>(token);
      nome = decoded.nome ?? "Usuário";
      tipo = decoded.tipo ?? "";
    } catch (erro) {
      console.error("Token inválido ou expirado:", erro);
      localStorage.removeItem("token");
    }
  }

  function sair() {
    localStorage.removeItem("token");
    navigate("/login"); // redireciona
    window.location.reload(); // força atualização
  }

  return (
    <header className="bg-gray-800 text-white p-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">Loja de Celular</h1>

      <div className="flex items-center gap-4">
        {tipo ? (
          <>
            <span>
              {nome} ({tipo})
            </span>
            <button
              onClick={sair}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Sair
            </button>
          </>
        ) : (
          <span>Visitante</span>
        )}
      </div>
    </header>
  );
}
