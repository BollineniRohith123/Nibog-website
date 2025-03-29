import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          className="block text-gray-700 text-sm font-bold mb-2" 
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border 
          ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-md focus:outline-none 
          focus:ring-2 focus:ring-blue-300
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs italic mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
