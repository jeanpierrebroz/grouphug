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
import CircularProgress from '@mui/material/CircularProgress';

const AddPersonButton: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // If on resume tab, use resume content as description
      const personData = {
        name: name,
        description: description,
        resumeDescription: resumeContent
      };

      const response = await fetch(`${API_URL}/add_person`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        onClick={handleOpen} 
        sx={{ mr: 1 }}
        disabled={isLoading}
      >
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
                placeholder="Write all of your skills/experience related to your role"
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
          <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Add Person'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPersonButton;

