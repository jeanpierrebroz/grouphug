import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';

interface Source {
  title: string;
  description: string;
}

interface ResponseCardProps {
  response: {
    query: string;
    response: string;
    sources: Source[];
  };
}

const ResponseCard: React.FC<ResponseCardProps> = ({ response }) => {
  const [openSource, setOpenSource] = useState<Source | null>(null);

  const handleOpenSource = (source: Source) => {
    setOpenSource(source);
  };

  const handleCloseSource = () => {
    setOpenSource(null);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Query: {response.query}
        </Typography>
        <Typography variant="body1" component="div">
          {response.response}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {response.sources.map((source, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => handleOpenSource(source)}
              sx={{ mr: 1, mb: 1 }}
            >
              {source.title}
            </Button>
          ))}
        </Box>
      </CardContent>
      <Dialog open={!!openSource} onClose={handleCloseSource}>
        <DialogTitle>{openSource?.title}</DialogTitle>
        <DialogContent>
          <Typography>{openSource?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSource}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ResponseCard;

