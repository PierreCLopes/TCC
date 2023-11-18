import { useEffect, useState } from 'react';
import { Checkbox, CheckboxProps } from '@mui/material';
import { useField } from '@unform/core';

type TVCheckBoxProps = CheckboxProps & {
  name: string;
  onChangeInterno?: () => void;
};

export const VCheckBox: React.FC<TVCheckBoxProps> = ({ name, onChangeInterno, ...rest }) => {
  const { fieldName, registerField, defaultValue } = useField(name);

  const [value, setValue] = useState(defaultValue || false);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  return (
    <Checkbox
      {...rest}
      checked={value} 
      onChange={() => {
        setValue(!value); 
        onChangeInterno && onChangeInterno(); // Verifica se onChangeInterno é uma função antes de chamá-la
      }} 
    />
  );
};
