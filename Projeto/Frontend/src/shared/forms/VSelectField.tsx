import React, { useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectProps, FormHelperText } from '@mui/material';
import { useField } from '@unform/core';

interface SelectOption {
  value: number; // Alterado para número
  label: string;
}

interface SelectFieldProps extends SelectProps {
  name: string;
  label: string;
  options: SelectOption[];
}

export const VSelectField: React.FC<SelectFieldProps> = ({ name, label, options, ...rest }) => {
  const { fieldName, defaultValue, registerField, error, clearError } = useField(name);
  const selectRef = useRef(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref) => {
        return ref.value ? parseInt(ref.value, 10) : undefined;
      },
      setValue: (ref, newValue) => {
        ref.value = newValue;
      },
      clearValue: (ref) => {
        ref.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        native
        defaultValue={defaultValue}
        inputProps={{
          id: fieldName,
        }}
        {...rest}
        inputRef={selectRef}
        onChange={e => {error && clearError()}}
      >
        <option value="" />
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};
