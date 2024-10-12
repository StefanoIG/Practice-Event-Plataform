import React from 'react';

// Definimos una interfaz para los props
interface ButtonProps {
  text: string;
  onClick: () => void;  // Función que no recibe parámetros y no retorna nada (void)
  className?: string;   // La clase CSS es opcional (opcional con ?)
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '' }) => {
  return (
    <button onClick={onClick} className={`btn ${className}`}>
      {text}
    </button>
  );
};

export default Button;
