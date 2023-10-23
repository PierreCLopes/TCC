import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks";
import { useField } from "@unform/core";
import { UsuarioService } from "../../services/api/usuarios/UsuarioService";

type TAutoCompleteOption = {
    id: string,
    label: string
}

interface IAutoCompleteUsuarioProps {
    isExternalLoading?: boolean;
    nomeField?: string;
    label: string;
    disabled?: boolean;
}

export const AutoCompleteUsuario: React.FC<IAutoCompleteUsuarioProps> = ({isExternalLoading = false, nomeField = 'usuario', label = 'Usuario', disabled = false}) => {
    const {fieldName, registerField, defaultValue, error, clearError} = useField(nomeField);
    const {debounce} = useDebounce();

    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');
    
    useEffect(() => {
        registerField({
          name: fieldName,
          getValue: () => selectedId,
          setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
        });
      }, [registerField, fieldName, selectedId]);    
    

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            UsuarioService.getAll(1, busca, selectedId)
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error){
                    //alert(result.message);
                } else {
                    console.log(result);

                    setOpcoes(result.data.map(usuario => ({id: usuario.id, label: usuario.email})));
                }
            });
        })

    }, [busca, selectedId]);

    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedId) return null;
    
        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
        if (!selectedOption) return null;
    
        return selectedOption;
      }, [selectedId, opcoes]);

    return(
        <Autocomplete
            openText="Abrir"
            closeText="Fechar"
            noOptionsText="Sem opções"
            loadingText="Carregando..."

            disablePortal

            value={autoCompleteSelectedOption}
            options={opcoes}
            loading={isLoading}
            disabled={isExternalLoading || disabled}
            onInputChange={(e, newValue) => { setBusca(newValue) }}
            onChange={(e, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError(); }}
            popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28}/> : undefined}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    );
}; 