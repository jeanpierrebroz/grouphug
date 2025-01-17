import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';

interface QueryInputProps {
  onSubmit: (query: string) => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={5}
        variant="outlined"
        placeholder="Ask a question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ pr: 5 }}
      />
      <IconButton
        type="submit"
        sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default QueryInput;

