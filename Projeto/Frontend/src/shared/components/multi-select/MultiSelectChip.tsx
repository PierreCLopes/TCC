import React, { useRef, useState } from 'react';
import { Chip, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, SelectProps } from '@mui/material';
import { useField } from '@unform/core';

export interface MultiSelectChipOptions {
  value: number; 
  label: string 
}

type MultiSelectChipProps = SelectProps & {
  name: string;
  label: string;
  options: MultiSelectChipOptions[];
}

export const MultiSelectChip: React.FC<MultiSelectChipProps> = ({ name, label, options, ...rest }) => {
  const { fieldName, registerField, error } = useField(name);
  const selectRef = useRef(null);

  // Use um estado para controlar selectedValues
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = event.target.value as number[];
    setSelectedValues(selected);
  };

  // Register the field in Unform when the component mounts
  React.useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef,
      getValue: () => selectedValues,
      setValue: (_, newValue) => {
        setSelectedValues(newValue || []);
      },
      clearValue: (ref: any) => {
        setSelectedValues([]);
      },
    });
  }, [fieldName, registerField, selectedValues]);

  // Função para mapear os rótulos com base nos valores selecionados
  const getSelectedLabels = () => {
    return selectedValues.map((selectedValue) => {
      const option = options.find((option) => option.value === selectedValue);
      return option ? option.label : '';
    });
  };

  return (
    <FormControl fullWidth variant="outlined" error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...rest}
        label={label}
        multiple
        value={selectedValues}
        inputRef={selectRef}
        onChange={handleSelectChange as any}
        renderValue={() => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {getSelectedLabels().map((label) => (
              <Chip key={label} label={label} size='small'/>
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};
