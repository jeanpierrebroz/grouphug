import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QueryInput from './components/QueryInput';
import ResponseCard from './components/ResponseCard';
import AddPersonButton from './components/AddPersonButton';
import AddProjectButton from './components/AddProjectButton';
import CircularProgress from '@mui/material/CircularProgress'; // Import the CircularProgress component
import logo from './logo.webp';

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

interface QueryResponse {
  query: string;
  response: string;
  sources: { title: string; description: string }[];
}

function App() {
  const [responses, setResponses] = useState<QueryResponse[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleQuery = async (query: string) => {
    setLoading(true); // Set loading to true when the query starts

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
      });
      const data: QueryResponse = await response.json();
      console.log(data.sources);
      setResponses([...responses, data]);
    } catch (error) {
      console.error('Error sending query:', error);
    } finally {
      setLoading(false); // Set loading to false once the request finishes
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Group Hug
          </Typography>
          <Box sx={{ mb: 2 }}>
            {responses.map((response, index) => (
              <ResponseCard key={index} response={response} />
            ))}
          </Box>

          {/* Conditionally render QueryInput or loading spinner */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress /> {/* Show loading spinner */}
            </Box>
          ) : (
            <QueryInput onSubmit={handleQuery} />
          )}

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
