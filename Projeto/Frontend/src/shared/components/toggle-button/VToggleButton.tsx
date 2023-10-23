import React, { useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, ToggleButton, ToggleButtonGroup, FormHelperText } from '@mui/material';
import { useField } from '@unform/core';

interface ToggleButtonProps {
  value: string;
  options: string[];
}

interface ToggleButtonGroupFieldProps {
  name: string;
  label: string;
  options: ToggleButtonProps;
}

export const VToggleButton: React.FC<ToggleButtonGroupFieldProps> = ({ name, label, options }) => {
  const { fieldName, registerField, error, clearError } = useField(name);
  const toggleButtonRef = useRef<HTMLDivElement | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['']);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: toggleButtonRef.current,
      getValue: () => {
        return selectedOptions.join(',');
      },
      setValue: (newValue: string) => {
        setSelectedOptions(newValue.split(','));
      },
      clearValue: () => {
        setSelectedOptions([]);
      },
    });
  }, [fieldName, registerField, selectedOptions]);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newSelectedOptions: string[]) => {
    clearError();
    setSelectedOptions(newSelectedOptions);
  };

  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <ToggleButtonGroup
        value={selectedOptions}
        onChange={handleChange}
        exclusive={false}
        aria-label={label}
        ref={toggleButtonRef}
      >
        {options.options.map((option) => (
          <ToggleButton key={option} value={option}>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};
