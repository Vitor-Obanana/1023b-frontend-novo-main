import React from "react";

export default function Header() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
      <div><strong>Minha Loja</strong></div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.nome} ({user.tipo})</span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <a href="/login">Entrar</a>
        )}
      </div>
    </header>
  );
}