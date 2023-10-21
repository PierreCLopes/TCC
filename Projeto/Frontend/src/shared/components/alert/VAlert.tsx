import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface CustomAlertProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export const VAlert: React.FC<CustomAlertProps> = ({ open, message, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Alerta</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
