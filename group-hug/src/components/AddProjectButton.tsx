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

const AddProjectButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    const data = { name, description, githubUrl };

    try {
      const response = await fetch('http://localhost:8000/add_project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log('Project added successfully');
        handleClose();
        setName('');
        setDescription('');
        setGithubUrl('');
      } else {
        console.error('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen} sx={{ ml: 1 }}>
        Add a Project
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add a Project</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="project tabs">
              <Tab label="Manual" />
              <Tab label="GitHub" />
            </Tabs>
          </Box>
          {tabValue === 0 ? (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Project Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Project Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="GitHub URL"
              fullWidth
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddProjectButton;
