import { Alert, AlertTitle, AlertProps } from '@mui/material';

type VAlertProps = AlertProps & {
  message: string; 
  onClose: () => void;
}

export const VAlert: React.FC<VAlertProps> = ({ message, onClose, ...rest}) => {

  return (
    <Alert
      {...rest}
      variant="filled"
      onClose={onClose}
    >
      <AlertTitle>Alerta</AlertTitle>
      {message}
    </Alert>
  );
};