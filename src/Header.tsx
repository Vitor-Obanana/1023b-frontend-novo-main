import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Header.css";

type UserData = {
  nome: string;
  tipo: string;
};

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          nome: decoded.nome,
          tipo: decoded.tipo,
        });
      } catch (err) {
        console.log("Token inválido");
      }
    }
  }, []);

  return (
    <header className="header">
      <h1 className="logo">Minha Loja</h1>

      {user && (
        <div className="user-info">
          <p><strong>{user.nome}</strong></p>
          <span>{user.tipo}</span>
        </div>
      )}
    </header>
  );
}