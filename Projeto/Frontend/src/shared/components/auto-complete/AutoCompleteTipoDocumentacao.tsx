import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks";
import { TipoDocumentacaoService } from "../../services/api/documentacoes/TipoDocumentacaoService";
import { useField } from "@unform/core";

type TAutoCompleteOption = {
    id: number,
    label: string
}

interface IAutoCompleteTipoDocumentacaoProps {
    isExternalLoading?: boolean;
    nomeField?: string
    disabled?: boolean;
}

export const AutoCompleteTipoDocumentacao: React.FC<IAutoCompleteTipoDocumentacaoProps> = ({isExternalLoading = false, nomeField = 'tipodocumentacao', disabled = false}) => {
    const {fieldName, registerField, error, clearError} = useField(nomeField);
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
            TipoDocumentacaoService.getAll(1, busca, selectedId?.toString())
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error){
                    //alert(result.message);
                } else {
                    setOpcoes(result.data.map(tipo => ({id: tipo.id, label: tipo.nome})));
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
                    label="Tipo documentação"
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    );
};