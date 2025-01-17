import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import QueryInput from './components/QueryInput';
import ResponseCards from './components/ResponseCards';
import AddPersonButton from './components/AddPersonButton';
import AddProjectButton from './components/AddProjectButton';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#feca57',
    },
    background: {
      default: '#fff9f9',
    },
  },
});

function App() {
  const [responses, setResponses] = useState<any[]>([]);

  const handleNewResponse = (response: any) => {
    setResponses((prev) => [...prev, response]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 2 }}>
          <ResponseCards responses={responses} />
          <QueryInput onNewResponse={handleNewResponse} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <AddPersonButton />
            <AddProjectButton />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

