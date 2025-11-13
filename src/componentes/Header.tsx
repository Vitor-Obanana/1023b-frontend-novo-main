// Bianca A5: Exibe nome e tipo do usuario logado
import jwtDecode from "jwt-decode";

type TokenData = {
  nome: string;
  tipo: string;
};

export default function Header() {
  const token = localStorage.getItem("token");
  let nome = "Visitante";
  let tipo = "";

  if (token) {
    try {
      const decoded = jwtDecode<TokenData>(token);
      nome = decoded.nome;
      tipo = decoded.tipo;
    } catch (error) {
      console.error("Token invalido:", error);
    }
  }

  return (
    <header className="bg-gray-800 text-white p-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">Loja de Joias</h1>
      <div>
        {tipo ? (
          <span>{nome} ({tipo})</span>
        ) : (
          <span>Visitante</span>
        )}
      </div>
    </header>
  );
}
