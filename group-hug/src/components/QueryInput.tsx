import React, { useState } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface QueryInputProps {
  onNewResponse: (response: any) => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ onNewResponse }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      onNewResponse(data);
      setQuery('');
    } catch (error) {
      console.error('Error submitting query:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={5}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question..."
        variant="outlined"
        sx={{ pr: 5 }}
      />
      <IconButton
        sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
        onClick={handleSubmit}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default QueryInput;

