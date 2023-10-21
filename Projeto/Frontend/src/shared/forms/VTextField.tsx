import { useEffect, useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useField } from '@unform/core';
import { formatCNPJCPF, formatCPF, formatRG } from './FormatInput';


type TVTextFieldProps = TextFieldProps & {
  name: string;
}
export const VTextField: React.FC<TVTextFieldProps> = ({ name, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  return (
    <TextField
      {...rest}

      error={!!error}
      helperText={error}
      defaultValue={defaultValue}

      value={value}
      onChange={e => { if (fieldName === "cnpjcpf"){
                        setValue(formatCNPJCPF(e.target.value));

                      } else if (fieldName === "cfta") {
                        setValue(formatCPF(e.target.value));

                      } else if (fieldName === "rg") {
                        setValue(formatRG(e.target.value));

                      } else {
                        setValue(e.target.value);

                      }; rest.onChange?.(e); }}

      onKeyDown={e => {error && clearError(); rest.onKeyDown?.(e)}}
      />
  );
};