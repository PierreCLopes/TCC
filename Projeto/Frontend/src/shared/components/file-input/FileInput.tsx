import { useEffect, useState } from 'react';
import { Icon, IconButton } from '@mui/material';
import { useField } from '@unform/core';
import { MuiFileInput } from 'mui-file-input';

type FileInputProps = {
  name: string;
  extensao: string;
  disabled: boolean;
};

export const FileInput: React.FC<FileInputProps> = ({ name, extensao, disabled, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

  const [value, setValue] = useState(defaultValue || '');
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => {
        setValue(newValue)
        if(newValue){
            // Crie um Blob a partir do arquivo
            const blob = new Blob([newValue]);

            // Crie um URL temporário para o Blob
            const url = URL.createObjectURL(blob);
            setDownloadURL(url);
          }
    },
    });
  }, [registerField, fieldName, value]);

  const handleDownload = () => {
    if (downloadURL) {
      // Crie um link oculto para o download
      const downloadLink = document.createElement('a');
      downloadLink.style.display = 'none';
      downloadLink.href = downloadURL;
      downloadLink.download = `arquivo.${extensao}`;

      // Anexe o link ao corpo do documento
      document.body.appendChild(downloadLink);

      // Dispare o clique no link para iniciar o download
      downloadLink.click();

      // Remova o link do corpo do documento
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>

      <MuiFileInput
        {...rest}
        error={!!error}
        helperText={error}
        value={value}
        hideSizeText
        disabled={disabled}
        fullWidth
        InputProps={{
        }}
        onChange={(file) => {
          setValue(file);

          if(file){
            // Crie um Blob a partir do arquivo
            const blob = new Blob([file]);

            // Crie um URL temporário para o Blob
            const url = URL.createObjectURL(blob);
            setDownloadURL(url);
          }
            
        }}
        onKeyDown={e => {
          error && clearError();
        }}
      />
      
      {downloadURL && (
        <IconButton color="primary" aria-label="download" onClick={handleDownload}>
            <Icon>download</Icon>
        </IconButton>
      )}

    </div>
  );
};
