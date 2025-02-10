import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ position: 'relative', mr: 8, ml: 8 }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={7}
        variant="outlined"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent form submission
            handleSubmit(e); // Pass the event to handleSubmit
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px', // Adjust the value for more or less curvature
          },
        }}
        placeholder="Ask a question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton type="submit">
              <ArrowForwardIcon />
            </IconButton>
          ),
        }}
      />
    </Box>

  );
};

export default QueryInput;

