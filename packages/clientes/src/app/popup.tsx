import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Image from "next/image";

const Popup = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Anuncio</DialogTitle>
      <DialogContent>
      <Image
          src="/images/nuevosplanes.jpg"
          alt="Logo"
          width={600}
          height={600}
        />
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
