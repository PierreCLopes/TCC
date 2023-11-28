import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks";
import { useField } from "@unform/core";
import { PessoaService } from "../../services/api/pessoas/PessoaService";

type TAutoCompleteOption = {
    id: number,
    label: string
}

interface IAutoCompletePessoaProps {
    isExternalLoading?: boolean;
    nomeField?: string;
    label: string
    disabled?: boolean;
    readonly?: boolean;
}

export const AutoCompletePessoa: React.FC<IAutoCompletePessoaProps> = ({isExternalLoading = false, nomeField = 'pessoa', label = 'Pessoa', disabled = false, readonly = false}) => {
    const {fieldName, registerField, defaultValue, error, clearError} = useField(nomeField);
    const {debounce} = useDebounce();

    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

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
            PessoaService.getAll(1, busca, selectedId?.toString())
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error){
                    //alert(result.message);
                } else {
                    setOpcoes(result.data.map(pessoa => ({id: pessoa.id, label: pessoa.nome})));
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
            readOnly={readonly}
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