import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;       // El tipo de input es opcional (por defecto será 'text')
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;  // Función para manejar cambios
  className?: string;  // Clases CSS opcionales
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`input-group ${className}`}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
};

export default InputField;
