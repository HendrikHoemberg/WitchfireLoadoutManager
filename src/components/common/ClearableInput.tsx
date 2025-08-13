"use client";

import React, { useRef } from 'react';

type ClearableInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  containerClassName?: string;
};

const ClearableInput: React.FC<ClearableInputProps> = ({
  value,
  onChange,
  onClear,
  className = '',
  containerClassName = '',
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      // For controlled inputs, trigger onChange with an empty value
      onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
    // Refocus the input after clearing
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${containerClassName}`}>
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        className={`pr-8 ${className}`}
        {...rest}
      />
      {value !== '' && value !== null && value !== undefined && (
        <button
          type="button"
          aria-label="Clear input"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 z-800 rounded-full text-gray-300 hover:text-white hover:bg-[#5a5a5a] flex items-center justify-center"
          onClick={handleClear}
          title="Clear"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ClearableInput;
