import { useNavigate } from "react-router-dom";
import "./Sucesso.css";

export default function Sucesso() {
  const navigate = useNavigate();

  return (
    <div className="sucesso-container">
      <div className="sucesso-card">
        <h1>Pagamento Concluído!</h1>
        <p>Seu pedido foi processado com sucesso.</p>

        <div className="botoes">
          <button onClick={() => navigate("/")}>
             Voltar para o início
          </button>
        </div>
      </div>
    </div>
  );
}