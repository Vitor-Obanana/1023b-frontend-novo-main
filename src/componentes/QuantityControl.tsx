// Bianca B2: Componente que altera a quantidade de itens no carrinho
type Props = {
  quantidade: number;
  onChange: (nova: number) => void;
};

export default function QuantityControl({ quantidade, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onChange(quantidade - 1)} 
        disabled={quantidade <= 1} 
        className="bg-gray-300 px-2 rounded"
      >
        -
      </button>
      <span>{quantidade}</span>
      <button 
        onClick={() => onChange(quantidade + 1)} 
        className="bg-gray-300 px-2 rounded"
      >
        +
      </button>
    </div>
  );
}
