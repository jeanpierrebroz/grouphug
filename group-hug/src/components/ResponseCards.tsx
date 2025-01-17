import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Source {
  title: string;
  description: string;
}

interface Response {
  query: string;
  response: string;
  sources: Source[];
}

interface ResponseCardsProps {
  responses: Response[];
}

const ResponseCards: React.FC<ResponseCardsProps> = ({ responses }) => {
  const [openSource, setOpenSource] = useState<Source | null>(null);

  const handleOpenSource = (source: Source) => {
    setOpenSource(source);
  };

  const handleCloseSource = () => {
    setOpenSource(null);
  };

  return (
    <>
      {responses.map((response, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {response.response}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Sources:
            </Typography>
            {response.sources.map((source, sourceIndex) => (
              <Button
                key={sourceIndex}
                variant="outlined"
                size="small"
                sx={{ mr: 1, mb: 1 }}
                onClick={() => handleOpenSource(source)}
              >
                {source.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      ))}
      <Dialog open={!!openSource} onClose={handleCloseSource}>
        <DialogTitle>{openSource?.title}</DialogTitle>
        <DialogContent>
          <Typography>{openSource?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSource}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResponseCards;

