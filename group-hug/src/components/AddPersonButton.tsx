import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const AddPersonButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    try {
      // If on resume tab, use resume content as description
      const personData = {
        name: name,
        description: description,
        resumeDescription: resumeContent
      };

      const response = await fetch('http://localhost:8000/add_person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      });
      
      if (response.ok) {
        console.log('Person added successfully');
        handleClose();
        // Reset all form fields
        setName('');
        setDescription('');
        setResumeContent('');
      } else {
        console.error('Failed to add person');
      }
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
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="person tabs">
              <Tab label="Manual" />
              <Tab label="Resume" />
            </Tabs>
          </Box>
          {tabValue === 0 ? (
            <>
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
            </>
          ) : (
            <>
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
                label="Resume Content"
                fullWidth
                multiline
                rows={8}
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                placeholder="Paste resume content here..."
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add Person</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPersonButton;

