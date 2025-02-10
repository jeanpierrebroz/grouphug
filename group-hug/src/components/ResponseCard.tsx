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
import PersonIcon from '@mui/icons-material/Person';
import Diversity3Icon from '@mui/icons-material/Diversity3';

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
    console.log(response)
    setOpenSource(source);
  };

  const handleCloseSource = () => {
    setOpenSource(null);
  };

  return (
    <Card sx={{ mb: 2, mr: 8, ml:8 }}>
      <CardContent>
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {response.query}
        </Typography>

        <Typography variant="body1" component="div">
          {response.response.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {response.sources.map((source, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => handleOpenSource(source)}
              sx={{ mr: 1, mb: 1 }}
              startIcon={index < 6 ? <PersonIcon /> : <Diversity3Icon />}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      </CardContent>
      <Dialog open={!!openSource} onClose={handleCloseSource}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            {openSource?.title}
          </Box>
        </DialogTitle>
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

