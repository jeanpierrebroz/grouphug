import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const AddPersonButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:8000/add_person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      handleClose();
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen} sx={{ mr: 1 }}>
        Add a Person
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add a Person</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Person Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Person Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Person</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPersonButton;

