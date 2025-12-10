import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import api from "./api/api";

export default function CartaoPagamento() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const pagar = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setStatus("");

    const { data } = await api.post("/criar-pagamento-cartao");
    const paymentData = data as { clientSecret: string };
    const { clientSecret } = paymentData;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement)!,
      },
    });

    if (result.error) {
      setStatus("Erro: " + result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      setStatus("Pagamento aprovado!");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <div>
        <label>Número do cartão</label>
        <CardNumberElement className="card-input" />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <div>
          <label>Validade</label>
          <CardExpiryElement className="card-input" />
        </div>

        <div>
          <label>CVC</label>
          <CardCvcElement className="card-input" />
        </div>
      </div>

      <button onClick={pagar} disabled={loading} style={{ marginTop: "20px" }}>
        {loading ? "Processando..." : "Pagar"}
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}