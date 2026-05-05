import React from 'react';
import { useNavigate } from 'react-router-dom';

function BotaoVoltar() {
  const navigate = useNavigate();

  const lidarComVoltar = () => {
    navigate(-1);
  };

  return (
    <button 
      onClick={lidarComVoltar} 
      className="btn btn-outline-secondary btn-sm"
    >
      ← Voltar
    </button>
  );
}

export default BotaoVoltar;